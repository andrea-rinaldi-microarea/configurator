import { Pricing } from './../../../models/pricing';
import { Component, OnInit, DoCheck } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { ClientsService } from '../../services/clients.service';
import { Feature } from '../../../models/feature';

declare var require: any;
const packagePrice = require("./package-price.json");
const modulePrice = require("./module-price.json");

const CAL_PRICE: number = 660;
const CAL_MLU: number = 119;

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit, DoCheck  {

  private packagePrice: any = packagePrice;
  private modulePrice: any = modulePrice;
  public customer: Pricing = new Pricing();
  public standard: Pricing = new Pricing();
  public professional: Pricing = new Pricing();
  public enterprise: Pricing = new Pricing();
  private misconfigured: boolean = false;

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
    this.standard = new Pricing();
    this.professional = new Pricing();
    this.enterprise = new Pricing();

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
    this.customer = new Pricing();
    this.misconfigured = false;
    if (!this.configuration.current || !this.clients.current)
      return;
    var foundTags: string[] = [];
    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      var feat: Feature  = this.configuration.current.features[f];
      if (feat.available && feat.customer && !feat.fromPackage && !foundTags.includes(feat.tag)) {
        this.customer.license += modulePrice[feat.tag].license;
        this.customer.mlu += modulePrice[feat.tag].mlu;
      }
      if (feat.customer && !feat.available && !feat.discontinued) {
        this.misconfigured = true;
      }
    }
    if (this.clients.current.package) {
      this.customer.license += packagePrice[this.clients.current.package].license;
      this.customer.mlu += packagePrice[this.clients.current.package].mlu;
    }
    if (this.clients.current["Numero C.A.L."]) {
      this.customer.cals = this.clients.current["Numero C.A.L."];
      this.customer.calLicense = CAL_PRICE * this.customer.cals;
      this.customer.calMlu = CAL_MLU * this.customer.cals;
    }

    this.customer.total5Years = this.customer.license + this.customer.calLicense + (this.customer.mlu + this.customer.calMlu) * 5;
    this.customer.perUserMonth = this.customer.total5Years / (this.customer.cals * 60);
  }

}
