import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class PollingService extends ApiService {

  constructor(http: HttpClient) { 
    super(http);
  }

  private apiGetPolling = this.baseUrl + '/resident/get/polling';
  private apiPostPolling = this.baseUrl + '/resident/post/vote_polling';

  getPolling(    
    familyId: number,
    projectId: number,
  ): Observable<any> {
    // console.log(typeof familyId, familyId, typeof projectId, projectId);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          family_id: familyId,
          project_id: projectId,
        },
    };

    return this.http.post(this.apiGetPolling, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  postPolling(    
    familyId: number,
    pollingOptionId: any[],
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          family_id: familyId,
          polling_option_ids: pollingOptionId,
        },
    };

    return this.http.post(this.apiPostPolling, body, { headers }).pipe(
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
