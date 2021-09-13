import { Title } from '@angular/platform-browser';
import { Mago4Module, Mago4Modules } from './../../../models/Mago4';
import { Component, OnInit } from '@angular/core';
import { IndustryService } from '../../services/industry.service';
import { Feature } from '../../../models/Industry';

declare var require: any;
const moduleTags = require("../../services/module-tags.json");
const features = require("../../services/features.json");

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  public mago4Modules: Mago4Modules = new Mago4Modules();

  constructor(
    private industry: IndustryService
  ) { 
  }

  ngOnInit() {
    moduleTags.forEach(tag => {
      if (typeof(tag.package) === "undefined" && tag.m4Only != true) {
        if (typeof(tag.title) != "undefined") {
          var area = new Mago4Module("", tag.title);
          area.isArea = true;
          if (typeof(tag.class != "undefined")) {
            area.class = tag.class
          }
          this.mago4Modules.modules.push(area);  
        }
        var module = new Mago4Module(tag.tag, this.industry.moduleDescription(tag.tag));
        features.forEach((f:Feature)  => {
          if (f.isAvailable == true && (f.tag == module.tag || tag.includedIn == f.fragment)) {
            module.features.push(new Feature(f));
          }
        });
        this.mago4Modules.modules.push(module);
      }
    });
  }

}
