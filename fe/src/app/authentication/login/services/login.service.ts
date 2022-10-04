import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/shared/models/user.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Injectable()
export class LoginService {
  private prefix: string = 'auth';

  constructor(private http: HttpClient, private utilities: UtilitiesService) {}

  login(user: User): Observable<User> {
    return this.http.post<User>(`/${this.prefix}/login`, user).pipe(
      map((data) => {
        this.utilities.setToken(data);
        return data;
      }),
      catchError((error) => {
        return throwError('Something went wrong!' + JSON.stringify(error));
      })
    );
  }

  forgotPassword(username: string): Observable<User> {
    return this.http
      .post<User>(`/${this.prefix}/forgot`, {
        username: username,
        hostInfo: location.host,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((error) => {
          return throwError('Something went wrong!' + JSON.stringify(error));
        })
      );
  }
}
