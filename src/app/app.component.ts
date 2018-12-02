import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature } from '../models/feature';
import { Configuration } from '../models/configuration';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  private configuration: Configuration = new Configuration("Production",[]);
  private clients: any[];
  
  ngOnInit() {
     this.http.get('/api/features').subscribe((data:Feature[]) => {
        this.configuration.features = data;
     });
  }

  private find(name: string): Feature {
    for (var f = 0; f <= this.configuration.features.length; f++) {
      if (this.configuration.features[f].module == name)
        return this.configuration.features[f];
    }
    return null;
  }

  onDownload() {
    this.http.get('/api/clients').subscribe((data:any[]) => {
      this.clients = data;
      var mod = "ADPK";
      if (this.clients[0][mod] === "X") {
        var feat: Feature = this.find("Contabilità Generale");
        if (feat)
          feat.customer = true;
      }
    });
  }
}
