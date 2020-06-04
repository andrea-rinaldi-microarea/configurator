import { DataSheetLine } from '../../../models/data-sheet';
import { DataSheetService } from '../../services/data-sheet.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    private dataSheet: DataSheetService,
    public translate: TranslateService
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

  topicClass(line: DataSheetLine) {
    return "level-" + line.level;
  }

  isLocalized(line: DataSheetLine): boolean {
    return  (typeof line.allowISO != "undefined" && line.allowISO != "" ) ||
            (typeof line.denyISO != "undefined" && line.denyISO != "")
  }

  ISOTooltip(line: DataSheetLine) {
    var tooltip: string;
    if (line.allowISO != "") {
      tooltip = "Disponibile in: " +  line.allowISO;
    }
    if (typeof line.denyISO !== "undefined" && line.denyISO != "") {
      if (tooltip != null) tooltip += "\n";
      tooltip = "Non disponibile in: " +  line.denyISO;
    }
    return tooltip;
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
