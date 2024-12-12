import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyService extends ApiService{

  constructor(http: HttpClient) { super(http) }

  getFamilyList(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/get/get_family`, {jsonrpc: '2.0', params: {unit_id: 1}})
  }

  postFamilyDetail(
    full_name: string,
    nickname: string,
    email_address: string,
    mobile_number: string,
    type_of_residence: string,
    tenancies: Record<string, any>
  ): Observable<any> {
    
    return this.http.post<any>(`${this.baseUrl}/resident/post/post_family_detail`, {jsonrpc: '2.0', params: {
      full_name,
      nickname,
      email_address,
      mobile_number,
      type_of_residence,
      tenancies
    }})
  }

  updateFamilyDetail(
    unit_id: number,
    full_name: string,
    nickname: string,
    email_address: string,
    mobile_number: string,
    type_of_residence: string,
    tenancies: Record<string, any>
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/post/update_family`, {jsonrpc: '2.0', params: {
      unit_id,
      full_name,
      nickname,
      email_address,
      mobile_number,
      type_of_residence,
      tenancies
    }})
  }

  deleteFamilyList(unit_id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/post/delete_family`, {jsonrpc: '2.0', params: {unit_id}})
  }

  testFamilyList(tenancies: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'multipart/form-data',
    });
    console.log(tenancies)
    return this.http.post<any>(`${this.baseUrl}/resident/post/test_family_detail`, tenancies, {headers})
  }
  
}
