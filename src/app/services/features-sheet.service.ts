import { HttpClient } from '@angular/common/http';
import { Topic } from './../../models/features-sheet';
import { Injectable } from '@angular/core';
import { FeaturesSheet, FeaturesSheetLine } from '../../models/features-sheet';
import { Observable } from 'rxjs/Observable';

declare var require: any;
const topics = require("./topics.json");

@Injectable()
export class FeaturesSheetService {

  public current: FeaturesSheet;

  constructor(
    private http: HttpClient
  ) { }

  public load(industry: string): Observable<any> {
    var $featuresSheet = new Observable<any>( observer => {
      this.http.get('/api/featuresSheet/' + industry).subscribe((actualData:FeaturesSheet) => {
        this.current = new FeaturesSheet(industry);
        topics.forEach(topic => {
          this.current.lines.push(new FeaturesSheetLine(topic.topic));
          var actualLine = actualData.lines ? actualData.lines.find(l => l.topic == topic.topic) : null;
          if (actualLine != null) {
            this.current.lines[this.current.lines.length - 1] = actualLine;
          }
        });
        observer.next();
        observer.complete();
      });
    });
    return $featuresSheet;
  }

  public topic(topic: string): Topic {
    return topics.find(t => t.topic == topic);
  }

  public save() {
    this.http.post('/api/featuresSheet/save', this.current).subscribe(res => {
      console.log("saved");
    });
  }

}
