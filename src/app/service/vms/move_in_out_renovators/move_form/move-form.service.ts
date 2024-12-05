import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class MoveFormService extends ApiService {
  private apiUrl = this.baseUrl + '/vms/post/add_schedule';

  constructor(http: HttpClient) { super(http) }

  addSchedule(
    contractorName: string, 
    contractorContactNo: string, 
    companyName: string,
    identificationType: string, 
    identificationNumber: string,
    scheduleType: string,
    contractorVehicle: string,
    block: string, 
    unit: string,
    subContractors: any[]
  ): Observable<any> {
    const body = {
      jsonrpc: '2.0',
      params: {
        contractor_name: contractorName,
        contractor_contact_no: contractorContactNo,
        company_name: companyName,
        identification_type: identificationType,
        identification_number: identificationNumber,
        schedule_type: scheduleType,
        contractor_vehicle: contractorVehicle,
        block: block,
        unit: unit,
        sub_contractors: subContractors
      }
    };

    console.log("Request Body:", body);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Error handler
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