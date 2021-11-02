import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from '@views/main/main.component';
import { TopbarComponent } from '@components/topbar/topbar.component';
import { HomeComponent } from './views/home/home.component';
import { SelectMachineTypeModalComponent } from './components/select-machine-type-modal/select-machine-type-modal.component';
import { ApiModule } from '@api-module/api.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConnectModalComponent } from './components/connect-modal/connect-modal.component';
import { ModalBaseComponent } from './components/modal-base/modal-base.component';
import { CreatingSessionModalComponent } from './components/creating-session-modal/creating-session-modal.component';
import { RdpConnectionModalComponent } from './components/rdp-connection-modal/rdp-connection-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TopbarComponent,
    HomeComponent,
    SelectMachineTypeModalComponent,
    ConnectModalComponent,
    ModalBaseComponent,
    CreatingSessionModalComponent,
    RdpConnectionModalComponent,
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
