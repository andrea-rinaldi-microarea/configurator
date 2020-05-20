import { Topic } from './../../models/features-sheet';
import { Injectable } from '@angular/core';
import { FeaturesSheet, FeaturesSheetLine } from '../../models/features-sheet';
import { Observable } from 'rxjs/Observable';

declare var require: any;
const topics = require("./topics.json");

@Injectable()
export class FeaturesSheetService {

  public current: FeaturesSheet;

  constructor() { }

  public load(industry: string): Observable<any> {
    var $featuresSheet = new Observable<any>( observer => {
      this.current = new FeaturesSheet(industry);
      topics.forEach(topic => {
        this.current.lines.push(new FeaturesSheetLine(topic.topic))
      });
      observer.next();
      observer.complete();
    });
    return $featuresSheet;
  }

  public topic(topic: string): Topic {
    return topics.find(t => t.topic == topic);
  }
}
