import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export abstract class ResourceService<T> {
  private readonly APIUrl = this.getResourceUrl();

  constructor(protected httpClient: HttpClient) {}

  abstract getResourceUrl(): string;

  getListPaginated(page: number, count: number): Observable<T[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('count', count.toString());

    return this.httpClient
      .get<T[]>(`/${this.APIUrl}?${params.toString()}`)
      .pipe(catchError(this.handleError));
  }

  getList(id: string | number = ''): Observable<T[]> {
    return this.httpClient
      .get<T[]>(`/${this.APIUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  get(id: string | number): Observable<T> {
    return this.httpClient
      .get<T>(`/${this.APIUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByUrl(page: string, param: string | number): Observable<T> {
    return this.httpClient
      .get<T>(`/${this.APIUrl}/${page}/${param}`)
      .pipe(catchError(this.handleError));
  }

  add(resource: T): Observable<any> {
    return this.httpClient
      .post(`/${this.APIUrl}`, resource)
      .pipe(catchError(this.handleError));
  }

  addByURL(param: string, resource: T): Observable<any> {
    return this.httpClient
      .post(`/${this.APIUrl}/${param}`, resource)
      .pipe(catchError(this.handleError));
  }

  getByURL(param: string): Observable<any> {
    return this.httpClient
      .get(`/${this.APIUrl}/${param}`)
      .pipe(catchError(this.handleError));
  }

  delete(id: string | number): Observable<any> {
    return this.httpClient
      .delete(`/${this.APIUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  update(resource: T) {
    return this.httpClient
      .put(`/${this.APIUrl}`, resource)
      .pipe(catchError(this.handleError));
  }

  updateMany(resource: T[], path: string) {
    return this.httpClient
      .post(`/${this.APIUrl}/${path}`, resource)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    // Handle the HTTP error here
    return throwError(() => error);
  }
}
