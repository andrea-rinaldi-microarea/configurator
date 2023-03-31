import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductService, MAGO_CLOUD } from '../../services/product.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  public activeRoute: string = "industry-edit";

  constructor(
    private clients: ClientsService,
    public translate: TranslateService,
    public product: ProductService
  ) {
    translate.addLangs(['en', 'it', 'de', 'es']);
    translate.setDefaultLang('en');
    translate.currentLang = 'en';
  }

  ngOnInit() {
  }

  public logo() : string {
    if (this.product.activeProduct() == MAGO_CLOUD)
      return "/assets/M4Cloud.png";
    else
      return "/assets/MagoWebLogoInv.png";
  }

}
