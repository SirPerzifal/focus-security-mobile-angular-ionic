import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../api.service';

@Injectable({
  providedIn: 'root'
})
export class NewBookingService extends ApiService {
  private facilityRoomApi = this.baseUrl + '/resident/get/facilities';
  private facilityByIdApi = this.baseUrl + '/resident/get/facility_by_id';
  private roomByIdApi = this.baseUrl + '/resident/get/room_schedule';
  private createFaciityBook = this.baseUrl + '/resident/post/facility_book';

  constructor(http: HttpClient) { 
    super(http);
  }

  getFacilityServices(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Change to send data in request body
    return this.http.post(`${this.facilityRoomApi}`, {}, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  getFacilityById(facilityId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      jsonrpc: '2.0',
      params: {
        facility_id: Number(facilityId),
      }
    };

    return this.http.post(`${this.facilityByIdApi}`, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  getRoomById(roomId: number, date: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      jsonrpc: '2.0',
      params: {
        room_id: Number(roomId),
        booking_date: date
      }
    };

    return this.http.post(`${this.roomByIdApi}`, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  postFacilityBook(
    roomId: number,
    startTime: string,
    endTime: string,
    unitId: number,
    partnerId: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      jsonrpc: '2.0',
      params: {
        room_id: Number(roomId),
        start_time: startTime,
        end_time: endTime,
        unit_id: unitId,
        partner_id: partnerId
      }
    };

    return this.http.post(`${this.createFaciityBook}`, body, { headers: headers }).pipe(
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
