import { Weight } from './../../../models/configuration';
import { CSVExport, CSVFeature } from './../../../models/CSVExport';
import { Component, OnInit, DoCheck } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { ClientsService } from '../../services/clients.service';
import { Feature } from '../../../models/feature';
import { TranslateService } from '@ngx-translate/core';

declare var require: any;
const industryList = require("./industry-list.json");

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, DoCheck {

  private currIndustry:  number = null;
  private industryList: string[] = industryList;
  private editMode: boolean;

  private featureTypes = [
    {
      value: "",
      icon: "fa-star-o"
    },
    {
      value: "X",
      icon: "fa-star"
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
      value: "max",
      icon: "fa-star-half-o"
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
    private configuration: ConfigurationService,
    private clients: ClientsService,
    private translate: TranslateService
  ) { 
  }

  ngOnInit() {
  }

  ngDoCheck() {
    // @@@TODO fare solo se la change detection riguarda i dati coinvolti nei calcoli
    this.configuration.calculateWeights();
  }
  
  private ShowConfiguration() {
    this.configuration.load(industryList[this.currIndustry]).subscribe( res => {
      this.configuration.calculateWeights();
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

  selectAll(edition: string) {
    var newValue;
    if  (
          typeof this.configuration.current.features[0][edition] === "undefined" || 
          this.configuration.current.features[0][edition] == null
    ) {
      newValue = this.featureTypes[1].value;
    } else {
      newValue = this.configuration.current.features[0][edition] === this.featureTypes[0].value ? 
                      this.featureTypes[1].value : 
                      this.featureTypes[0].value;
    }

    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      this.configuration.current.features[f][edition] = newValue;
    }
  }

  onCopy(sourceIndustry) {
    this.configuration.copy(sourceIndustry).subscribe( res => {
      this.configuration.showUsing(this.clients.current);
    });
  }

  // onTranslate() {
  //   this.configuration.translateFeatures().subscribe( res => {
  
  //   });
  // }

  onUpgrade() {
    this.configuration.upgrade().subscribe( res => {
      this.configuration.showUsing(this.clients.current);
    });
  }

  onExport() {
    var translated = this.configuration.current;
    for (var f = 0; f < this.configuration.current.features.length; f++) {
      if (this.configuration.current.features[f].module) {
        translated.features[f].module = this.translate.instant(this.configuration.current.features[f].module);
      }
      if (this.configuration.current.features[f].functionality) {
        translated.features[f].functionality = this.translate.instant(this.configuration.current.features[f].functionality);
      }
    }
    this.configuration.export(translated);
  }

  onCSVExport() {
    var csvExp = new CSVExport(this.configuration.current.name);
    for (var f = 0; f < this.configuration.current.features.length; f++) {
      var feat = this.configuration.current.features[f];
      if (!feat.included)
        continue;
      
      csvExp.features.push(new CSVFeature(
        feat.module && this.translate.instant(feat.module),
        feat.functionality && this.translate.instant(feat.functionality),
        feat.tag,
        this.configuration.isIncluded(feat.tag, "SBPK") ? "SBPK" : "",
        this.configuration.isIncluded(feat.tag, "ADPK") ? "ADPK" : "",
        this.configuration.isIncluded(feat.tag, "TRPK") ? "TRPK" : "",
        feat.fragment,
        feat.standard,
        feat.premium,
        feat.professional,
        feat.enterprise
      ));
    }
    this.configuration.CSVExport(csvExp);
  }

  isLinked(feature: Feature) {
    var idx = this.configuration.current.features.findIndex(feat => feature.module == feat.module && feature.functionality == feat.functionality);
    return  feature.fragment != "" &&
            feature.fragment != null &&
            (
              (idx > 0 && feature.fragment == this.configuration.current.features[idx - 1].fragment) ||
              (idx < this.configuration.current.features.length - 1  && feature.fragment == this.configuration.current.features[idx + 1].fragment)
            );
  }

  sameFragmentOnPrevious(feature: Feature) {
    var idx = this.configuration.current.features.findIndex(feat => feature.module == feat.module && feature.functionality == feat.functionality);
    return  feature.fragment != "" &&
            feature.fragment != null &&
            (
              (idx > 0 && feature.fragment == this.configuration.current.features[idx - 1].fragment) 
            );
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
    if (!this.sameFragmentOnPrevious(feature)) {
      return this.configuration.getWeight(feature);
    }
  }

  configurationWeight(weight: Weight) {
    if (weight.min == weight.max) {
      return weight.min;
    } else {
      return weight.min + " " + String.fromCharCode(247) + " " + weight.max;
    }
  }

  missingFragment(feature: Feature) {
    return (feature.fragment == "" || feature.fragment.startsWith("_"))  && !feature.discontinued;
  }

}
