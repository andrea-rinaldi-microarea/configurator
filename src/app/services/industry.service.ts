import { Injectable } from '@angular/core';
import { Industry, Feature, Weight, Distance } from '../../models/Industry';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

declare var require: any;
const features = require("./features.json");
const fragmentWeights = require("./fragment-weights.json");
const moduleTags = require("./module-tags.json");
const modulesDescription = require("./modules-description.json");

export const editions = [ "STD", "PRM", "PRO", "ENT" ];
export const STD = 0;
export const PRM = 1;
export const PRO = 2;
export const ENT = 3;

@Injectable()
export class IndustryService {

  public current: Industry;

  constructor(private http: HttpClient) { }

  public load(industry: string): Observable<any> {
    var $industry = new Observable<any>( observer => {
      this.http.get('/api/industry/' + industry).subscribe((actualData:Industry) => {
        this.current = new Industry(industry);
        Object.assign(this.current, actualData);
        this.current.features = [];
        features.forEach(f => {
          var feature = new Feature(f);
          var actualFeat = actualData.features ? actualData.features.find(f => f.fragment == feature.fragment) : null;
          if (actualFeat != null) {
            feature.options = actualFeat.options;
            feature.optionID = actualFeat.optionID;
            feature.included = true;
          }
          this.current.features.push(feature);
        });
        observer.next();
        observer.complete();
      });
    });
    return $industry;
  }

  private isOptional(feat: Feature): boolean {
    for (var e = 0; e < feat.options.length; e++) {
      if (
            feat.options[e].availability == "optional" ||
            feat.options[e].availability == "count" ||
            feat.options[e].availability == "PPT"
         )
         return true;
    }
    return false;
  }

  public save() {
    var industry = new Industry(this.current.name);
    Object.assign(industry, this.current);
    industry.features = [];
    this.current.features.forEach( f => {
      if (!f.included)
        return;
      var feat = new Feature(f);
      feat.optionID = null;
      if (this.isOptional(feat)) {
        feat.optionID = feat.tag;
      }  
      industry.features.push(feat);
    }); 

    this.http.post('/api/industry/save', industry).subscribe(res => {
      console.log("saved");
    });
  }

  public copy(sourceIndustry: string): Observable<any> {
    var saved: Industry = Object.assign(null, this.current);
    var $industry = new Observable<any>(observer => {
      this.load(sourceIndustry).subscribe(res => {
        saved.features = this.current.features;
        this.current = saved;
        observer.next();
        observer.complete();
      });
    });
    return $industry;
  }

  public getWeight(feature: Feature): number {
    if (fragmentWeights[feature.fragment]) {
      return fragmentWeights[feature.fragment].weight;
    }
    return 0;
  }

  private calculateWeight(feat: Feature, availability: string, weight: Weight) {
    var value = this.getWeight(feat);
    if (availability == "") return;
    if (availability == "count" || availability == "PPT") return;
    if (availability == "always") {
      weight.min += value;
      weight.max += value;
      return;
    } 
    weight.max += value;
  }

  public calculateWeights() {
    if (!this.current) return;
    
    this.current.weights = [];
    editions.forEach(e => {
      this.current.weights.push(new Weight(e));
    });

    for (var f = 0; f < this.current.features.length; f++) {
      var feat = this.current.features[f];
      if (!feat.included)
        continue;

      editions.forEach((e, idx) => {
        this.calculateWeight(feat, feat.options[idx].availability, this.current.weights[idx]);
      });
    }
  }

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
      if (client.Modules.includes(mod.tag)) 
         found = true;
      else {
        if (mod.alias) {
          for (var a = 0; a < mod.alias.length; a++) {
            if (client.Modules.includes(mod.alias[a])) {
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
  }

  public isMinus(feat: Feature, availability: string): boolean {
    return feat.customer && (availability == "" || !feat.included);
  }

  public isPlus(feat: Feature, availability: string): boolean {
    return !feat.customer && availability != "" && feat.included;
  }

  private calculateDistance(feat: Feature, availability: string, dist: Distance) {
    if (this.isMinus(feat, availability)) {
      dist.minus += this.getWeight(feat);
    }
    if (this.isPlus(feat, availability)) {
      dist.plus += this.getWeight(feat);
    }
  }

  public calculateDistances() {
    if (!this.current) return;

    this.current.distances = [];
    editions.forEach( e => {
      this.current.distances.push(new Distance(e));
    });

    this.current.clientWeight = 0;

    for (var f = 0; f < this.current.features.length; f++) {
        var feat = this.current.features[f];

        // old discontinued features and new features that have no correspondance to existing ones are not counted as distance
        if (feat.discontinued || feat.tag == "" || feat.tag == null)
          continue; 
        
        if (feat.customer) {
          this.current.clientWeight += this.getWeight(feat);
        }

        editions.forEach( (e, idx) => {
          if (!feat.included) return;
          this.calculateDistance(feat, feat.options[idx].availability, this.current.distances[idx]);
        });
    }
  }

  public moduleDescription(mod: string) {
    if (!mod)
      return null;
    return modulesDescription[mod.trim()] ? modulesDescription[mod.trim()] : mod; 
  }
}



