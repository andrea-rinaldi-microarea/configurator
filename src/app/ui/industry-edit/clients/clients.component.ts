import { ConfigurationService } from './../../../services/configuration.service';
import { ClientsService } from './../../../services/clients.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare var require: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  public successSearch: boolean = true;

  constructor(
    private clients: ClientsService,
    private configuration: ConfigurationService
  ) { }

  ngOnInit() {
  }

  onPrev() {
    if (this.clients.prev()) {
      this.configuration.showUsing(this.clients.current);
    }
  }

  onNext() {
    if (this.clients.next()) {
      this.configuration.showUsing(this.clients.current);
    }
  }

  onRandom() {
    this.clients.random();
    this.configuration.showUsing(this.clients.current);
  }

  openClients(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length == 0) {
      return;
    }
    let file: File = fileList[0];
    this.clients.open(file).subscribe(res => {
      this.configuration.showUsing(this.clients.current);
    })
  }

  productDescri() {
    var fullDescri: string = "";
    if (this.clients.current["Descrizione prodotto"]) {
      fullDescri = this.clients.current["Descrizione prodotto"];
    } else if (this.clients.current.Description) {
      fullDescri = this.clients.current.Description;
    } else {
      return "";
    }
    return fullDescri
      .replace("All Database", "")
      .replace("Powered by MSDE", "")
      .replace("Powered by SQL Server","")
      .trim();
  }

  decodeClient() {
    if (this.clients.current["Ragione Sociale"])
      return this.clients.current["Ragione Sociale"];
    
    if (this.clients.current.CompanyName)
      return this.clients.current.CompanyName;

    if (this.clients.current.Modules)
      return this.clients.decodeModules(this.clients.current.Modules);
  }

  decodeModules() {
    if (this.clients.current.Modules)
      return this.clients.decodeModules(this.clients.current.Modules);
  }

  decodeCALs() {
    if (this.clients.current["Numero C.A.L."])
      return this.clients.current["Numero C.A.L."];
    
    if (this.clients.current.CALNrs)
      return this.clients.current.CALNrs;
  }

  decodeQty() {
    if (this.clients.current.Qty)
      return '(' + this.clients.current.Qty + ' occorrenze)';

    if (this.clients.current.NrUsers)
      return '(' + this.clients.current.NrUsers + ' occorrenze)';
  }

  onCopyConfig() {
    if (!this.clients.current.Modules)
      return;

    var tmp = document.createElement("textarea");
    tmp.value = this.clients.current.Modules;
    tmp.style.height = "0";
    tmp.style.overflow = "hidden";
    tmp.style.position = "fixed";
    document.body.appendChild(tmp);
    tmp.focus();
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);    
  }

  onFirst() {
    if (this.clients.first()) {
      this.configuration.showUsing(this.clients.current);
    }
  }

  onLast() {
    if (this.clients.last()) {
      this.configuration.showUsing(this.clients.current);
    }
  }

  onSearch(searchString: string) {
    this.successSearch = true;
    if (searchString == "")
      return;

    if (this.clients.searchForward(searchString)) {
      this.configuration.showUsing(this.clients.current);
    } else {
      this.successSearch = false;
    }
  }
}
