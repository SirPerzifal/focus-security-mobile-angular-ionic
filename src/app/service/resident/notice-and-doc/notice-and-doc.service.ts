import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class NoticeAndDocService extends ApiService {

  constructor(http: HttpClient) { 
    super(http);
  }

  private focusResidentialApiGetNotices = this.baseUrl + '/residential/get/notice';
  private focusResidentialAPiPostNoticesSetPriority = this.baseUrl + '/residential/post/notice_set_priority';
  private focusResidentialAPiPostNoticesDeletePriority = this.baseUrl + '/residential/post/delete_notice_priority';

  focusResidentialGetNotices(
    unitId: number,
    blockId: number,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          unit_id: unitId,
          block_id: blockId
        },
    };

    return this.http.post(this.focusResidentialApiGetNotices, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  focusResidentialPostNoticesSetPriority(
    unitId: number,
    noticeId: number,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          unit_id: unitId,
          notice_id: noticeId,
        },
    };

    return this.http.post(this.focusResidentialAPiPostNoticesSetPriority, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  focusResidentialPostNoticesDeletePriority(
    unitId: number,
    noticeId: number,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          unit_id: unitId,
          notice_id: noticeId,
        },
    };

    return this.http.post(this.focusResidentialAPiPostNoticesDeletePriority, body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  private focusResidentialApiGetdocs = this.baseUrl + '/resident/get/docs';

  focusResidentialGetdocs(
    projectId: number,
    parentId?: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          project_id: projectId,
          parent_id: parentId,
        },
    };

    return this.http.post(this.focusResidentialApiGetdocs, body, { headers }).pipe(
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
