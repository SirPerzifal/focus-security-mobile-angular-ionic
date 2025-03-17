import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class MoveInOutService extends ApiService{
  

  constructor(http: HttpClient) {super(http)}

  getMoveInOutSchedules(project_id: number): Observable<any> {
    let apiUrl = this.baseUrl + '/vms/get/move_in_out_schedule'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      jsonrpc: '2.0',
      params: {
        project_id: project_id
      }
    }

    console.log(apiUrl, body, { headers })

    return this.http.post(apiUrl, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getMoveInOutSchedulesHistory(project_id: number): Observable<any> {
    let apiUrl = this.baseUrl + '/vms/get/move_in_out_schedule_history'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      jsonrpc: '2.0',
      params: {
        project_id: project_id
      }
    }

    console.log(this.http.post(apiUrl, body, { headers }))

    return this.http.post(apiUrl, body, { headers }).pipe(
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
}
