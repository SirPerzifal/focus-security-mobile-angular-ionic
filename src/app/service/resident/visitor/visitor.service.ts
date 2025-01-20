import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitorService extends ApiService{

  constructor(http: HttpClient) { super(http) }
  private inviteeFormList: any = [];

  getInviteeFormList(): any {
    return this.inviteeFormList;
  }

  addInvitees(invitees: any): void {
    invitees.forEach((invitee: any) => {
      const exists = this.inviteeFormList.some((existingInvitee: any) => 
        existingInvitee.visitor_name === invitee.visitor_name &&
        existingInvitee.contact_number === invitee.contact_number &&
        existingInvitee.vehicle_number === invitee.vehicle_number
      );
      if (!exists) {
        this.inviteeFormList.push(invitee);
      }
    });
  }

  clearInviteeFormList(): void {
    this.inviteeFormList = [];
  }
  postCreateExpectedVisitors(
    date_of_visit: Date, 
    entry_type: string, 
    entry_title: string,
    entry_message: string,
    is_provide_unit: boolean,
    invitees: Record<string, any>,
    hired_car: string,
    unit: Number,
  ): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const res = this.http.post<any>(
      `${this.baseUrl}/resident/post/create_expected_visitors`, 
      {
        jsonrpc: '2.0', 
        params: {
          date_of_visit,
          entry_type,
          entry_title,
          entry_message,
          is_provide_unit,
          invitees,
          hired_car,
          unit: 1, 
        }
      },
      {headers}
    );
    
    console.log(res)
    return res
  }

  getActiveInvites(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/get/active_invites`, {jsonrpc: '2.0', params: {unit_id: 1}})
  }

  postCancelVisitor(
    invite_id: number,
    entry_id: number
  ): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    console.log("entry_id:", entry_id)
    console.log("invite)id:", invite_id)

    const res = this.http.post<any>(
      `${this.baseUrl}/resident/post/cancel_invite`, 
      {
        jsonrpc: '2.0', 
        params: {
          entry_id: entry_id,
          visitor_id: invite_id
        }
      },
      {headers}
    );
    
    console.log(res)
    return res
  }
  getDistinctInviteHistory(unitId: number): Observable<any> {
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
    return this.http.post(`${this.baseUrl}/resident/get/distinct_visitor_history`, body, { headers }).pipe(
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
