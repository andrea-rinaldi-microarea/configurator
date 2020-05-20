import { FeaturesSheetService } from './services/features-sheet.service';
import { ClientsService } from './services/clients.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FunctionalityPipe } from './ui/industry-edit/configuration/functionality-pipe';
import { ClientsComponent } from './ui/industry-edit/clients/clients.component';
import { ConfigurationService } from './services/configuration.service';
import { ConfigurationComponent } from './ui/industry-edit/configuration/configuration.component';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';
import { ExcludedPipe } from './ui/industry-edit/configuration/excluded-pipe';
import { EditionHeaderComponent } from './ui/industry-edit/edition-header/edition-header.component';
import { TogglerComponent } from './ui/toggler/toggler.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OtherIndustries } from './ui/industry-edit/configuration/other-industries-pipe';
import { PricingComponent } from './ui/industry-edit/pricing/pricing.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DetailedInfoComponent } from './ui/industry-edit/detailed-info/detailed-info.component';
import { IndustryEditComponent } from './ui/industry-edit/industry-edit.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FeaturesSheetComponent } from './ui/features-sheet/features-sheet.component';
import { LineExcludedPipe } from './ui/features-sheet/line-excluded-pipe';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    FunctionalityPipe,
    ExcludedPipe,
    LineExcludedPipe,
    OtherIndustries,
    ClientsComponent,
    ConfigurationComponent,
    ToolbarComponent,
    EditionHeaderComponent,
    TogglerComponent,
    PricingComponent,
    DetailedInfoComponent,
    IndustryEditComponent,
    FeaturesSheetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ClientsService, ConfigurationService, FeaturesSheetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
