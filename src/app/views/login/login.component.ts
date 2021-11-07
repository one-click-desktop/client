import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '@api-module/api/api';
import { Login } from '@api-module/model/models';
import { PathConstants } from '@constants/path-constants';
import { ConfigurationService } from '@services/configuration/configuration.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: Login;
  error: string;

  processing: boolean;

  constructor(
    private loginService: LoginService,
    private settingsService: ConfigurationService,
    private router: Router
  ) {
    this.login = {
      login: null,
      password: null,
    };
  }

  onSubmit(): void {
    this.processing = true;
    this.error = null;
    this.loginService
      .login(this.login)
      .subscribe(
        (token) => {
          this.settingsService.token = token.token;
          this.router.navigate([PathConstants.HOME]);
        },
        (error) => {
          this.error =
            error?.code === 401
              ? 'Login or password incorrect'
              : 'Unable to connect to server';
        }
      )
      .add(() => {
        this.processing = false;
      });
  }

  // !REMOVE
  cont(): void {
    this.settingsService.token = 'abc';
    this.router.navigate([PathConstants.HOME]);
  }
}