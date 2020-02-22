import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

declare var require: any;
const detailedInfos = require("./detailed-info.json");

@Component({
  selector: 'app-detailed-info',
  template: `
  <div #content>
    <ng-content></ng-content>
    <i *ngIf="enabled" class="fa fa-info-circle text-muted clickable" (click)="show=!show"></i>
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
  @ViewChild('content') content: ElementRef;
  private detailedInfo: string = "";
  private enabled: boolean = false;
  private show: boolean = false;

  constructor() { }

  ngOnInit() {
    this.detailedInfo = detailedInfos[this.name];
    this.enabled = (this.detailedInfo !== undefined && this.detailedInfo != "");
  }

  ngAfterViewInit() {
    if (!this.enabled)
      return;
    // Prevents ExpressionChangedAfterItHasBeenCheckedError
    // The innert text of the ng-content is not available before this, but the view expressions have been already checked
    // Angular raises the above error if expressions are changed again in the current update cycle, so this postpone it a bit
    Promise.resolve(null).then(() => {
      if (this.content.nativeElement.innerText == "") {
        this.enabled = false;
      }
    });
  }

}
