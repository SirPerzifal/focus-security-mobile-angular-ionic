import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class VmsServicePickUp extends ApiService{
  private apiUrl = this.baseUrl + '/vms/post/add_entry';

  constructor(http: HttpClient) {super(http)}

  addEntry(entryType: string, vehicleType: string, vehicleNumber: string, block: string, project_id: number, camera_id: string, host_id: string, identification_type: string, identification_number: string, pass_number: string): Observable<any> {
    const body = {
      jsonrpc: '2.0',
      params : {
        entry_type: entryType,
        vehicle_type: vehicleType,
        vehicle_number: vehicleNumber,
        block: block,
        project_id: project_id,
        camera_id: camera_id,
        host: host_id,
        identification_type: identification_type,
        identification_number: identification_number,
        pass_number: pass_number,
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