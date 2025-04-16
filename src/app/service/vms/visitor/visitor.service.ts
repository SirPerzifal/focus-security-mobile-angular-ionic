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

  postAddVisitor(visitor_name: string, visitor_contact_no: string, visitor_type: string, visitor_vehicle: string, block: string, unit: string, family_id: string,project_id:number, camera_id: string, is_pre_entry: boolean, entry_id: number, entry_type: string,host: string,purpose: string,identification_type: string, identification_number: string): Observable<any> {
    console.log({visitor_name, visitor_contact_no, visitor_type, visitor_vehicle, block, unit, family_id,project_id,camera_id,is_pre_entry, entry_id, entry_type, host, purpose, identification_type, identification_number})
    return this.http.post<any>(`${this.baseUrl}/vms/post/add_visitor`, {jsonrpc: '2.0', params: {visitor_name, visitor_contact_no, visitor_type, visitor_vehicle, block, unit, family_id,project_id,camera_id,is_pre_entry, entry_id, entry_type, host, purpose, identification_type, identification_number}});
  }
}
