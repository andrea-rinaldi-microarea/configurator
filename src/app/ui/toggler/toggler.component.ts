import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-toggler',
  template: `
    <div class="toggler">
      <i 
        class="fa btn btn-sm" 
        [class.disabled]="disabled"
        [ngClass]= "options[index].icon"
        (click)="toggle()"
      ></i>
      <i 
        class="fa fa-exchange btn switch text-config-light" 
        [hidden]="disabled || options.length < 3 || index == 0"
        (click)="switchIcon()"
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

  .toggler {
    display: inline;
  }
  
  .toggler:hover .switch {
    display: inline-block;
  }
`]
})
export class TogglerComponent implements OnInit, OnChanges {
  @Input()  value: any;
  @Output() valueChange = new EventEmitter<any>();
  @Input() options: any[] = [
    {
      value: false,
      icon: "fa-eye-slash"
    }, 
    {
      value: true,
      icon: "fa-eye"
    }
  ];
  @Input() disabled: boolean = false;
  private index: number = 0;

  constructor() { }

  ngOnInit() {
    this.setIndex();
  }

  ngOnChanges() {
    this.setIndex();
  }

  private setIndex() {
    for (var i = 0; i < this.options.length; i++) {
      if (this.value == this.options[i].value)
        this.index = i;
    }
  }

  toggle() {
    if (this.disabled) {
      return;
    }

    this.index == 0 ? this.index = 1 : this.index = 0; 
    this.value = this.options[this.index].value;
    this.valueChange.emit(this.value);
  }

  switchIcon() {
    if (this.disabled || this.index == 0) {
      return;
    }
    this.index = 1 + ((this.index) % (this.options.length - 1));
    this.value = this.options[this.index].value;
    this.valueChange.emit(this.value); 
  }

}
