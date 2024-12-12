import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitorService extends ApiService{

  constructor(http: HttpClient) { super(http) }

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
          unit, 
        }
      },
      {headers}
    );
    
    console.log(res)
    return res
  }

  getActiveInvites(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/get/active_invites`, {jsonrpc: '2.0', params: {unit_id: 0}})
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
}
