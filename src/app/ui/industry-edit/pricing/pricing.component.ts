import { Pricing } from './../../../../models/pricing';
import { Component, OnInit, DoCheck } from '@angular/core';
import { ClientsService } from '../../../services/clients.service';
import { IndustryService } from '../../../services/industry.service';
import { Weight, Feature, Edition } from '../../../../models/Industry';
import { ProductService } from '../../../services/product.service';

declare var require: any;
const modulePricePRO = require("./module-price-PRO.json");
const modulePriceLITE = require("./module-price-LITE.json");
const modulePriceNET = require("./module-price-NET.json");
const MLU_RATE: number = 0.18;

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
  public customer: Pricing = new Pricing();
  public pricings: Pricing[] = [];
  private misconfigured: boolean = false;
  private misconfiguredInfo: string = "";
  public nrCals: number = 1;
  public useCustomCals: boolean = false;
  private priceSource: string = "LITE";
  private mispriced: boolean = false;
  private mispricedInfo: string = "";
  private fullOptions: boolean[] = [false, false, false, false];
  private editions: Edition[] = [];

  constructor(
    private industry: IndustryService,
    private clients: ClientsService,
    private product: ProductService
  ) {
    this.editions = product.editions();
  }

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

  calculateEditionPrice(weight: Weight, fullOptions: boolean, edition: Pricing) {
    edition.license = fullOptions ? weight.max : weight.min;
    edition.mlu = Math.round(edition.license * MLU_RATE);
    edition.calLicense = this.modulePrice["PRO"]["CAL"].license * this.nrCals;
    edition.calMlu = Math.round(edition.calLicense * MLU_RATE);
    edition.total5Years = edition.license + edition.calLicense + (edition.mlu + edition.calMlu) * 5;
    edition.perUserMonth = Math.round(edition.total5Years / ((this.nrCals || 1) * 60));
  }

  calculateIndustryPrices(): void {
    if (!this.industry.current)
      return;

    this.pricings = [];
    this.product.editions().forEach((e, idx) => {
      var pricing = new Pricing();
      this.calculateEditionPrice(this.industry.current.weights[idx], this.fullOptions[idx], pricing);
      this.pricings.push(pricing);
    });

  }

  calculateCustomerPrice(): void {
    this.customer = new Pricing();
    this.misconfigured = false;
    this.misconfiguredInfo = "";
    this.mispriced = false;
    this.mispricedInfo = "";
    if (!this.industry.current || !this.clients.current)
      return;
    var foundTags: string[] = [];
    for (var f = 0; f < this.industry.current.features.length; f++ ) {
      var feat: Feature  = this.industry.current.features[f];
        if (feat.customer && !feat.fromPackage && !foundTags.includes(feat.tag)) {
          if (this.modulePrice[this.priceSource][feat.tag]) {
          this.customer.license += this.modulePrice[this.priceSource][feat.tag].license;
          this.customer.mlu += this.modulePrice[this.priceSource][feat.tag].mlu;
        } else {
          this.mispriced = true;
          this.mispricedInfo += this.getFeatureInfo(feat, this.mispricedInfo.length == 0);
        }
        foundTags.push(feat.tag);
      }
      if (feat.customer && !feat.included && !feat.discontinued) {
        this.misconfigured = true;
        this.misconfiguredInfo += this.getFeatureInfo(feat, this.misconfiguredInfo.length == 0);;
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

  getFeatureInfo(feat: Feature, first: boolean): string {
    var info: string = first ? "" : ", ";
    info += this.industry.moduleDescription(feat.tag);
    if (feat.description) {
      info += " - " + feat.description;
    }

    return info;
  }

  getCalculationCals() : number {
    if (!this.industry.current || !this.clients.current) {
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
