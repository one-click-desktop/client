import {
  HttpErrorResponse,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { throwError } from 'rxjs';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { PathConstants } from '@constants/path-constants';
import { LoggedInService } from '@services/loggedin/loggedin.service';

import { HttpErrorInterceptor } from './http-error.interceptor';

jest.mock('@services/loggedin/loggedin.service');
jest.mock('@angular/router');

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let loggedInService: MockedObject<LoggedInService>;
  let router: MockedObject<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpErrorInterceptor, LoggedInService, Router],
    });
    interceptor = TestBed.inject(HttpErrorInterceptor);

    loggedInService = mocked(TestBed.inject(LoggedInService));
    router = mocked(TestBed.inject(Router));
    Object.defineProperty(router, 'url', {
      get: jest.fn(),
    });
    jest.spyOn(router, 'url', 'get').mockReturnValue('');
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call logout on 401 error not on login', () => {
    interceptError(401);

    expect(loggedInService.logout).toHaveBeenCalled();
  });

  it('should not call logout on 401 error on login', () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue(PathConstants.LOGIN);

    interceptError(401);

    expect(loggedInService.logout).toHaveBeenCalledTimes(0);
  });

  it('should call logout on 403 error not on login', () => {
    interceptError(403);

    expect(loggedInService.logout).toHaveBeenCalled();
  });

  it('should not call logout on 403 error on login', () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue(PathConstants.LOGIN);

    interceptError(403);

    expect(loggedInService.logout).toHaveBeenCalledTimes(0);
  });

  function interceptError(status: number) {
    const request = new HttpRequest('GET', 'someUrl');
    const next: HttpHandler = {
      handle(_: HttpRequest<unknown>): any {
        return throwError(
          new HttpErrorResponse({
            status: status,
          })
        );
      },
    };

    interceptor.intercept(request, next).subscribe(
      () => {},
      () => {}
    );
  }
});
