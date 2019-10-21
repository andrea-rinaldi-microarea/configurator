import { Pricing } from './../../../models/pricing';
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
  public customer: Pricing = new Pricing(0,0);
  public standard: Pricing = new Pricing(0,0);
  public professional: Pricing = new Pricing(0,0);
  public enterprise: Pricing = new Pricing(0,0);

  constructor(
    private configuration: ConfigurationService,
    private clients: ClientsService
  ) { }

  ngOnInit() {
  }
  
  ngDoCheck() {
    // @@@TODO fare solo se la change detection riguarda i dati coinvolti nei calcoli
    this.calculateCustomerPrice();
    this.calculateIndustryPrices();
  }

  calculateIndustryPrices(): void {
    if (!this.configuration.current)
      return;
    this.standard = new Pricing(0,0);
    this.professional = new Pricing(0,0);
    this.enterprise = new Pricing(0,0);

    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      var feat: Feature  = this.configuration.current.features[f];
      if (feat.standard != "" && feat.standard != null) {
        this.standard.license += feat.license;
        this.standard.mlu += feat.mlu;
      }
      if (feat.professional != "" && feat.professional != null) {
        this.professional.license += feat.license;
        this.professional.mlu += feat.mlu;
      }
      if (feat.enterprise != "" && feat.enterprise != null) {
        this.enterprise.license += feat.license;
        this.enterprise.mlu += feat.mlu;
      }
    }
  }

  calculateCustomerPrice(): void {
    this.customer = new Pricing(0,0);
    if (!this.configuration.current)
      return;
    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      var feat: Feature  = this.configuration.current.features[f];
      if (!feat.unavailable && feat.customer && !feat.fromPackage) {
        this.customer.license += feat.license;
        this.customer.mlu += feat.mlu;
      }
    }
    if (this.clients.current && this.clients.current.package) {
      this.customer.license += packagePrice[this.clients.current.package].license;
      this.customer.mlu += packagePrice[this.clients.current.package].mlu;
    }
  }

}
