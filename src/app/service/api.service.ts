import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // protected readonly baseUrl = 'https://isanago.sgeede.com';
  protected readonly baseUrl = 'http://0.0.0.0:8017';

  constructor(protected http: HttpClient) {}
}
