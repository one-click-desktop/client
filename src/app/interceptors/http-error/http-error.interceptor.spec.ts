import {
  HttpErrorResponse,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { throwError } from 'rxjs';
import { mocked, MockedObject } from 'ts-jest/dist/utils/testing';

import { LoggedInService } from '@services/loggedin/loggedin.service';

import { HttpErrorInterceptor } from './http-error.interceptor';

jest.mock('@services/loggedin/loggedin.service');

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let loggedInService: MockedObject<LoggedInService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpErrorInterceptor, LoggedInService],
    });
    interceptor = TestBed.inject(HttpErrorInterceptor);

    loggedInService = mocked(TestBed.inject(LoggedInService));
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call logout on 401 error and logged in', () => {
    jest.spyOn(loggedInService, 'isLoggedIn').mockReturnValue(true);

    interceptError(401);

    expect(loggedInService.logout).toHaveBeenCalled();
  });

  it('should not call logout on 401 error and not logged in', () => {
    jest.spyOn(loggedInService, 'isLoggedIn').mockReturnValue(false);

    interceptError(401);

    expect(loggedInService.logout).toHaveBeenCalledTimes(0);
  });

  it('should call logout on 403 error and logged in', () => {
    jest.spyOn(loggedInService, 'isLoggedIn').mockReturnValue(true);

    interceptError(403);

    expect(loggedInService.logout).toHaveBeenCalled();
  });

  it('should not call logout on 403 error and not logged in', () => {
    jest.spyOn(loggedInService, 'isLoggedIn').mockReturnValue(false);

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
