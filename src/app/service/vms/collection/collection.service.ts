import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService extends ApiService{

  constructor(http: HttpClient) {
    super(http)
  }

  postAddColllection(visitor_name: string, contact_number: string, selection_type: string, vehicle_number: string, block: string, unit: string, project_id: number, camera_id: string): Observable<any> {
    
   const requestBody =  {
        jsonrpc: '2.0', 
        params: {
            name : visitor_name,
            vehicle_number : vehicle_number.length > 0 ? vehicle_number : '',
            contact_number,
            block_id : block,
            unit_id : unit,
            selection_type,
            project_id: project_id,
            camera_id: camera_id
        }
    }
    return this.http.post<any>(`${this.baseUrl}/vms/post/add_collection`, requestBody);
  }
}
