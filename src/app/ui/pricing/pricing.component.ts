import { Component, OnInit } from '@angular/core';
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
export class PricingComponent implements OnInit {

  private packagePrice: any = packagePrice;
  public totalMLU: number = 0;

  constructor(
    private configuration: ConfigurationService,
    private clients: ClientsService
  ) { }

  ngOnInit() {
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

  getCustomerPrice(): number {
    var total: number = 0;
    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      var feat: Feature  = this.configuration.current.features[f];
      if (!feat.unavailable && feat.customer && !feat.fromPackage) {
        total += feat.price;
        this.totalMLU += feat.mlu;
      }
    }
    if (this.clients.current && this.clients.current.package) {
      total += packagePrice[this.clients.current.package].price;
      this.totalMLU += packagePrice[this.clients.current.package].mlu;
    }

    return total;
  }

}
