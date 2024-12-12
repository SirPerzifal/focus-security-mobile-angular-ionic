import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitorService extends ApiService{

  constructor(http: HttpClient) {
    super(http)
  }

  postAddVisitor(visitor_name: string, visitor_contact_no: string, visitor_type: string, visitor_vehicle: string, block: string, unit: string): Observable<any> {
    console.log("HEY THIS WORK HERE")
    console.log(visitor_name, visitor_contact_no, visitor_type, visitor_vehicle, block, unit)
    return this.http.post<any>(`${this.baseUrl}/vms/post/add_visitor`, {jsonrpc: '2.0', params: {visitor_name, visitor_contact_no, visitor_type, visitor_vehicle, block, unit}});
  }
}
