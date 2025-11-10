import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly baseUrl = 'https://ifs360-sg.com';
  // readonly baseUrl = 'https://backend-ifs360.sgeede.com';
  // readonly baseUrl = 'http://192.168.1.47:8017';
  // readonly baseUrl = 'http://localhost:8069';

  constructor(protected http: HttpClient) {}
}
