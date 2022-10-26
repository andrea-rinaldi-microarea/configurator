import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Feature, FeatureOption } from '../../../models/Industry';
import { IndustryService } from '../../services/industry.service';

declare var require: any;
const industryList = require("../data/industry-list.json");
const editionList = require("../data/edition-list.json");
const countryList = require("../data/country-list.json");

@Component({
  selector: 'app-price-config',
  templateUrl: './price-config.component.html',
  styleUrls: ['./price-config.component.css']
})
export class PriceConfigComponent implements OnInit {

  private currIndustry:  number = null;
  private currEdition:  number = null;
  private currCountry:  number = null;
  private industryList: string[] = industryList;
  private editionList: any[] = editionList;
  private countryList: any[] = countryList;
  private showDetails: boolean = false;
  private hideExcluded: boolean = false;
  private nrCals: number = 0;

  private includedOptions = [
    {
      value: false,
      icon: "fa-times"
    },
    {
      value: true,
      icon: "fa-check"
    }
  ];
  
  private featureTypes = [
    {
      value: "",
      icon: "fa-circle-o"
    },
    {
      value: "always",
      icon: "fa-circle"
    },
    {
      value: "optional",
      icon: "fa-check-square-o"
    },
    {
      value: "count",
      icon: "fa-user-plus"
    },
    {
      value: "PPT",
      icon: "fa-money"
    }
    
  ];
  constructor(
                private industry: IndustryService,
                public translate: TranslateService,
                public titleService: Title,
                private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setTitle();
    });
  }

  private setTitle() {
    this.titleService.setTitle(industryList[this.currIndustry] + " - Selected Configuration Price - " + (this.currEdition  ? editionList[this.currEdition].name : "") + " edition");
  }

  private ShowPriceConfig() {
    this.industry.load(industryList[this.currIndustry]).subscribe( res => {
      this.setTitle();
    });
  }

  onPrev() {
    if (this.currIndustry == null) {
      this.currIndustry = 1;
    }
    if (this.currIndustry > 0) {
      this.currIndustry--;
      this.ShowPriceConfig();
    }
  }

  onNext() {
    if (this.currIndustry == null) {
      this.currIndustry = -1;
    }
    if (this.currIndustry < this.industryList.length - 1) {
      this.currIndustry++;
      this.ShowPriceConfig();
    }
  }

  onInfoChanged() {
    this.ShowPriceConfig();
  }

  onPrint() {
    this.hideExcluded = true;
    this.showDetails = true;
    this.ref.detectChanges();
    window.print();
  }

  featureClass(feature: Feature) {
    if (feature.level) {
      return "level-" + feature.level;
    }
    else {
      return "no-level";
    }
  }

  detailedInfo(feature: Feature) {
    return feature.fragment + "_details";
  }

  option(feature: Feature, edition: string): FeatureOption {
    var option : FeatureOption = feature.options.find(o => o.edition == edition);
    return option || new FeatureOption(edition);
  }

  ISOExcluded(feature: Feature) {
    if (feature.allowISO != "" && !feature.allowISO.includes(this.countryList[this.currCountry].code))
      return true;
    if (feature.denyISO != "" && feature.denyISO.includes(this.countryList[this.currCountry].code))
        return true;

    return false;
  }

  private switched: boolean = false;
  isOptionsSectionStart(idx: number, feature: Feature, edition: string) {
    var option : FeatureOption = feature.options.find(o => o.edition == edition);
    if (idx == 0) { // needed if the list is showed again
      this.switched = false; 
    }
    else if (!this.switched && option.availability != "always") {
      this.switched = true;
      return true;
    }
    return false;
  }

  isLocalized(feature: Feature): boolean {
    return  (typeof feature.allowISO != "undefined" && feature.allowISO != "" ) ||
            (typeof feature.denyISO != "undefined" && feature.denyISO != "")
  }

  ISOTooltip(feature: Feature) {
    var tooltip: string;
    if (feature.allowISO != "") {
      tooltip = this.translate.instant("Available in") + ": " + feature.allowISO;
    }
    if (typeof feature.denyISO !== "undefined" && feature.denyISO != "") {
      if (tooltip != null) tooltip += "\n";
      tooltip = this.translate.instant("Not available in")  + ": " + feature.denyISO;
    }
    return tooltip;
  }

}
