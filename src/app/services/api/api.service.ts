import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // protected readonly baseUrl = 'https://isanago.sgeede.com';
  protected readonly baseUrl = 'http://192.168.1.144:8069';

  constructor(protected http: HttpClient) {}
}
