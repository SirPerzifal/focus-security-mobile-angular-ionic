import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly baseUrl = 'https://ifs360-sg.com';
  // readonly baseUrl = 'https://testing-ifs360.sgdemo.org';
  // readonly baseUrl = 'http://192.168.1.217:8017';

  constructor(protected http: HttpClient) { }
}
