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
  
  ngOnInit() {
     this.http.get('/api/features').subscribe((data:Feature[]) => {
        this.configuration.features = data;
     });
  }
}
