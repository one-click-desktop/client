import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { Chance } from 'chance';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { PathConstants } from '@constants/path-constants';
import { ConfigurationService } from '@services/configuration/configuration.service';
import { getLoginFixture } from '@testing/fixtures';

import { LoggedInService } from './loggedin.service';

const chance = new Chance();

jest.mock('@angular/router');
jest.mock('@services/configuration/configuration.service');

describe('LoggedInService', () => {
  let service: LoggedInService;
  let router: MockedObject<Router>;
  let configService: MockedObject<ConfigurationService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigurationService, Router],
    });
    service = TestBed.inject(LoggedInService);

    router = mocked(TestBed.inject(Router));
    configService = mocked(TestBed.inject(ConfigurationService));
    Object.defineProperty(configService, 'token', {
      set: jest.fn(),
    });
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('login should set token and call navigate', () => {
    const token = chance.string();
    const spy = jest.spyOn(configService, 'token', 'set');

    service.login(null, token);

    expect(spy).toHaveBeenCalledWith(token);
    expect(router.navigate).toHaveBeenCalledWith([PathConstants.HOME]);
  });

  test('logout should clear token and call navigate', () => {
    const spy = jest.spyOn(configService, 'token', 'set');

    service.logout();

    expect(spy).toHaveBeenCalledWith(null);
    expect(router.navigate).toHaveBeenCalledWith([PathConstants.LOGIN]);
  });

  test('getLogin should return saved login info', () => {
    const login = getLoginFixture();
    service.login(login, chance.string());

    expect(service.getLogin()).toBe(login);
  });
});
