import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { ClientsService } from '../../services/clients.service';
import { Feature } from '../../../models/feature';

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
  private availableOptions = [
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

  onUpgrade() {
    this.configuration.upgrade().subscribe( res => {
      this.configuration.showUsing(this.clients.current);
    });
  }

  onExport() {
    this.configuration.export();
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

}
