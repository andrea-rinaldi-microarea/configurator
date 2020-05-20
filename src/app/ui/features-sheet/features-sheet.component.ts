import { FeaturesSheetLine } from './../../../models/features-sheet';
import { FeaturesSheetService } from './../../services/features-sheet.service';
import { Component, OnInit } from '@angular/core';

declare var require: any;
const industryList = require("../data/industry-list.json");

@Component({
  selector: 'app-features-sheet',
  templateUrl: './features-sheet.component.html',
  styleUrls: ['./features-sheet.component.css']
})
export class FeaturesSheetComponent implements OnInit {

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
    private featureSheet: FeaturesSheetService
  ) { }

  ngOnInit() {
  }

  private ShowFeaturesSheet() {
    this.featureSheet.load(industryList[this.currIndustry]).subscribe( res => {
      this.editMode = false; 
    });
  }

  onNext() {
    if (this.currIndustry == null) {
      this.currIndustry = -1;
    }
    if (this.currIndustry < this.industryList.length - 1) {
      this.currIndustry++;
      this.ShowFeaturesSheet();
    }
  }

  onPrev() {
    if (this.currIndustry == null) {
      this.currIndustry = 1;
    }
    if (this.currIndustry > 0) {
      this.currIndustry--;
      this.ShowFeaturesSheet();
    }
  }

  onIndustryChanged() {
    this.ShowFeaturesSheet();
  }

  topicTitle(line: FeaturesSheetLine) {
    var topic = this.featureSheet.topic(line.topic);
    if (topic != null) return topic.title;
  }

  topicClass(line: FeaturesSheetLine) {
    var topic = this.featureSheet.topic(line.topic);
    if (topic != null) return "level-" + topic.level;
  }

  topicNotYetAvailable(line: FeaturesSheetLine): boolean {
    var topic = this.featureSheet.topic(line.topic);
    if (topic != null) return topic.notYetAvailable;
    return false;
  }

  isLocalized(line: FeaturesSheetLine): boolean {
    var topic = this.featureSheet.topic(line.topic);
    if (topic == null) return false;
    return  (typeof topic.allowISO != "undefined" && topic.allowISO != "" ) ||
            (typeof topic.denyISO != "undefined" && topic.denyISO != "")
  }

  ISOTooltip(line: FeaturesSheetLine) {
    var topic = this.featureSheet.topic(line.topic);
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

  onSave() {
    // this.configuration.save();
  }

  onCancel() {
    this.ShowFeaturesSheet();
  }

  onCopy(sourceIndustry) {
    // this.configuration.copy(sourceIndustry).subscribe( res => {
    //   this.configuration.showUsing(this.clients.current);
    // });
  }

}
