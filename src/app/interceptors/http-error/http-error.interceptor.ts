import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoggedInService } from '@services/loggedin/loggedin.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private loggedInService: LoggedInService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
      case 403:
        if (this.loggedInService.isLoggedIn()) {
          this.loggedInService.logout();
        }
        break;
    }
  }
}
