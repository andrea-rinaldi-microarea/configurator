import { ClientsService } from './services/clients.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FunctionalityPipe } from './functionality-pipe';
import { ClientsComponent } from './clients/clients.component';
import { ConfigurationService } from './services/configuration.service';


@NgModule({
  declarations: [
    AppComponent,
    FunctionalityPipe,
    ClientsComponent
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
