import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // readonly baseUrl = 'http://localhost:8069/';
  readonly baseUrl = 'https://backend-ifs360.sgeede.com';
  // protected readonly baseUrl = 'http://192.168.1.144:8069';
  // protected readonly baseUrl = 'https://backend-ifs360.sgeede.com';
  // readonly baseUrl = 'http://0.0.0.0:8017';
  // protected readonly baseUrl = 'http://127.17.0.1:8073';
  // protected readonly baseUrl = 'http://10.170.13.35:8017';

  constructor(protected http: HttpClient) {}
}
