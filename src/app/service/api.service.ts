import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // readonly baseUrl = 'https://ifs360-sg.com';
  // readonly baseUrl = 'https://backend-ifs360.sgeede.com';
  readonly baseUrl = 'http://10.170.6.223:8017';
  // readonly baseUrl = 'http://localhost:8069';

  constructor(protected http: HttpClient) {}
}
