import { ClientsService } from './services/clients.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FunctionalityPipe } from './ui/configuration/functionality-pipe';
import { ClientsComponent } from './ui/clients/clients.component';
import { ConfigurationService } from './services/configuration.service';
import { ConfigurationComponent } from './ui/configuration/configuration.component';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';
import { ExcludedPipe } from './ui/configuration/excluded-pipe';
import { EditionHeaderComponent } from './ui/edition-header/edition-header.component';
import { TogglerComponent } from './ui/toggler/toggler.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OtherIndustries } from './ui/configuration/other-industries-pipe';
import { PricingComponent } from './ui/pricing/pricing.component';

@NgModule({
  declarations: [
    AppComponent,
    FunctionalityPipe,
    ExcludedPipe,
    OtherIndustries,
    ClientsComponent,
    ConfigurationComponent,
    ToolbarComponent,
    EditionHeaderComponent,
    TogglerComponent,
    PricingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [ClientsService, ConfigurationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
