import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportIssueService extends ApiService {

  constructor(http: HttpClient) { 
    super(http);
  }

  postReportIssue(
    type_of_issue: number,
    requestor_id: number,
    summary: string,
    unit_id: number,
    blok_id: number
  ): Observable<any> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        type_of_issue: type_of_issue,
        requestor_id: requestor_id,
        summary: summary,
        unit_id: unit_id,
        block_id: blok_id
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.baseUrl}/resident/post/report_issue`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getReportCondoTypeOfIssue(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Change to send data in request body
    const body = {
      jsonrpc: '2.0',
      params: {
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.baseUrl}/resident/get/report_condo_type_of_issue`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getReportAppTypeOfIssues(project_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Change to send data in request body
    const body = {
      jsonrpc: '2.0',
      params: {
        project_id: project_id
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.baseUrl}/resident/get/report_app_type_of_issues`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllDataReportForUse(
    unitId: number,
    isReportApp?: string,
    isCondoApp?: string,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        unit_id: unitId,
        is_report_app: isReportApp ? parseInt(isReportApp) : null, // Ensure it's an integer or null
        is_report_condo: isCondoApp ? parseInt(isCondoApp) : null, // Ensure it's an integer or null
      }
    };
  
    return this.http.post(`${this.baseUrl}/resident/get/report_issue`, body, { headers }).pipe(
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
