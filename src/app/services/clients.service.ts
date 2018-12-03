import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClientsService {

  public list: any[];
  public current: any = null;
  public index: number = 0;

  constructor(
    private http: HttpClient
  ) { }

  open(file): Observable<any> {
    var $clients = new Observable<any> ( observer => {
      this.http.post("/api/clients/upload", file).subscribe((data:any[]) => {
        this.list = data;
        this.index = 0;
        this.current = this.list[this.index];
        observer.next();
        observer.complete();
      });
    });
    return $clients;
  }

  next(): boolean {
    if (this.index >= this.list.length) {
      return false;
    }
    this.current = this.list[++this.index];
    return true;
  }

  prev(): boolean {
    if (this.index <= 0) {
      return false;
    }
    this.current = this.list[--this.index];
    return true;
  }
}
