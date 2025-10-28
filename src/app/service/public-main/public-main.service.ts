import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../resident/authenticate/authenticate.service';
import { FunctionMainService } from '../function/function-main.service';
import { ClientMainService } from '../client-app/client-main.service';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PublicMainService implements HttpInterceptor {

  constructor(private authService: AuthService, private functionMain: FunctionMainService, private clientMain: ClientMainService, private storage: StorageService, private router: Router) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        if (req.url.includes(this.functionMain.rggAuth)) {
          return next.handle(req);
        }

        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        return from(this.storage.getValueFromStorage('RGG_CALL_DATA')).pipe(
          switchMap((value) => {
            if (value) {
              return this.clientMain.getApi({}, this.functionMain.rggAuth).pipe(
                switchMap((results: any) => {
                  if (results.result.status_code === 401) {
                    this.functionMain.presentToast("Invalid session.", "danger");
                    this.functionMain.logout();
                    this.router.navigate(['/login-vms']);
                    return EMPTY;
                  }
                  return this.handleRequestWithErrorHandling(req, next);
                }),
                catchError((error) => {
                  console.error('rggAuth API error:', error);
                  return EMPTY
                })
              );
            } else {
              return this.handleRequestWithErrorHandling(req, next);
            }
          })
        );
      })
    );
  }

  private handleRequestWithErrorHandling(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((res) => {
        if (res instanceof HttpResponse) {
          if (res.body?.result?.status_code === 403) {
            throw new HttpErrorResponse({ status: 401, error: 'Token expired' });
          }
          if (res.body?.result?.status_code === 408) {
            this.functionMain.logout();
            throw new HttpErrorResponse({ status: 401, error: 'Token expired' });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap((newToken) => {
              if (newToken) {
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                return next.handle(req);
              } else {
                this.functionMain.logout();
                return throwError(() => error);
              }
            }),
            catchError((refreshError) => {
              this.functionMain.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }
  


}
