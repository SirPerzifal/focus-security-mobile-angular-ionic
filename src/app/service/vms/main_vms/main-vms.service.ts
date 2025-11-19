import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError, from, mergeMap, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainVmsService extends ApiService{

  constructor(http: HttpClient) { super(http) }

  project_id = 0

  getApi(params: any, apiUrl: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    if ('project_id' in params) {
      console.log('project_id exists');
    } else {
      params['project_id'] = this.project_id
    }
    console.log(params)
    return this.http.post(this.baseUrl + apiUrl, { jsonrpc: '2.0', params: params }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }

    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  configUpdated$ = new Subject<void>();
}
