import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmergencyVehicleService extends ApiService{

  constructor(http: HttpClient) {
    super(http)
  }

  postAddEmergencyVehicle(officer_name: string, contact_number: string, station_devision: string, vehicle_number: string, block: string, unit: string,vehicle_type:string): Observable<any> {
    
   const requestBody =  {
        jsonrpc: '2.0', 
        params: {
            officer_name,
            vehicle_number : vehicle_number.length > 0 ? vehicle_number : '',
            contact_number,
            block_id : block,
            unit_id : unit,
            station_devision,
            vehicle_type
        }
    }
    return this.http.post<any>(`${this.baseUrl}/vms/post/emergency_vehicle`, requestBody);
  }
}
