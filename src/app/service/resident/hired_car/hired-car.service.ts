import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HiredCarService extends ApiService{

  constructor(http: HttpClient) { super(http) }

  postCreateExpectedVisitors(
    params: Record<string, any>
  ): Observable<any> {
    console.log(params)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    const res = this.http.post<any>(
      `${this.baseUrl}/resident/post/create_expected_entry`, 
      {
        jsonrpc: '2.0', 
        params: params
      },
      {headers}
    );
    
    console.log(res)
    return res
  }
}
