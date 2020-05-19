import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-industry-edit',
  templateUrl: './industry-edit.component.html',
  styleUrls: ['./industry-edit.component.css']
})
export class IndustryEditComponent implements OnInit {

  constructor(private clients: ClientsService) { }

  ngOnInit() {
  }

}
