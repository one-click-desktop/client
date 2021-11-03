import { Component, OnInit } from '@angular/core';
import { LoginService } from '@api-module/api/api';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private loginService: LoginService) {}
}
