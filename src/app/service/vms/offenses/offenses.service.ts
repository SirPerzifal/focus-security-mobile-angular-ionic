import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError, from, mergeMap } from 'rxjs';
import { FunctionMainService } from '../../function/function-main.service';

@Injectable({
  providedIn: 'root'
})
export class OffensesService extends ApiService{

  constructor(http: HttpClient, private functionMain: FunctionMainService) { super(http) }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
    })
  }

  project_id = 0

  getOfffenses(type: string, is_active: boolean = true, id: number = 0): Observable<any> {
    return from(this.loadProjectName()).pipe(
      mergeMap(() => {
        let apiUrl = '/vms/get/offenses';
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
        console.log(this.project_id)
        let params: Record<string, any> = {alert_type: type, is_active: is_active, project_id: this.project_id};
        if (id !== 0) {
          params['id'] = id;
        }
        console.log(params);
  
        return this.http.post(this.baseUrl + apiUrl, { jsonrpc: '2.0', params }, { headers })
          .pipe(catchError(this.handleError));
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
