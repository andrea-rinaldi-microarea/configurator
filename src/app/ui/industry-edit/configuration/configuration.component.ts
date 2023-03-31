import { Distance, Edition, Feature, FeatureOption } from './../../../../models/Industry';
import { Component, OnInit, DoCheck } from '@angular/core';
import { ClientsService } from '../../../services/clients.service';
import { TranslateService } from '@ngx-translate/core';
import { IndustryService } from '../../../services/industry.service';
import { Weight } from '../../../../models/Industry';
import { MAGO_CLOUD, ProductService } from '../../../services/product.service';

declare var require: any;
const detailedInfos = require("./detailed-info.json");

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, DoCheck {

  private currIndustry:  number = null;
  private industryList: string[];
  private editMode: boolean;
  private editions: Edition[] = [];

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
      icon: "fa-user"
    },
    {
      value: "count",
      icon: "fa-cart-plus"
    },
    {
      value: "standalone",
      icon: "fa-check-square-o"
    },
    {
      value: "PPT",
      icon: "fa-money"
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
    private industry: IndustryService,
    private clients: ClientsService,
    private translate: TranslateService,
    private product: ProductService
  ) {
    this.industryList = product.industryList();
    this.editions = product.editions();
  }

  ngOnInit() {
  }

  ngDoCheck() {
    // @@@TODO fare solo se la change detection riguarda i dati coinvolti nei calcoli
    this.industry.calculateWeights();
  }

  private ShowConfiguration() {
    this.industry.load(this.industryList[this.currIndustry]).subscribe( res => {
      this.industry.calculateWeights();
      this.industry.showUsing(this.clients.current);
      this.industry.calculateDistances();
    });
  }

  onIndustryChanged() {
    this.ShowConfiguration()
  }

  onSave() {
    this.industry.save();
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

  featureClass(feature: Feature) {
    if (feature.level) {
      return "level-" + feature.level;
    }
    else {
      return "no-level";
    }
  }

  selectAll(edition: string) {
    var newValue = this.option(this.industry.current.features[0], edition).availability == this.featureTypes[0].value ?
                    this.featureTypes[1].value :
                    this.featureTypes[0].value;

    this.industry.current.features.forEach( feat => {
      this.option(feat, edition).availability = newValue;
    });
  }

  onCopy(sourceIndustry) {
    this.industry.copy(sourceIndustry).subscribe( res => {
      this.industry.showUsing(this.clients.current);
    });
  }

  isLocalized(feature: Feature) {
    return  (feature.allowISO != "" && feature.allowISO != null) ||
            (feature.denyISO != "" && feature.denyISO != null)
  }

  ISOTooltip(feature: Feature) {
    var tooltip: string;
    if (feature.allowISO != "") {
      tooltip = "Disponibile in: " +  feature.allowISO;
    }
    if (feature.denyISO != "") {
      if (tooltip != null) tooltip += "\n";
      tooltip = "Non disponibile in: " +  feature.denyISO;
    }
    return tooltip;
  }

  getWeight(feature: Feature) {
      return this.industry.getWeight(feature);
  }

  configurationWeight(weights: Weight[], edition: string) {
    if (!weights) return;
    var weight = weights.find(w => w.edition == edition);
    if (!weight) return;

    if (weight.min == weight.max) {
      return weight.min;
    } else {
      return weight.min + " " + String.fromCharCode(247) + " " + weight.max;
    }
  }

  configurationDistance(distances: Distance[], edition: string): Distance {
    if (!distances) return new Distance(edition);
    var distance = distances.find(d => d.edition == edition);
    return distance || new Distance(edition);
  }

  isMinus(feature: Feature, edition: string): boolean  {
    return this.industry.isMinus(feature, this.option(feature, edition).availability);
  }

  isPlus(feature: Feature, edition: string): boolean  {
    return this.industry.isPlus(feature, this.option(feature, edition).availability);
  }

  option(feature: Feature, edition: string): FeatureOption {
    var option : FeatureOption = feature.options.find(o => o.edition == edition);
    return option || new FeatureOption(edition);
  }

  missingFragment(feature: Feature) {
    return (feature.fragment == "" || feature.fragment.startsWith("_"))  && !feature.discontinued;
  }

  detailedInfo(feature: Feature) {
    return detailedInfos[feature.fragment||feature.tag];
  }

  hasWeights() : boolean {
    return this.product.hasWeights();
  }

  hasLicense() : boolean {
    return this.product.hasLicense();
  }

  getLicense(feature: Feature) {
    return this.industry.getLicense(feature);
  }

  getMLU(feature: Feature) {
    return this.industry.getMLU(feature);
  }

  getSpecial(feature: Feature) {
    return this.industry.getSpecial(feature);
  }

  isAlways(feature: Feature) {
    if  (
          feature.optionID == this.industry.current.industryCode ||
          (feature.optionID == "SEVR" && this.industry.current.industryCode == "CART")
        )
      return false;

    return feature.options[0].availability == "always";
  }

  public logo() : string {
    if (this.product.activeProduct() == MAGO_CLOUD)
      return "/assets/M4Cloud.png";
    else
      return "/assets/MagoWebLogo.png";
  }
}
