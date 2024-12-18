import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends ApiService{

  constructor(http: HttpClient) { 
    super(http) 
  }

  getHistoryList(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resident/get/visitor_history`, {jsonrpc: '2.0', params: {unit_id: 1}})
  }
}
