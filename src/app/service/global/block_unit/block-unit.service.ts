import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class BlockUnitService extends ApiService {
  private apiBlock = this.baseUrl + '/residential/get/block';
  private apiUnit = this.baseUrl + '/residential/get/units';

  constructor(http: HttpClient) { 
    super(http);
  }

  getBlock(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    // Change to send data in request body
    return this.http.post(`${this.apiBlock}`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getUnit(block_id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        block_id: Number(block_id),
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.apiUnit}`, body, { headers: headers }).pipe(
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