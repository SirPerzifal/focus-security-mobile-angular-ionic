import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class FacilityBookingsService extends ApiService { 
  private apiUrl = this.baseUrl + '/resident/get/facility_book';
  private urlDeleteBooking = this.baseUrl + '/resident/post/cancel_booking';
  private apiGetHistory = this.baseUrl + '/resident/get/booking_history';

  constructor(http: HttpClient) { 
    super(http);
  }

  getActiveFacilityBookingsServices(unit_id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        unit_id: Number(unit_id),
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.apiUrl}`, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  getHistoryBookingsServices(unit_id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        unit_id: Number(unit_id),
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.apiGetHistory}`, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteBooking(booking_id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        booking_id: Number(booking_id),
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.urlDeleteBooking}`, body, { headers: headers }).pipe(
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
