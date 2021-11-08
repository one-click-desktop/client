import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Chance } from 'chance';
import { of, throwError } from 'rxjs';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { PathConstants } from '@constants/path-constants';
import { LoginService } from '@one-click-desktop/api-module';
import { ConfigurationService } from '@services/configuration/configuration.service';

import { LoginComponent } from './login.component';

const chance = new Chance();

jest.mock('@angular/router');
jest.mock('@services/configuration/configuration.service');
jest.mock('@one-click-desktop/api-module');

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;
  let router: MockedObject<Router>;
  let configService: MockedObject<ConfigurationService>;
  let loginService: MockedObject<LoginService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [LoginService, ConfigurationService, Router],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    router = mocked(TestBed.inject(Router));
    configService = mocked(TestBed.inject(ConfigurationService));
    Object.defineProperty(configService, 'token', {
      set: jest.fn(),
    });
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

  test('onSubmit should set token and call router navigate when login succeeds', () => {
    const token = chance.string();
    const spy = jest.spyOn(configService, 'token', 'set');
    loginService.login.mockReturnValueOnce(of({ token: token } as any));

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(token);
    expect(router.navigate).toHaveBeenCalledWith([PathConstants.HOME]);
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
