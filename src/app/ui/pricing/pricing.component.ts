import { Component, OnInit, DoCheck } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { ClientsService } from '../../services/clients.service';
import { Feature } from '../../../models/feature';

declare var require: any;
const packagePrice = require("./package-price.json");

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit, DoCheck  {

  private packagePrice: any = packagePrice;
  public customerLicense: number = 0;
  public customerMLU: number = 0;

  constructor(
    private configuration: ConfigurationService,
    private clients: ClientsService
  ) { }

  ngOnInit() {
  }
  
  ngDoCheck() {
    console.log("change");
    this.calculateCustomerPrice();
  }

  getPrice(edition: string): number {
    if (!this.configuration.current)
      return;
    var total: number = 0;
    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      var feat: Feature  = this.configuration.current.features[f];
      if (feat[edition] != "" && feat[edition] != null) {
        total += feat.price;
      }
    }
    return total;
  }

  calculateCustomerPrice(): void {
    this.customerLicense = 0;
    this.customerMLU = 0;
    if (!this.configuration.current)
      return;
    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      var feat: Feature  = this.configuration.current.features[f];
      if (!feat.unavailable && feat.customer && !feat.fromPackage) {
        this.customerLicense += feat.price;
        this.customerMLU += feat.mlu;
      }
    }
    if (this.clients.current && this.clients.current.package) {
      this.customerLicense += packagePrice[this.clients.current.package].price;
      this.customerMLU += packagePrice[this.clients.current.package].mlu;
    }
  }

}
