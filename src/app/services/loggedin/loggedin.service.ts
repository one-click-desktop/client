import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { PathConstants } from '@constants/path-constants';
import { Login } from '@one-click-desktop/api-module';
import { ConfigurationService } from '@services/configuration/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedInService {
  private _login: Login;

  constructor(
    private configService: ConfigurationService,
    private router: Router
  ) {}

  login(login: Login, token: string): void {
    this._login = login;
    this.configService.token = token;
    this.router.navigate([PathConstants.HOME]);
  }

  logout(): void {
    this.configService.token = null;
    this.router.navigate([PathConstants.LOGIN]);
  }

  getLogin(): Login {
    return this._login;
  }

  isLoggedIn(): boolean {
    return !!ConfigurationService.getToken();
  }
}
