import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VmsServicePickUp {
  private apiUrl = 'http://192.168.1.144:8069/vms/post/add_entry'; // Ganti dengan URL server Odoo Anda

  constructor(private http: HttpClient) {}

  addEntry(entryType: string, vehicleType: string, vehicleNumber: string, block: string): Observable<any> {
    const body = {
      entry_type: entryType,
      vehicle_type: vehicleType,
      vehicle_number: vehicleNumber,
      block: block
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, body, { headers });
  }
}