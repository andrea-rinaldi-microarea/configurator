import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature } from '../models/feature';
import { Configuration } from '../models/configuration';

declare var require: any;
const moduleTags = require("./module-tags.json");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  private configuration: Configuration = new Configuration("Production",[]);
  private clients: any[];
  private client: any = null;
  private currentClient: number = 0;
  
  ngOnInit() {
     this.http.get('/api/features').subscribe((data:Feature[]) => {
        this.configuration.features = data;
     });
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

  private showUsing(client: any) {
    for (var f = 0; f < this.configuration.features.length; f++) {
      this.configuration.features[f].customer = false;
      this.configuration.features[f].fromPackage = false;
    }
    moduleTags.forEach(mod => {
      if (client[mod.tag] !== "X")
        return;
      if (mod.match) {
        client.package = mod.tag;
        this.lookForMods(mod.match, true);
      } else {
        this.lookForMods([mod.tag], false);
      }
    });
  }

  onDownload() {
    this.http.get('/api/clients').subscribe((data:any[]) => {
      this.clients = data;
      this.client = this.clients[0];
      this.currentClient = 0;
      this.showUsing(this.clients[0]);
    });
  }

  onPrev() {
    if (this.currentClient > 0) {
      this.client = this.clients[--this.currentClient];
      this.showUsing(this.client);
    }
  }

  onNext() {
    if (this.currentClient < this.clients.length - 1) {
      this.client = this.clients[++this.currentClient];
      this.showUsing(this.client);
    }
  }
}
