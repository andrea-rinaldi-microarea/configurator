import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { ClientsService } from '../../services/clients.service';

declare var require: any;
const industryList = require("./industry-list.json");



@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  private currIndustry:  number = null;
  private industryList: string[] = industryList;
  private editMode: boolean;
  
  constructor(
    private configuration: ConfigurationService,
    private clients: ClientsService 
  ) { }

  ngOnInit() {
  }

  private ShowConfiguration() {
    this.configuration.load(industryList[this.currIndustry]).subscribe( res => {
      this.configuration.showUsing(this.clients.current);
      this.editMode = false; 
    });
  }

  onIndustryChanged() {
    this.ShowConfiguration()
  }

  onSave() {
    this.configuration.save();
  }

  onCancel() {
    this.ShowConfiguration();
  }

  onNext() {
    if (this.currIndustry == null) {
      this.currIndustry = -1;
    }
    if (this.currIndustry < this.industryList.length - 1) {
      this.currIndustry++;
      this.ShowConfiguration();
    }
  }

  onPrev() {
    if (this.currIndustry == null) {
      this.currIndustry = 1;
    }
    if (this.currIndustry > 0) {
      this.currIndustry--;
      this.ShowConfiguration();
    }
  }


}
