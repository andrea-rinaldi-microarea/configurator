import { Injectable } from '@angular/core';
import { Configuration } from '../../models/configuration';
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

  public showUsing(client: any) {
    if(!client || !this.current){
      return;
    }

    for (var f = 0; f < this.current.features.length; f++) {
      this.current.features[f].customer = false;
      this.current.features[f].fromPackage = false;
    }

    moduleTags.forEach(mod => {
      if (client[mod.tag] !== "X") {
        if (!mod.alias)
          return;
        var found: boolean = false;
        for (var a = 0; a < mod.alias.length; a++) {
          if (client[mod.alias[a]] == "X") {
            found = true;
            break;
          }
        }
        if (!found)
          return;
      }
      
      if (mod.package) {
        client.package = mod.tag;
        this.lookForMods(mod.package, true);
      } else {
        this.lookForMods([mod.tag], false);
      }
    });
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
}
