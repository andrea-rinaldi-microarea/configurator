import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private clients: ClientsService) { }

  ngOnInit() {
  }

}
