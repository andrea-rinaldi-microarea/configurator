import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle',
  template: `
    <div class="toggle">
      <i 
        class="fa btn btn-sm" 
        [class.disabled]="disabled"
        [ngClass]= "icons[flag? index : 0]"
        (click)="toggle()"
      ></i>
      <i 
        class="fa fa-exchange btn switch text-config-light" 
        [hidden]="disabled || icons.length < 3 || !flag"
        (click)="switchImage()"
      ></i>
    </div>
  `,
  styles: [ `
  
  .switch {
    float: right;
    position: absolute;
    display: none;
    padding: 3px 0 0 0;
  }

  .toggle {
    display: inline;
  }
  
  .toggle:hover .switch {
    display: inline-block;
  }
`]
})
export class ToggleComponent implements OnInit {
  @Input()  flag: boolean;
  @Output() flagChange = new EventEmitter<boolean>();
  @Input() icons: string[] = ["fa-circle-thin", "fa-circle", "fa-check-square-o", "fa-sort-numeric-desc"];
  @Input() disabled: boolean = false;
  @Input() index: number = 1;
  @Output() indexChange = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  toggle() {
    if (this.disabled) {
      return;
    }

    this.flag = !this.flag;
    if (!this.flag)
      this.index = 1; 
    this.flagChange.emit(this.flag);
  }

  switchImage() {
    if (this.disabled || !this.flag) {
      return;
    }
    this.index = 1 + ((this.index + 1) % (this.icons.length - 1));
    this.indexChange.emit(this.index); 
  }

}
