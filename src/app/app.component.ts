import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature } from '../models/feature';
import { Configuration } from '../models/configuration';

declare var require: any;
const moduleTags = require("./module-tags.json");
const industryList = require("./industry-list.json");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  private configuration: Configuration;
  private clients: any[];
  private client: any = null;
  private currentClient: number = 0;
  private currIndustry:  string;
  private industryList = industryList;
  private editMode: boolean;
  
  ngOnInit() {
  }

  private lookForMods(mods: string[], fromPackage: boolean) {
    mods.forEach(mod => {
        this.configuration.features.forEach( feat => {
          if (feat.tag === mod) {
            feat.customer = true;
            feat.fromPackage = fromPackage;
          }
        });
    });
  }

  private showUsing() {
    if(!this.client || !this.configuration){
      return;
    }

    for (var f = 0; f < this.configuration.features.length; f++) {
      this.configuration.features[f].customer = false;
      this.configuration.features[f].fromPackage = false;
    }

    moduleTags.forEach(mod => {
      if (this.client[mod.tag] !== "X")
        return;
      if (mod.match) {
        this.client.package = mod.tag;
        this.lookForMods(mod.match, true);
      } else {
        this.lookForMods([mod.tag], false);
      }
    });
  }

  private loadConfiguration() {
    this.http.get('/api/configurations/' + this.currIndustry).subscribe((data:Feature[]) => {
      this.configuration = new Configuration(this.currIndustry);
      this.configuration.features = data;
      this.showUsing();
      this.editMode = false; 
   });
  }

  onDownload() {
    this.http.get('/api/clients').subscribe((data:any[]) => {
      this.clients = data;
      this.client = this.clients[this.currentClient];
      this.showUsing();
    });
  }

  onIndustryChanged() {
    this.loadConfiguration();
  }

  onSave() {
    this.http.post('/api/configurations/save', this.configuration).subscribe(res => {
      console.log("saved");
    });
  }

  onCancel() {
    this.loadConfiguration();
  }

  onPrev() {
    if (this.currentClient > 0) {
      this.client = this.clients[--this.currentClient];
      this.showUsing();
    }
  }

  onNext() {
    if (this.currentClient < this.clients.length - 1) {
      this.client = this.clients[++this.currentClient];
      this.showUsing();
    }
  }
}
