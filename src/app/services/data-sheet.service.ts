import { HttpClient } from '@angular/common/http';
import { Topic } from '../../models/data-sheet';
import { Injectable } from '@angular/core';
import { DataSheet, DataSheetLine } from '../../models/data-sheet';
import { Observable } from 'rxjs/Observable';

declare var require: any;
const topics = require("./topics.json");

@Injectable()
export class DataSheetService {

  public current: DataSheet;

  constructor(
    private http: HttpClient
  ) { }

  public load(industry: string): Observable<any> {
    var $dataSheet = new Observable<any>( observer => {
      this.http.get('/api/dataSheet/' + industry).subscribe((actualData:DataSheet) => {
        this.current = new DataSheet(industry);
        topics.forEach(topic => {
          this.current.lines.push(new DataSheetLine(topic.topic));
          var actualLine = actualData.lines ? actualData.lines.find(l => l.topic == topic.topic) : null;
          if (actualLine != null) {
            this.current.lines[this.current.lines.length - 1] = actualLine;
          }
        });
        observer.next();
        observer.complete();
      });
    });
    return $dataSheet;
  }

  public topic(topic: string): Topic {
    return topics.find(t => t.topic == topic);
  }

  public save() {
    this.http.post('/api/dataSheet/save', this.current).subscribe(res => {
      console.log("saved");
    });
  }

  public copy(sourceIndustry: string): Observable<any> {
    var savedName = this.current.name;
    var $dataSheet = new Observable<any>(observer => {
      this.load(sourceIndustry).subscribe(res => {
        this.current.name = savedName;
        observer.next();
        observer.complete();
      });
    });
    return $dataSheet;
  }


}
