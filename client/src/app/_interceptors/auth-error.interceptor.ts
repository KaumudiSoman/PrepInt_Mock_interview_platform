import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            console.log('redirecting to login');
            this.authService.forceLogout();
            return throwError(() => error);
          }

          //Refresh tokens
          return this.authService.refreshTokens(refreshToken).pipe(
            switchMap((response: any) => {
              //Store the new tokens
              localStorage.setItem('authToken', response.token);
              localStorage.setItem('refreshToken', response.refresh);

              // Clone original request with new token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`
                }
              });

              // Retry request
              return next.handle(newReq);
            }),
            catchError(refreshError => {
              this.authService.forceLogout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
