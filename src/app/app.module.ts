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
import { ToggleComponent } from './ui/toggle/toggle.component';
import { ExcludedPipe } from './ui/configuration/excluded-pipe';


@NgModule({
  declarations: [
    AppComponent,
    FunctionalityPipe,
    ExcludedPipe,
    ClientsComponent,
    ConfigurationComponent,
    ToolbarComponent,
    ToggleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ClientsService, ConfigurationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
