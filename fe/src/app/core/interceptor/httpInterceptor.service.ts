import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  connect = false;
  private count = 0;
  private basePath: string = '';

  constructor(
    private router: Router,
    private utilities: UtilitiesService,
    private spinnerService: SpinnerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let request = req;

    if (req.headers) {
      this.basePath = this.utilities.getBasePath();

      const tokenRDS: string = this.utilities.getToken();

      if (tokenRDS) {
        request = req.clone({
          url: this.basePath + req.url,
          setHeaders: {
            authorization: `Bearer ${tokenRDS}`,
          },
        });
      } else {
        request = req.clone({
          url: this.basePath + req.url,
        });
      }
    } else {
      this.basePath = this.utilities.getBasePath();

      const token: string = this.utilities.getToken();

      if (token) {
        request = req.clone({
          url: this.basePath + req.url,
          setHeaders: {
            authorization: `Bearer ${token}`,
          },
        });
      } else {
        request = req.clone({
          url: this.basePath + req.url,
        });
      }
    }

    //TODO status spinner
    this.spinnerService.setStatus(true);
    this.count++;

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401) {
          this.utilities.logOut();
        }

        if (err.status == 403) {
          this.utilities.logOut();
        }

        return throwError(() => err);
      }),
      finalize(() => {
        this.count--;
        if (this.count == 0) {
          this.spinnerService.setStatus(false);
        }
      })
    );
  }
}
