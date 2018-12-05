import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClientsService {

  public current: any = null;
  public show: boolean = false;
  private index: number = 0;
  private list: any[] = null;

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

  available(): boolean {
    return this.list != null;
  }

  count(): number {
    return this.list? this.list.length : 0;
  }

  currIdx(): number {
    return this.index + 1;
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

  random() {
    if (!this.list) {
      return;
    }

    this.index = Math.floor(Math.random() * this.list.length);
    this.current = this.list[this.index];
  }
}
