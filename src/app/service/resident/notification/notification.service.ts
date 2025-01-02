import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ApiService {
  private apiUrl = this.baseUrl + '/resident/get/notifications';
  private regisNotification = this.baseUrl + '/app/add_device_token';

  constructor(http: HttpClient) { 
    super(http);
  }

  getNotifications(unitId: number, partnerId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        unit_id: unitId,
        partner_id: partnerId,
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.apiUrl}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  registerNotification(fcm_token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        fcm_token: fcm_token
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.regisNotification}`, body, { headers }).pipe(
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
