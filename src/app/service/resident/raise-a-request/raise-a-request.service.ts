import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RaiseARequestService extends ApiService  {
  private apiUrl = this.baseUrl + '/resident/get/expected_visitor';
  private postApiUrl = this.baseUrl + '/resident/post/overnight_parking_application';

  constructor(http: HttpClient) { 
    super(http);
  }

  getExpectedVisitors(unitId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        unit_id: unitId,
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.apiUrl}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  postOvernightFormCar(
    blockId: number,
    unitId: number,
    contactNumber: number,
    applicantType: string,
    vehicleNumber: string | null,
    visitorId: number | null,
    purpose: string | null,
    rentalAggrement: string | null,
    familyId: number | null,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        block: blockId,
        unit: unitId,
        contact_number: contactNumber,
        applicant_type: applicantType,
        vehicle_number: vehicleNumber,
        visitor_id: visitorId,
        purpose: purpose,
        rental_agreement: rentalAggrement,
        family_id: familyId,
      },
    };
  
    return this.http.post(`${this.postApiUrl}`, body, { headers }).pipe(
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
