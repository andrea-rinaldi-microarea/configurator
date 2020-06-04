import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-detailed-info',
  template: `
  <div #content>
    <ng-content></ng-content>
    <i *ngIf="enabled" [className]="iconClass" (click)="show=!show"></i>
  </div>
  <div [hidden]="!show" class="small font-weight-lighter font-italic">
  {{details | translate}}
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
  @Input() details: string = "";
  @Input() icon: string = "fa-info-circle";
  @ViewChild('content') content: ElementRef;
  public iconClass = "";
  private enabled: boolean = false;
  private show: boolean = false;

  constructor() { }

  ngOnInit() {
    this.enabled = (this.details !== undefined && this.details != "");
    this.iconClass = "fa text-muted clickable screen-only " + this.icon;
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
