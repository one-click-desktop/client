import { HttpEvent, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { CorsInterceptor } from './cors.interceptor';

describe('CorsInterceptor', () => {
  let interceptor: CorsInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CorsInterceptor],
    });
    interceptor = TestBed.inject(CorsInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should set withCredentials to false', () => {
    const request = new HttpRequest('GET', 'someUrl');
    const handler = {
      handle(request: HttpRequest<unknown>) {
        expect(request.withCredentials).toBeFalsy();
        return of<HttpEvent<any>>();
      },
    };
    interceptor.intercept(request, handler);
  });
});
