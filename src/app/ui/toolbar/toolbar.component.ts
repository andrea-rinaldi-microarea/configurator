import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private clients: ClientsService,
    public translate: TranslateService
  ) { 
    translate.addLangs(['en', 'it']);
    translate.setDefaultLang('en');
  }

  ngOnInit() {
  }

}
