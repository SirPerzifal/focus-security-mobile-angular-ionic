import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  constructor(http: HttpClient) {
    super(http)
  }

  getMoveData(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/vms/get/move_in_out_schedule`, {});
  }
}
