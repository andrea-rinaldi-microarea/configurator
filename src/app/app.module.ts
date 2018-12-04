import { ClientsService } from './services/clients.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FunctionalityPipe } from './functionality-pipe';
import { ClientsComponent } from './ui/clients/clients.component';
import { ConfigurationService } from './services/configuration.service';
import { ConfigurationComponent } from './ui/configuration/configuration.component';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';


@NgModule({
  declarations: [
    AppComponent,
    FunctionalityPipe,
    ClientsComponent,
    ConfigurationComponent,
    ToolbarComponent
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
