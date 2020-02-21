import { Distance } from './../../../models/configuration';
import { Component, OnInit, Input } from '@angular/core';

declare var require: any;
const detailedInfos = require("./detailed-info.json");

@Component({
  selector: 'app-detailed-info',
  template: `
  <div>
    <ng-content></ng-content>
    <i class="fa fa-info-circle text-muted clickable" [hidden]="!enabled" (click)="show=!show"></i>
  </div>
  <div [hidden]="!show" class="small font-weight-lighter font-italic">
  {{detailedInfo | translate}}
  </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    .clickable {
      cursor: pointer;
    }
  `]
})
export class DetailedInfoComponent implements OnInit {
  @Input() name: string = "";
  private detailedInfo: string;
  private enabled: boolean = false;
  private show: boolean = false;

  constructor() { }

  ngOnInit() {
    this.show = false;
    if (this.name) {
      this.detailedInfo = detailedInfos[this.name];
      this.enabled = (this.detailedInfo !== undefined && this.detailedInfo != "");
    }
    else {
      this.detailedInfo = "";
      this.enabled = false;
    }
  }

}
