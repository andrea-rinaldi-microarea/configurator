import { Pricing } from './../../../models/pricing';
import { Component, OnInit, DoCheck } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { ClientsService } from '../../services/clients.service';
import { Feature } from '../../../models/feature';

declare var require: any;
const modulePricePRO = require("./module-price-PRO.json");
const modulePriceLITE = require("./module-price-LITE.json");
const modulePriceNET = require("./module-price-NET.json");
const fragmentPrice = require("./fragment-price.json");

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit, DoCheck  {

  private modulePrice: any = {
    "PRO" : modulePricePRO,
    "LITE": modulePriceLITE,
    "NET": modulePriceNET
  }
  private fragmentPrice: any = fragmentPrice;
  public customer: Pricing = new Pricing();
  public standard: Pricing = new Pricing();
  public professional: Pricing = new Pricing();
  public enterprise: Pricing = new Pricing();
  private misconfigured: boolean = false;
  public nrCals: number = 1;
  public useCustomCals: boolean = false;
  private priceSource: string = "LITE";
  private mispriced: boolean = false;

  constructor(
    private configuration: ConfigurationService,
    private clients: ClientsService
  ) { }

  ngOnInit() {
  }
  
  ngDoCheck() {
    if (!this.useCustomCals) {
      this.nrCals = this.getCalculationCals();
    }
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
      if (!this.fragmentPrice[feat.name]) 
        continue;

      if (feat.standard != "" && feat.standard != null) {
        this.standard.license += this.fragmentPrice[feat.name].license;
      }
      if (feat.professional != "" && feat.professional != null) {
        this.professional.license += this.fragmentPrice[feat.name].license;
      }
      if (feat.enterprise != "" && feat.enterprise != null) {
        this.enterprise.license += this.fragmentPrice[feat.name].license;
      }
    }
  }

  calculateCustomerPrice(): void {
    this.customer = new Pricing();
    this.misconfigured = false;
    this.mispriced = false;
    if (!this.configuration.current || !this.clients.current)
      return;
    var foundTags: string[] = [];
    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      var feat: Feature  = this.configuration.current.features[f];
      if (feat.available && feat.customer && !feat.fromPackage && !foundTags.includes(feat.tag)) {
        if (this.modulePrice[this.priceSource][feat.tag]) {
          this.customer.license += this.modulePrice[this.priceSource][feat.tag].license;
          this.customer.mlu += this.modulePrice[this.priceSource][feat.tag].mlu;
        } else {
          this.mispriced = true;
        }
        foundTags.push(feat.tag);
      }
      if (feat.customer && !feat.available && !feat.discontinued) {
        this.misconfigured = true;
      }
    }
    if (this.clients.current.package) {
      if (this.modulePrice[this.priceSource][this.clients.current.package]) {
        this.customer.license += this.modulePrice[this.priceSource][this.clients.current.package].license;
        this.customer.mlu += this.modulePrice[this.priceSource][this.clients.current.package].mlu;
      } else {
        this.mispriced = true;
      }
    }

    this.customer.calLicense = this.modulePrice[this.priceSource]["CAL"].license * this.nrCals;
    this.customer.calMlu = this.modulePrice[this.priceSource]["CAL"].mlu * this.nrCals;

    this.customer.total5Years = this.customer.license + this.customer.calLicense + (this.customer.mlu + this.customer.calMlu) * 5;
    this.customer.perUserMonth = Math.floor(this.customer.total5Years / ((this.nrCals || 1) * 60));
  }

  getCalculationCals() : number {
    if (!this.configuration.current || !this.clients.current) {
      return 1;
    }

    if (this.clients.current["Numero C.A.L."]) {
      return this.clients.current["Numero C.A.L."];
    }

    if (this.clients.current.CALNrs) {
      return this.clients.current.CALNrs;
    }

    return 1;
  }
}
