import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceProvidersService extends ApiService{

  constructor(http: HttpClient) { super(http) }
  private inviteeFormList: any = [];

  getServiceProviders(project_id:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/get/service/providers`, {jsonrpc: '2.0', params: {project_id}})
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
