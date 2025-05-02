import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { catchError, Observable, throwError, from, mergeMap } from 'rxjs';
import { FunctionMainService } from '../function/function-main.service';

@Injectable({
  providedIn: 'root'
})
export class ClientMainService extends ApiService {

  constructor(http: HttpClient, private functionMain: FunctionMainService) { super(http) }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project = value
    })
  }

  project: any = []


  getApi(params: any, apiUrl: string): Observable<any> {
    return from(this.loadProjectName()).pipe(
      mergeMap(() => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + this.project.access_token
        });
        if ('project_id' in params) {
          console.log('project_id exists');
        } else {
          params['project_id'] = this.project.project_id
        }
        console.log(headers)
        console.log(params)
        return this.http.post(this.baseUrl + apiUrl, { jsonrpc: '2.0', params: params }, { headers }).pipe(
          catchError(this.handleError)
        );
      })
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
}
