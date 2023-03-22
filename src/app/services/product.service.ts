import { Injectable } from '@angular/core';
import { Edition, Feature } from '../../models/Industry';

declare var require: any;
const productConfig = require("./product-config.json");

const MCIndustryList = require("./mc-industry-list.json");
const MWIndustryList = require("./mw-industry-list.json");

const MCFeatures = require("./mc-features.json");
const MWFeatures = require("./mw-features.json");

const MCEditions = require("./mc-editions.json");
const MWEditions = require("./mw-editions.json");

export const MAGO_CLOUD = "MagoCloud";
export const MAGO_WEB = "MagoWeb";

@Injectable()
export class ProductService {


  private productConfig: any = productConfig;

  constructor() {  }

  public activeProduct() : string {
    return productConfig["activeProduct"];
  }

  public industryList() : string[] {
    if (productConfig["activeProduct"] == MAGO_CLOUD) {
      return MCIndustryList;
    }
    else {
      return MWIndustryList;
    }
  }

  public features(product? : string) : Feature[] {
    if (typeof product === 'undefined') {
      product = productConfig["activeProduct"];
    }

    if (product == MAGO_CLOUD) {
      return MCFeatures;
    } else {
      return MWFeatures;
    }

  }

  public editions() : Edition[]
  {
    if (productConfig["activeProduct"] == MAGO_CLOUD) {
      return MCEditions;
    }
    else {
      return MWEditions;
    }
  }

}
