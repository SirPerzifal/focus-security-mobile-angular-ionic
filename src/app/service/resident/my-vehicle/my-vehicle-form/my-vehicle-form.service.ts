import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../api.service';

@Injectable({
  providedIn: 'root'
})
export class MyVehicleFormService extends ApiService{
  private apiUrl = this.baseUrl + '/resident/get/get_car_make_and_type';
  private apiGetFamiilyUrl = this.baseUrl + '/residential/get/family_member_data';

  constructor(http: HttpClient) { 
    super(http);
  }

  getVehicleMakeAndType(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    // Change to send data in request body
    return this.http.post(`${this.apiUrl}`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getFamily(unitId: number): Observable<any> {
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
    return this.http.post(`${this.apiGetFamiilyUrl}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getNotificationAlertSettings(familyId:number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        family_id: familyId,
      }
    };

    // Change to send data in request body
    return this.http.post(`/get/notification/alert/settings`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  postNotificationAlertSettings(familyId:number, walkVisitorAlert:boolean,driveVisitorAlert:boolean): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        family_id: familyId,
        is_active_walk_visitor_alert: walkVisitorAlert,
        is_active_drive_visitor_alert: driveVisitorAlert
      }
    };

    // Change to send data in request body
    return this.http.post(`/post/notification/alert/settings`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  postVehicle(
    vehicleNumber: string, 
    iuNumber: string, 
    typeOfApplication: string, 
    vehicleType: string, 
    vehicleMake: string, 
    vehicleColour: string,
    blockId: string,
    familyMember: string,
    unitID: string,
    vehicleLog: string, 
    endDateForTemporaryPass: string | null,
    states: string,
    temporaryCarRequest: string | null,
    isFirstVehicle: string, // Pastikan ini adalah parameter wajib
    projectId: number,
    vehicleLogFilename?: string, // Ini adalah parameter opsional
): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });
    
    const body = {
        jsonrpc: '2.0',
        params: {
            vehicle_number: vehicleNumber,
            IU_number: iuNumber,
            type_of_application: typeOfApplication,
            vehicle_type: vehicleType,
            vehicle_make: vehicleMake,
            vehicle_color: vehicleColour,
            unit_id: unitID,
            block_id: blockId,
            family_id: familyMember,
            vehicle_log_filename: vehicleLogFilename,
            vehicle_log: vehicleLog,
            is_first_vehicle: isFirstVehicle,
            project_id: projectId,
            states: states,
            end_date_for_temporary_pass: typeOfApplication === 'temporary_vehicle' ? endDateForTemporaryPass : null,
            temporary_car_request: typeOfApplication === 'temporary_vehicle' ? temporaryCarRequest : null
        }
    };

    return this.http.post(`${this.baseUrl}/resident/post/post_vehicle`, body, { headers: headers }).pipe(
        catchError(this.handleError));
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
