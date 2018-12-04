import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle',
  template: `<i 
    class="fa btn btn-sm" 
    [class.disabled]="disabled"
    [ngClass]= "icons[flag? 1 : 0]"
    (click)="toggle()"
  ></i>`
})
export class ToggleComponent implements OnInit {
  @Input()  flag: boolean;
  @Output() flagChange = new EventEmitter<boolean>();
  @Input() icons: string[] = ["fa-circle-thin", "fa-circle"];
  @Input() disabled: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggle() {
    if (this.disabled) {
      return;
    }

    this.flag = !this.flag;
    this.flagChange.emit(this.flag);
  }

}
