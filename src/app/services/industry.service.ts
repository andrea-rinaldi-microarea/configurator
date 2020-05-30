import { Injectable } from '@angular/core';
import { Industry, Feature } from '../../models/Industry';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

declare var require: any;
const features = require("./features.json");

@Injectable()
export class IndustryService {

  public current: Industry;

  constructor(private http: HttpClient) { }

  public load(industry: string): Observable<any> {
    var $industry = new Observable<any>( observer => {
      this.http.get('/api/industry/' + industry).subscribe((actualData:Industry) => {
        this.current = new Industry(industry);
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

  public save() {
    var industry = new Industry(this.current.name);
    this.current.features.forEach( feat => {
      if (!feat.included)
        return;
        industry.features.push(new Feature(feat));
    }); 

    this.http.post('/api/industry/save', industry).subscribe(res => {
      console.log("saved");
    });
  }


}
