import { DataSheetLine } from '../../../models/data-sheet';
import { DataSheetService } from '../../services/data-sheet.service';
import { Component, OnInit } from '@angular/core';

declare var require: any;
const industryList = require("../data/industry-list.json");

@Component({
  selector: 'app-data-sheet',
  templateUrl: './data-sheet.component.html',
  styleUrls: ['./data-sheet.component.css']
})
export class DataSheetComponent implements OnInit {

  private currIndustry:  number = null;
  private industryList: string[] = industryList;
  private editMode: boolean;

  private topicTypes = [
    {
      value: "",
      icon: "fa-circle-o"
    },
    {
      value: "X",
      icon: "fa-circle"
    },
    {
      value: "X/0",
      icon: "fa-check-square-o"
    },
    {
      value: "Nr-User",
      icon: "fa-user-plus"
    },
    {
      value: "PPT",
      icon: "fa-eur"
    }
  ];
  
  private includedOptions = [
    {
      value: false,
      icon: "fa-sign-in"
    },
    {
      value: true,
      icon: "fa-ban"
    }
  ];

  constructor(
    private dataSheet: DataSheetService
  ) { }

  ngOnInit() {
  }

  private ShowDataSheet() {
    this.dataSheet.load(industryList[this.currIndustry]).subscribe( res => {
      this.editMode = false; 
    });
  }

  onNext() {
    if (this.currIndustry == null) {
      this.currIndustry = -1;
    }
    if (this.currIndustry < this.industryList.length - 1) {
      this.currIndustry++;
      this.ShowDataSheet();
    }
  }

  onPrev() {
    if (this.currIndustry == null) {
      this.currIndustry = 1;
    }
    if (this.currIndustry > 0) {
      this.currIndustry--;
      this.ShowDataSheet();
    }
  }

  onIndustryChanged() {
    this.ShowDataSheet();
  }

  topicTitle(line: DataSheetLine) {
    var topic = this.dataSheet.topic(line.topic);
    if (topic != null) return topic.title;
  }

  topicClass(line: DataSheetLine) {
    var topic = this.dataSheet.topic(line.topic);
    if (topic != null) return "level-" + topic.level;
  }

  topicNotYetAvailable(line: DataSheetLine): boolean {
    var topic = this.dataSheet.topic(line.topic);
    if (topic != null) return topic.notYetAvailable;
    return false;
  }

  isLocalized(line: DataSheetLine): boolean {
    var topic = this.dataSheet.topic(line.topic);
    if (topic == null) return false;
    return  (typeof topic.allowISO != "undefined" && topic.allowISO != "" ) ||
            (typeof topic.denyISO != "undefined" && topic.denyISO != "")
  }

  ISOTooltip(line: DataSheetLine) {
    var topic = this.dataSheet.topic(line.topic);
    if (topic == null) return "";
    var tooltip: string;
    if (topic.allowISO != "") {
      tooltip = "Disponibile in: " +  topic.allowISO;
    }
    if (typeof topic.denyISO !== "undefined" && topic.denyISO != "") {
      if (tooltip != null) tooltip += "\n";
      tooltip = "Non disponibile in: " +  topic.denyISO;
    }
    return tooltip;
  }

  topicDetails(line: DataSheetLine) {
    var topic = this.dataSheet.topic(line.topic);
    if (topic != null) return topic.details;
  }

  onSave() {
    this.dataSheet.save();
  }

  onCancel() {
    this.ShowDataSheet();
  }

  onCopy(sourceIndustry) {
    this.dataSheet.copy(sourceIndustry).subscribe();
  }

}
