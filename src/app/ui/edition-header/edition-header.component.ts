import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edition-header',
  template: `
    <div class="header" [class.enabled]="!disabled">
      <ng-content></ng-content>  
      <i class="fa fa-circle select-all text-config" [hidden]="disabled"></i>
    </div>
  `,
  styles: [`
    .header {
      display: inline;
    }

    .enabled {
      cursor: pointer;
    }

    .select-all {
      position: absolute;
      opacity: 0.7;
      display: none;
      padding: 5px 0 0 2px;
    }

    .header:hover .select-all {
      display: inline-block;
    }
  `]
})
export class EditionHeaderComponent implements OnInit {
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
