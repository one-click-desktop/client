import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from '@views/main/main.component';
import { TopbarComponent } from '@components/topbar/topbar.component';

@NgModule({
  declarations: [AppComponent, MainComponent, TopbarComponent],
  imports: [BrowserModule, AppRoutingModule, NgxElectronModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
