import { Injectable } from '@angular/core';
import { FeaturesSheet } from '../../models/features-sheet';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FeaturesSheetService {

  public current: FeaturesSheet;

  constructor() { }

  public load(industry: string): Observable<any> {
    var $featuresSheet = new Observable<any>( observer => {
      this.current = new FeaturesSheet(industry);
      observer.next();
      observer.complete();
    });
    return $featuresSheet;
  }
}
