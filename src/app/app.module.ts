import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from '@views/main/main.component';
import { TopbarComponent } from '@components/topbar/topbar.component';
import { HomeComponent } from './views/home/home.component';
import { ConnectModalComponent } from './components/connect-modal/connect-modal.component';
import { ApiModule } from '@api-module/api.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TopbarComponent,
    HomeComponent,
    ConnectModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    NgbModule,
    ApiModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
