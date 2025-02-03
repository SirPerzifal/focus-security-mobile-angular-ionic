import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService{

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
  postLoginAuthenticate(
    login: string, 
    password: string, 
  ): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    console.log(login)
    console.log('loginloginloginloginlogin')
    console.log(password);
    console.log('passwordpasswordpasswordpassword');
    console.log(this.baseUrl)
    console.log('this.baseUrlthis.baseUrlthis.baseUrlthis.baseUrl')
    

    const res = this.http.post<any>(
      `${this.baseUrl}/resident/post/login`, 
      {
        jsonrpc: '2.0', 
        params: {
          login,
          password
        }
      },
      {headers}
    );
    
    console.log(res)
    return res
  }

  parseJWTParams(token:string){
    return jwtDecode(token) as {user_id:string, family_id:string, partner_id:string,name:string,email:string,exp:Number}
  }

  getActiveInvites(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/get/active_invites`, {jsonrpc: '2.0', params: {unit_id: 1}})
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
