import { ConfigurationService } from './../../services/configuration.service';
import { ClientsService } from './../../services/clients.service';
import { Component, OnInit } from '@angular/core';

declare var require: any;
const modulesDescription = require("./modules-description.json");

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  private modulesDescription: any = modulesDescription;

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

  productDescri(fullDescri: string) {
    if (!fullDescri)
      return "";
    return fullDescri
      .replace("All Database", "")
      .replace("Powered by MSDE", "")
      .replace("Powered by SQL Server","")
      .trim();
  }

  decodeModules(modString: string) {
    var modules = modString.split(";");
    var description: string;
    modules.forEach(mod => {
      description = description ? description + " + ": ""; 
      description += modulesDescription[mod.trim()] ? modulesDescription[mod.trim()] : mod 
    });
    return description;
  }

  decodeClient() {
    if (this.clients.current["Ragione Sociale"])
      return this.clients.current["Ragione Sociale"];
    
    if (this.clients.current.CompanyName)
      return this.clients.current.CompanyName;

    if (this.clients.current.Modules)
      return this.decodeModules(this.clients.current.Modules);
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
    var config = document.querySelector('#config');

    document.getSelection().removeAllRanges();
    var range = document.createRange();

    range.selectNode(config);
    document.getSelection().addRange(range);

    document.execCommand('copy');

    document.getSelection().removeAllRanges();
  }

}
