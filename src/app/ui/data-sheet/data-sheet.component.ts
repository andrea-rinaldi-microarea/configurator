import { CSVDataSheet, CSVDataSheetLine } from './../../../models/data-sheet';
import { DataSheetLine, DataSheetLineOption } from '../../../models/data-sheet';
import { DataSheetService } from '../../services/data-sheet.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';

declare var require: any;

@Component({
  selector: 'app-data-sheet',
  templateUrl: './data-sheet.component.html',
  styleUrls: ['./data-sheet.component.css']
})
export class DataSheetComponent implements OnInit {

  private currIndustry:  number = null;
  private industryList: string[];
  private editMode: boolean;
  private showDetails: boolean = false;
  private hideExcluded: boolean = false;

  private topicTypes = [
    {
      value: "",
      icon: "fa-circle-o"
    },
    {
      value: "always",
      icon: "fa-circle"
    },
    {
      value: "optional",
      icon: "fa-check-square-o"
    },
    {
      value: "count",
      icon: "fa-user-plus"
    },
    {
      value: "PPT",
      icon: "fa-money"
    }
  ];

  private includedOptions = [
    {
      value: false,
      icon: "fa-sign-in"
    },
    {
      value: true,
      icon: "fa-ban"
    }
  ];

  constructor(
    private dataSheet: DataSheetService,
    public translate: TranslateService,
    public titleService: Title,
    private ref: ChangeDetectorRef,
    private product: ProductService
  ) {
    this.industryList = product.industryList();
  }

  private setTitle() {
    this.titleService.setTitle(this.industryList[this.currIndustry] + " - Data Sheet (" + this.translate.currentLang + ")");
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setTitle();
    });
  }

  private ShowDataSheet() {
    this.dataSheet.load(this.industryList[this.currIndustry]).subscribe( res => {
      this.editMode = false;
      this.setTitle();
    });
  }

  onNext() {
    if (this.currIndustry == null) {
      this.currIndustry = -1;
    }
    if (this.currIndustry < this.industryList.length - 1) {
      this.currIndustry++;
      this.ShowDataSheet();
    }
  }

  onPrev() {
    if (this.currIndustry == null) {
      this.currIndustry = 1;
    }
    if (this.currIndustry > 0) {
      this.currIndustry--;
      this.ShowDataSheet();
    }
  }

  onIndustryChanged() {
    this.ShowDataSheet();
  }

  topicClass(line: DataSheetLine) {
    return "level-" + line.level;
  }

  isLocalized(line: DataSheetLine): boolean {
    return  (typeof line.allowISO != "undefined" && line.allowISO != "" ) ||
            (typeof line.denyISO != "undefined" && line.denyISO != "")
  }

  ISOTooltip(line: DataSheetLine) {
    var tooltip: string;
    if (line.allowISO != "") {
      tooltip = this.translate.instant("Available in") + ": " + line.allowISO;
    }
    if (typeof line.denyISO !== "undefined" && line.denyISO != "") {
      if (tooltip != null) tooltip += "\n";
      tooltip = this.translate.instant("Not available in")  + ": " + line.denyISO;
    }
    return tooltip;
  }

  ISODetails(line: DataSheetLine) {
    if (!this.isLocalized(line))
      return "";

    return "<br/>(" + this.ISOTooltip(line) + ")";
  }

  option(line: DataSheetLine, edition: string): DataSheetLineOption {
    var option : DataSheetLineOption = line.options.find(o => o.edition == edition);
    if (!option) {
      option = new DataSheetLineOption(edition);
      line.options.push(option);
    }
    return option;
  }

  onSave() {
    this.dataSheet.save();
  }

  onCancel() {
    this.ShowDataSheet();
  }

  onCopy(sourceIndustry) {
    this.dataSheet.copy(sourceIndustry).subscribe();
  }

  onPrint() {
    this.hideExcluded = true;
    this.showDetails = true;
    this.ref.detectChanges();
    window.print();
  }

  onCSVExport() {
    var csv = new CSVDataSheet(this.dataSheet.current.name);
    this.dataSheet.current.lines.forEach( line => {
      if (!line.included) return;
      csv.lines.push(new CSVDataSheetLine({
        level: line.level,
        title: this.translate.instant(line.title),
        details: line.details ? this.translate.instant(line.details) : ''
      }))
    });
    this.dataSheet.CSVExport(csv);
  }
}
