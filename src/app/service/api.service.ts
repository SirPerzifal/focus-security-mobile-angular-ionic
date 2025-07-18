import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // readonly baseUrl = 'http://localhost:8069'
  // readonly baseUrl = 'https://backend-ifs360.sgeede.com';
  // readonly baseUrl = 'http://192.168.1.145:8069';
  // readonly baseUrl = 'http://0.0.0.0:8017';
  // protected readonly baseUrl = 'http://127.17.0.1:8073';
  // readonly baseUrl = 'http://192.168.90.230:8017';
  readonly baseUrl = 'http://192.168.1.68:8017';
  // readonly baseUrl = 'http://192.168.1.164:8069';
  // readonly baseUrl = 'http://192.168.1.123:8069'
  // readonly urlItercom = 'http://172.20.10.3:8069';

  constructor(protected http: HttpClient) {}
}
