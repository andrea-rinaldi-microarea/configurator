import { ClientsService } from './services/clients.service';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from './services/configuration.service';

declare var require: any;
const industryList = require("./industry-list.json");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private configuration: ConfigurationService,
    private clients: ClientsService 
  ) { }

  private currIndustry:  string;
  private industryList = industryList;
  private editMode: boolean;
  
  ngOnInit() {
  }

  onIndustryChanged() {
    this.configuration.load(this.currIndustry).subscribe( res => {
      this.configuration.showUsing(this.clients.current);
      this.editMode = false; 
    });
  }

  onSave() {
    this.configuration.save();
  }

  onCancel() {
    this.onIndustryChanged();
  }


}
