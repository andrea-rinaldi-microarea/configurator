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



}
