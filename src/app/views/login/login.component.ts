import { Component } from '@angular/core';

import { Login, LoginService } from '@one-click-desktop/api-module';
import { LoggedInService } from '@services/loggedin/loggedin.service';

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
    private loggedInService: LoggedInService
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
          this.loggedInService.login(this.login, token.token);
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
    this.loggedInService.login(this.login, 'abc');
  }
}
