import { DataSheetLineOption } from './../../models/data-sheet';
import { HttpClient } from '@angular/common/http';
import { CSVDataSheet, Topic } from '../../models/data-sheet';
import { Injectable } from '@angular/core';
import { DataSheet, DataSheetLine } from '../../models/data-sheet';
import { Observable } from 'rxjs/Observable';
import { ProductService } from './product.service';
import { Edition } from '../../models/Industry';

declare var require: any;
const topics = require("./topics.json");

@Injectable()
export class DataSheetService {

  public current: DataSheet;

  constructor(
    private http: HttpClient
  ) {
  }

  public load(industry: string): Observable<any> {
    var $dataSheet = new Observable<any>( observer => {
      this.http.get('/api/dataSheet/' + industry).subscribe((actualData:DataSheet) => {
        this.current = new DataSheet(industry);
        topics.forEach((line: DataSheetLine)  => {
          var l = new DataSheetLine(line);
          var actualLine = actualData.lines ? actualData.lines.find(al => al.topic == line.topic) : null;
          if (actualLine != null) {
            l.options = actualLine.options;
            l.included = true;
            // allow forcing notYetAvailable on some specific industries
            l.notYetAvailable = actualLine.notYetAvailable;
          }
          this.current.lines.push(l);
        });
        observer.next();
        observer.complete();
      });
    });
    return $dataSheet;
  }

  public save() {
    var dataSheet = new DataSheet(this.current.name);
    this.current.lines.forEach( line => {
      if (!line.included)
        return;
      var dsLine = new DataSheetLine(line);
      dataSheet.lines.push(dsLine);
    });

    this.http.post('/api/dataSheet/save', dataSheet).subscribe(res => {
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

  public CSVExport(csv: CSVDataSheet) {
    this.http.post('/api/dataSheet/csv-export', csv).subscribe(res => {
      console.log("exported to CSV");
    });
  }

}
