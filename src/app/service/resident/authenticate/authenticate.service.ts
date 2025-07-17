import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService{

  constructor(http: HttpClient) { super(http) }

  postLoginAuthenticate(
    login: string, 
    password: string,
    fcmToken: string,
    device: string
  ): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });


    const res = this.http.post<any>(
      `${this.baseUrl}/post/login`, 
      {
        jsonrpc: '2.0', 
        params: {
          login,
          password,
          fcm_token: fcmToken,
          device: device
        }
      },
      {headers}
    );
    return res
  }

  parseJWTParams(token:string){
    return jwtDecode(token) as {mobile_number:string, family_id:string,name:string,email:string,exp:Number, image_profile: string}
  }

  parseJWTParamsVMS(token:string){
    return jwtDecode(token)
  }

  isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Check if token is expired
    } catch (error) {
      return false;
    }
  }

  getEstatesByEmail(email:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/get/estate`, {jsonrpc: '2.0', params: {email}})
  }

  changePassword(currentPassword: string, newPassword: string, userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          current_password: currentPassword,
          new_password: newPassword,
          family_id: userId,
        },
    };

    return this.http.post(this.baseUrl + '/resident/post/update_password', body, { headers }).pipe(
        catchError(this.handleError)
    );
  }

  logoutProcess(familyId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const body = {
        jsonrpc: '2.0',
        params: {
          family_id: familyId,
        },
    };

    return this.http.post(this.baseUrl + '/resident/post/logout', body, { headers }).pipe(
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

  async getToken(): Promise<string | null> {
    const residentValue = await Preferences.get({ key: 'USER_INFO' });
    console.log(residentValue.value, "the resident value");

    if (residentValue.value) {
      try {
        const decodedEstateString = decodeURIComponent(escape(atob(residentValue.value)));
        console.log('suk sini 1');
        const credential = JSON.parse(decodedEstateString);
        console.log(credential);
        return credential.access_token;
      } catch (error) {
        console.log('suk sini 2');
        console.error("Decoding or parsing failed:", error);
        return residentValue.value; // fallback: return the raw value
      }
    }

    return null;
  }

  jwtdecoded : any = {}

  refreshToken(): Observable<any> {
    console.log('Refreshing Token...')
    return this.http.post<any>(`${this.baseUrl}/focus/post/refresh`, {}).pipe(
      map((response) => {
        console.log(response)
        if (response.result?.access_token) {
          console.log('Acquired New Token', response.result.access_token)
          this.jwtdecoded = jwtDecode(response.result.access_token)
          // console.log(jwtDecode(response.result.access_token), "the decoded")
          if (this.jwtdecoded?.is_client){
            console.log("IM ON IS CLIENT")
            Preferences.set({
              key: 'USER_INFO',
              value: response.result?.access_token,
            });
          }
          else{
            console.log("IM ON IS RESIDENT")
            let EmailOrPhone = this.jwtdecoded?.email || this.jwtdecoded?.mobile_number
            const userCredentials = {
              emailOrPhone: EmailOrPhone,
              access_token: response.result?.access_token
            }
            console.log(userCredentials)
            Preferences.set({
              key: 'USER_INFO',
              value: btoa(unescape(encodeURIComponent(JSON.stringify(userCredentials)))),
            });
          }
          // Store the new token
          
          console.log("Returning the new Token")
          return response.result?.access_token;
        } else {
          throw new Error('Failed to refresh token');
        }
      })
    );
  }

}
