import { Weight } from './../../../models/configuration';
import { Pricing } from './../../../models/pricing';
import { Component, OnInit, DoCheck } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { ClientsService } from '../../services/clients.service';
import { Feature } from '../../../models/feature';

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
  public standard: Pricing = new Pricing();
  public premium: Pricing = new Pricing();
  public professional: Pricing = new Pricing();
  public enterprise: Pricing = new Pricing();
  private misconfigured: boolean = false;
  private misconfiguredInfo: string = "";
  public nrCals: number = 1;
  public useCustomCals: boolean = false;
  private priceSource: string = "LITE";
  private mispriced: boolean = false;
  private mispricedInfo: string = "";
  private stdFullOptions: boolean = false;
  private prmFullOptions: boolean = false;
  private proFullOptions: boolean = false;
  private entFullOptions: boolean = false;

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

  calculateEditionPrice(weight: Weight, fullOptions: boolean, edition: Pricing) {
    edition.license = fullOptions ? weight.max : weight.min;
    edition.mlu = Math.round(edition.license * MLU_RATE);
    edition.calLicense = this.modulePrice["PRO"]["CAL"].license * this.nrCals;
    edition.calMlu = Math.round(edition.calLicense * MLU_RATE);
    edition.total5Years = edition.license + edition.calLicense + (edition.mlu + edition.calMlu) * 5;
    edition.perUserMonth = Math.round(edition.total5Years / ((this.nrCals || 1) * 60));
  }

  calculateIndustryPrices(): void {
    if (!this.configuration.current)
      return;
    this.standard = new Pricing();
    this.premium = new Pricing();
    this.professional = new Pricing();
    this.enterprise = new Pricing();

    this.calculateEditionPrice(this.configuration.current.stdWeight, this.stdFullOptions, this.standard);
    this.calculateEditionPrice(this.configuration.current.prmWeight, this.prmFullOptions, this.premium);
    this.calculateEditionPrice(this.configuration.current.proWeight, this.proFullOptions, this.professional);
    this.calculateEditionPrice(this.configuration.current.entWeight, this.entFullOptions, this.enterprise);

  }

  calculateCustomerPrice(): void {
    this.customer = new Pricing();
    this.misconfigured = false;
    this.misconfiguredInfo = "";
    this.mispriced = false;
    this.mispricedInfo = "";
    if (!this.configuration.current || !this.clients.current)
      return;
    var foundTags: string[] = [];
    for (var f = 0; f < this.configuration.current.features.length; f++ ) {
      var feat: Feature  = this.configuration.current.features[f];
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
      if (feat.customer && !feat.available && !feat.discontinued) {
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
    if (feat.module) {
      info += feat.module;
    } else {
      info += this.configuration.moduleDescription(feat.tag);
    }
    if (feat.functionality) {
      info += " - " + feat.functionality;
    }

    return info;
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
