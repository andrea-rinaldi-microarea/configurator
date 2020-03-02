import { CSVExport } from './../../models/CSVExport';
import { Injectable } from '@angular/core';
import { Configuration, Distance, Weight } from '../../models/configuration';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Feature } from '../../models/feature';
import { TranslateService } from '@ngx-translate/core';

declare var require: any;
const moduleTags = require("./module-tags.json");
const modulesDescription = require("./modules-description.json");
const fragmentWeights = require("./fragment-weights.json");
const industryCodes = require("./industry-codes.json");

@Injectable()
export class ConfigurationService {

  public current: Configuration;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) { }

  private lookForMods(mods: string[], fromPackage: boolean) {
    mods.forEach(mod => {
        this.current.features.forEach( feat => {
          if (feat.tag === mod) {
            feat.customer = true;
            feat.fromPackage = fromPackage;
          }
        });
    });
  }

  public isMinus(feat: Feature, edition: string): boolean {
    return feat.customer && (edition == "" || !feat.included);
  }

  public isPlus(feat: Feature, edition: string): boolean {
    return !feat.customer && edition != "" && feat.included;
  }

  private calculateDistance(feat: Feature, edition: string, dist: Distance) {
    if (this.isMinus(feat, edition)) {
      dist.minus += this.getWeight(feat);
    }
    if (this.isPlus(feat, edition)) {
      dist.plus += this.getWeight(feat);
    }
  }

  public moduleDescription(mod: string) {
    if (!mod)
      return null;
    return modulesDescription[mod.trim()] ? modulesDescription[mod.trim()] : mod; 
  }

  public showUsing(client: any) {
    if(!client || !this.current){
      return;
    }

    for (var f = 0; f < this.current.features.length; f++) {
      this.current.features[f].customer = false;
      this.current.features[f].fromPackage = false;
    }

    for (var m = 0; m < moduleTags.length; m++ ) {
      var mod = moduleTags[m];
      var found: boolean = false;
      if (
            (client[mod.tag] !== undefined && client[mod.tag] == "X") ||
            (client.Modules !== undefined && client.Modules.includes(mod.tag))
         ) 
         found = true;
      else {
        if (mod.alias) {
          for (var a = 0; a < mod.alias.length; a++) {
            if (
                  (client[mod.alias[a]] !== undefined && client[mod.alias[a]] == "X") ||
                  (client.Modules !== undefined && client.Modules.includes(mod.alias[a]))
              ) {
              found = true;
              break;
            }
          }
        }
      }
      if (!found)
        continue;
  
      if (mod.package) {
        client.package = mod.tag;
        this.lookForMods(mod.package, true);
      } else {
        this.lookForMods([mod.tag], false);
      }
    }

    this.current.stdDistance = new Distance();
    this.current.proDistance = new Distance();
    this.current.prmDistance = new Distance();
    this.current.entDistance = new Distance();
    this.current.clientWeight = 0;
    var foundNames: string[] = [];
    for (var f = 0; f < this.current.features.length; f++) {
        var feat = this.current.features[f];

        // old discontinued features and new features that have no correspondance to existing ones are not counted as distance
        // count features once
        if (feat.discontinued || feat.tag == "" || feat.tag == null || foundNames.includes(feat.fragment))
          continue; 
        
        if (feat.customer) {
          this.current.clientWeight += this.getWeight(feat);
        }

        this.calculateDistance(feat, feat.standard, this.current.stdDistance);
        this.calculateDistance(feat, feat.professional, this.current.proDistance);
        this.calculateDistance(feat, feat.premium, this.current.prmDistance);
        this.calculateDistance(feat, feat.enterprise, this.current.entDistance);
        foundNames.push(feat.fragment);
      }
    }

    public getWeight(feature: Feature): number {
      if (fragmentWeights[feature.fragment]) {
        return fragmentWeights[feature.fragment].weight;
      }
      return 0;
    }

    private calculateWeight(feat: Feature, edition: string, weight: Weight) {
      var value = this.getWeight(feat);
      if (edition == "") return;
      if (edition == "Nr-User") return;
      if (edition == "X") {
        weight.min += value;
        weight.max += value;
        return;
      } 
      if (edition == "max") {
        weight.min += Math.floor(value / 2);
        weight.max += Math.floor(value / 2);
        return;
      } 
      weight.max += value;
    }

    public calculateWeights() {
      if (!this.current) return;
      
      this.current.stdWeight = new Weight();
      this.current.prmWeight = new Weight();
      this.current.proWeight = new Weight();
      this.current.entWeight = new Weight();

      var foundNames: string[] = [];
      for (var f = 0; f < this.current.features.length; f++) {
        var feat = this.current.features[f];
        if (!feat.included || foundNames.includes(feat.fragment))
          continue;

        this.calculateWeight(feat, feat.standard, this.current.stdWeight);
        this.calculateWeight(feat, feat.premium, this.current.prmWeight);
        this.calculateWeight(feat, feat.professional, this.current.proWeight);
        this.calculateWeight(feat, feat.enterprise, this.current.entWeight);
        foundNames.push(feat.fragment);
      }
    }
  
    public load(industry: string): Observable<any> {
    var $configuration = new Observable<any>(observer => {
      this.http.get('/api/configurations/' + industry).subscribe((data:Feature[]) => {
        this.current = new Configuration(industry);
        this.current.industryCode = industryCodes[industry] && industryCodes[industry].code;
        this.current.features = data;

        observer.next();
        observer.complete();
      });
    });
    return $configuration;
  }

  public save() {
    this.http.post('/api/configurations/save', this.current).subscribe(res => {
      console.log("saved");
    });
  }

  public copy(sourceIndustry: string): Observable<any> {
    var $configuration = new Observable<any>(observer => {
      this.http.get('/api/configurations/' + sourceIndustry).subscribe((data:Feature[]) => {
        this.current.features = data;
        observer.next();
        observer.complete();
      });
    });
    return $configuration;
  }

  // public translateFeatures(): Observable<any> {
  //   var $configuration = new Observable<any>(observer => {
  //     this.http.get('/api/configurations/' + 'FeaturesList').subscribe((data:Feature[]) => {
  //       for (var f = 0; f < data.length; f++) {
  //         if (data[f].module)
  //           this.translate.get(data[f].module.replace('_','')).subscribe(res => {
  //             this.current.features[f].module = res;
  //           });
  //         if (data[f].functionality)
  //           this.translate.get(data[f].functionality).subscribe(res => {
  //             this.current.features[f].functionality = res;
  //           });
  //       }
  //       observer.next();
  //       observer.complete();
  //     });
  //   });
  //   return $configuration;
  // }

  public upgrade(): Observable<any> {
    var $configuration = new Observable<any>(observer => {
      this.http.get('/api/configurations/' + 'FeaturesList').subscribe((data:Feature[]) => {
        for (var f = 0; f < data.length; f++) {
          var curr = this.current.features.find(feat => data[f].module == feat.module && data[f].functionality == feat.functionality);

          if (curr == null) {
            var transModule = data[f].module ? this.translate.instant(data[f].module.replace('_','')) : "";
            var transFunctionality = data[f].functionality ? this.translate.instant(data[f].functionality) : "";
            curr = this.current.features.find((feat) => {
              return transModule == feat.module && transFunctionality == feat.functionality;
            });
          }

          if (curr != null)
          {
            data[f].included = curr.included;
            data[f].standard = curr.standard;
            data[f].premium = curr.premium;
            data[f].professional = curr.professional;
            data[f].enterprise = curr.enterprise;
          }
        } 
        this.current.features = data;
        observer.next();
        observer.complete();
      });
    });
    return $configuration;
  }

  public export(configuration: Configuration) {
    this.http.post('/api/configurations/export', configuration).subscribe(res => {
      console.log("exported");
    });
  }

  public isIncluded(tag: string, pkg: string): boolean {
    var pack = moduleTags.find(e => {
      return e.tag == pkg;
    });
    if (pack) {
      return pack.package.includes(tag);
    } else {
      return false;
    }
  }

  public CSVExport(csvExp: CSVExport) {
    this.http.post('/api/configurations/csv-export', csvExp).subscribe(res => {
      console.log("exported to CSV");
    });
  }

}
