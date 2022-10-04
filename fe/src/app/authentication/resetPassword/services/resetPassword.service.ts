import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ResetPasswordService {
  private prefix: string = 'auth';

  constructor(private http: HttpClient) {}

  resetPassword(password: string, token: any): Observable<boolean> {
    return this.http
      .put(`/${this.prefix}/reset`, {
        token: token,
        password: password,
      })
      .pipe(
        map(() => {
          return true;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }
}
