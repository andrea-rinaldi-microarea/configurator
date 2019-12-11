import { Injectable } from '@angular/core';
import { Configuration, Distance } from '../../models/configuration';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Feature } from '../../models/feature';

declare var require: any;
const moduleTags = require("./module-tags.json");

@Injectable()
export class ConfigurationService {

  public current: Configuration;

  constructor(
    private http: HttpClient
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
    return feat.customer && (edition == "" || !feat.available);
  }

  public isPlus(feat: Feature, edition: string): boolean {
    return !feat.customer && edition != "" && feat.available;
  }

  private calculateDistance(feat: Feature, edition: string, dist: Distance) {
    if (this.isMinus(feat, edition)) {
      dist.minus++;
    }
    if (this.isPlus(feat, edition)) {
      dist.plus++;
    }
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
    this.current.entDistance = new Distance();
    for (var f = 0; f < this.current.features.length; f++) {
        var feat = this.current.features[f];

        // old discontinued features and new features that have no correspondance to existing ones are not counted as distance
        if (feat.discontinued || feat.tag == "" || feat.tag == null)
          continue; 

        this.calculateDistance(feat, feat.standard, this.current.stdDistance);
        this.calculateDistance(feat, feat.professional, this.current.proDistance);
        this.calculateDistance(feat, feat.enterprise, this.current.entDistance);
      }
    }

  public load(industry: string): Observable<any> {
    var $configuration = new Observable<any>(observer => {
      this.http.get('/api/configurations/' + industry).subscribe((data:Feature[]) => {
        this.current = new Configuration(industry);
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

  public upgrade(): Observable<any> {
    var $configuration = new Observable<any>(observer => {
      this.http.get('/api/configurations/' + 'FeaturesList').subscribe((data:Feature[]) => {
        for (var f = 0; f < data.length; f++) {
          var curr = this.current.features.find(feat => data[f].module == feat.module && data[f].functionality == feat.functionality);
          if (curr != null)
          {
            data[f].available = curr.available;
            data[f].standard = curr.standard;
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

  public export() {
    this.http.post('/api/configurations/export', this.current).subscribe(res => {
      console.log("exported");
    });
  }


}
