import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ConnectModalComponent } from '@components/connect-modal/connect-modal.component';
import { CreatingSessionModalComponent } from '@components/creating-session-modal/creating-session-modal.component';
import { ModalBaseComponent } from '@components/modal-base/modal-base.component';
import { RdpConnectionModalComponent } from '@components/rdp-connection-modal/rdp-connection-modal.component';
import { SelectMachineTypeModalComponent } from '@components/select-machine-type-modal/select-machine-type-modal.component';
import { TopbarComponent } from '@components/topbar/topbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiModule } from '@one-click-desktop/api-module';
import { ConfigurationService } from '@services/configuration/configuration.service';
import { HomeComponent } from '@views/home/home.component';
import { LoginComponent } from '@views/login/login.component';
import { MainComponent } from '@views/main/main.component';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

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
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ApiModule.forRoot(ConfigurationService.getConfiguration),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigurationService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

function initializeApp(configService: ConfigurationService) {
  return () => configService.loadConfiguration();
}
