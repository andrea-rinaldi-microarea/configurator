import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature } from '../models/feature';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) { }
  apiValues: Feature[] = [];
  ngOnInit() {
     this.http.get('/api/features').subscribe((data:Feature[]) => {
        this.apiValues = data;
     });
  }
}
