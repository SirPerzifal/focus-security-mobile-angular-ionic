import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly baseUrl = 'https://ifs360-sg.com';
  // readonly baseUrl = 'https://backend-ifs360.sgeede.com';
  // readonly baseUrl = 'http://192.168.1.212:8069';
  // readonly baseUrl = 'http://192.168.1.217:8017';
  // readonly baseUrl = 'https://1c56-36-68-241-209.ngrok-free.app';

  constructor(protected http: HttpClient) { }
}
