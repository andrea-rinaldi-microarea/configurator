import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IndustryService } from './industry.service';

@Injectable()
export class ClientsService {

  public current: any = null;
  public show: boolean = false;
  private index: number = 0;
  private list: any[] = null;

  constructor(
    private http: HttpClient,
    private industry: IndustryService
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

  some(): boolean {
    return this.list != null;
  }

  count(): number {
    return this.list? this.list.length : 0;
  }

  currIdx(): number {
    return this.index + 1;
  }

  next(): boolean {
    if (this.index >= this.list.length - 1) {
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

  first(): boolean {
    this.index = 0;
    this.current = this.list[this.index];
    return true;
  }

  last(): boolean {
    this.index = this.list.length - 1;
    this.current = this.list[this.index];
    return true;
  }

  decodeModules(modString: string) {
    var modules = modString.split(";");
    var description: string;
    modules.forEach(mod => {
      description = description ? description + " + ": ""; 
      description += this.industry.moduleDescription(mod);
    });
    return description;
  }

  searchForward(searchString: string): boolean {
    if (this.index >= this.list.length - 1) {
      return false;
    }
    if (!searchString)
      return false;

    for (var loc = this.index + 1; loc < this.list.length; loc++) {
      var field = this.list[loc]["Ragione Sociale"] || this.list[loc].CompanyName;
      if (!field)
        field = this.decodeModules(this.list[loc].Modules);
      if (!field)
        return false;
      
      if (field.toUpperCase().includes(searchString.toUpperCase())) {
        this.index = loc;
        this.current = this.list[this.index];
        return true;
      }
      
    }

    return false;
  }

  random() {
    if (!this.list) {
      return;
    }

    this.index = Math.floor(Math.random() * this.list.length);
    this.current = this.list[this.index];
  }

  getEdition(): string {
    if (!this.current)
      return "";
    var product: string = this.current["Descrizione prodotto"] || this.current.Description;
    if (!product)
      return "";
    if (product.includes("PRO"))
      return "PRO";
    else if (product.includes("ENT"))
      return "ENT";
    else if (product.includes("STD"))
      return "STD"
    else
      return "";
  }
}
