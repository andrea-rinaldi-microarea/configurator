import { Injectable } from '@angular/core';
import { Feature } from '../../models/Industry';

declare var require: any;
const productConfig = require("./product-config.json");

const MCindustryList = require("./mc-industry-list.json");
const MWindustryList = require("./mw-industry-list.json");

const MCFeatures = require("./mc-features.json");
const MWFeatures = require("./mw-features.json");

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
      return MCindustryList;
    }
    else {
      return MWindustryList;
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

}
