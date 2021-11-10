import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { Chance } from 'chance';
import { of, throwError } from 'rxjs';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { LoginService } from '@one-click-desktop/api-module';
import { LoggedInService } from '@services/loggedin/loggedin.service';

import { LoginComponent } from './login.component';

const chance = new Chance();

jest.mock('@services/loggedin/loggedin.service');
jest.mock('@one-click-desktop/api-module');

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;
  let loggedInService: MockedObject<LoggedInService>;
  let loginService: MockedObject<LoginService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [LoginService, LoggedInService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    loggedInService = mocked(TestBed.inject(LoggedInService));

    loginService = mocked(TestBed.inject(LoginService));
    loginService.login.mockImplementation(() => of());
  });

  test('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  test('should set login to object', () => {
    expect(component.login).toBeTruthy();
  });

  test('onSubmit should call login', () => {
    component.onSubmit();

    expect(loginService.login).toHaveBeenCalled();
  });

  test('onSubmit should call login when login succeeds', () => {
    const token = chance.string();
    const login = { login: chance.string(), password: chance.string() };
    loginService.login.mockReturnValueOnce(of({ token: token } as any));
    component.login = login;

    component.onSubmit();

    expect(loggedInService.login).toHaveBeenCalledWith(login, token);
  });

  test('onSubmit should set error string to login incorrect if error has code 401', () => {
    loginService.login.mockReturnValueOnce(throwError({ code: 401 }));

    component.onSubmit();

    expect(component.error).toBe('Login or password incorrect');
  });

  test('onSubmit should set error string to unable to connect if error code is not 401', () => {
    loginService.login.mockReturnValueOnce(throwError({}));

    component.onSubmit();

    expect(component.error).toBe('Unable to connect to server');
  });
});
