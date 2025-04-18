import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';
import { StorageService } from '../../storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

@Injectable({
  providedIn: 'root'
})
export class MainApiResidentService extends ApiService {

  hostId: number = 0;
  familyId: number = 0;
  unitId: number = 0;
  blockId: number = 0;
  projectId: number = 0;

  constructor(http: HttpClient, private storage: StorageService) { 
    super(http);
  }

  endpointMainProcess(params: any, apiUrl: string): Observable<any> {
    // Mengkonversi Promise chain menjadi Observable
    return from(this.storage.getValueFromStorage('USESATE_DATA')).pipe(
      // Flatmap untuk menangani Promise berikutnya
      switchMap((value: any) => {
        if (!value) {
          // Menangani kasus jika value tidak ada
          return throwError(() => new Error('No estate data found'));
        }

        return from(this.storage.decodeData(value));
      }),
      switchMap((decodedValue: any) => {
        if (!decodedValue) {
          return throwError(() => new Error('Failed to decode estate data'));
        }
        
        const estate = JSON.parse(decodedValue) as Estate;
        
        // Set ID berdasarkan tipe estate
        if (estate.record_type === 'commercial') {
          this.hostId = estate.family_id;
          this.familyId = 0
          this.unitId = 0
          this.blockId = 0
        } else if (estate.record_type === 'resident') {
          this.familyId = estate.family_id;
          this.hostId = 0
        }
        
        // Set ID yang sama untuk kedua tipe
        this.unitId = estate.unit_id;
        this.blockId = estate.block_id;
        this.projectId = estate.project_id;
        
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
        
        // Body request berdasarkan ada/tidaknya data estate
        let body;
        if (estate.record_type === 'commercial' || estate.record_type === 'resident') {
          body = {
            jsonrpc: '2.0',
            params: {
              host: this.hostId,
              family_id: this.familyId,
              unit_id: this.unitId,
              block_id: this.blockId,
              project_id: this.projectId,
              ...params
            }
          };
        } else {
          body = {
            jsonrpc: '2.0',
            params: params
          };
        }
        
        // Mengirim HTTP request
        return this.http.post(this.baseUrl + '/resident/' + apiUrl, body, { headers });
      }),
      catchError(this.handleError)
    );
  }

  endpointCustomProcess(params: any, apiUrl: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    // console.log(params)
    return this.http.post(this.baseUrl + apiUrl, {jsonrpc: '2.0', params: params}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  endpointProcess(params: any, apiUrl: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    // console.log(params)
    return this.http.post(this.baseUrl + '/resident/' + apiUrl, {jsonrpc: '2.0', params: params}, { headers }).pipe(
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
