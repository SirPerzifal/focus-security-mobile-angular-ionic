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

  getMoveInOutSchedules(): Observable<any> {
    let apiUrl = this.baseUrl + '/vms/get/move_in_out_schedule'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log(this.http.post(apiUrl, {}, { headers }))

    return this.http.post(apiUrl, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getMoveInOutSchedulesHistory(): Observable<any> {
    let apiUrl = this.baseUrl + '/vms/get/move_in_out_schedule_history'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log(this.http.post(apiUrl, {}, { headers }))

    return this.http.post(apiUrl, {}, { headers }).pipe(
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
