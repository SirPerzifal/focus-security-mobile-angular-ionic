import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class ContractorsService extends ApiService {
  private apiUrl = this.baseUrl + '/vms/post/add_contractors'

  constructor(http: HttpClient) {super(http)}

  addContractor(contractorName: string, 
    contractorContactNo: string, 
    companyName: string, 
    identificationType: string, 
    identificationNumber: string, 
    contractorVehicle: string, 
    block: string, 
    unit: string, 
    remarks: string,
    subContractors: any[],
    project_id: number,
    camera_id: string,
    host: string,
    total_package: any,
    expired_date: any,
    purpose: any,
    gate_pass: any,
    pass_number: any,
    is_pre_entry: boolean,
    entry_id: any,
    entry_type: any,
  ): Observable<any> {
    const body = {
      jsonrpc: '2.0',
      params : {
        contractor_name: contractorName,
        contractor_contact_no: contractorContactNo,
        company_name: companyName,
        identification_type: identificationType,
        identification_number: identificationNumber,
        contractor_vehicle: contractorVehicle,
        block: block,
        unit: unit,
        remarks: remarks,
        sub_contractors: subContractors,
        project_id: project_id,
        camera_id: camera_id,
        host: host,
        total_package: total_package,
        expired_date: expired_date,
        purpose: purpose,
        gate_pass: gate_pass,
        pass_number: pass_number,
        is_pre_entry: is_pre_entry,
        entry_id: entry_id,
        entry_type: entry_type,
      }
    };

    console.log("body", body)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Tambahkan error handler
  private handleError(error: any) {
    console.error('An error occurred:', error);
    
    // Log detail error
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }

    // Kembalikan error yang dapat di-subscribe
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
