import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodPlatformService extends ApiService{

  constructor(http: HttpClient) {
    super(http)
  }

  getFoodPlatForm(project_id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/vms/get/food_platform`, {jsonrpc: '2.0', params: {project_id: project_id}});
  }

  getPackagePlatForm(project_id: number): Observable<any> {
    console.log("HEY THIS WORK HERE")
    return this.http.post<any>(`${this.baseUrl}/vms/get/package_express`, {jsonrpc: '2.0', params: {project_id: project_id}});
  }

  pastAddDeliveries(contact_number: string, vehicle_number: string, delivery_type : string, food_delivery : Record<string, any>, package_delivery : Record<string, any>, block: string, unit: string, multiple_unit: Record<string, any>, project_id: number, camera_id: string, host: string, identification_type: string, identification_number: string): Observable<any> {
    console.log(contact_number, vehicle_number, delivery_type , food_delivery , package_delivery , block, unit, multiple_unit, host, identification_type, identification_number)
    return this.http.post<any>(`${this.baseUrl}/vms/post/add_deliveries`, {
      jsonrpc: '2.0', 
      params: {
        contact_number, vehicle_number, delivery_type, food_delivery, package_delivery, block, unit, multiple_unit,project_id,camera_id,host,identification_type,identification_number
      }});
  }
}

