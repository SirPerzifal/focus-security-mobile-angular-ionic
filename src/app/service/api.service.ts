import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
<<<<<<< HEAD
  readonly baseUrl = 'http://localhost:8069'
=======
  // readonly baseUrl = 'http://localhost:8069'
<<<<<<< HEAD
>>>>>>> 7a6cbb9dae3c0f7a7d17df9fdecfc89b98496d2e
  // readonly baseUrl = 'https://backend-ifs360.sgeede.com';
=======
  readonly baseUrl = 'https://backend-ifs360.sgeede.com';
>>>>>>> 64e00190e314ed35ecbb44e7654466a7f2b19196
  // protected readonly baseUrl = 'http://192.168.1.144:8069';
  // protected readonly baseUrl = 'https://backend-ifs360.sgeede.com';
  // readonly baseUrl = 'http://0.0.0.0:8017';
  // protected readonly baseUrl = 'http://127.17.0.1:8073';
  // readonly baseUrl = 'http://192.168.1.86:8017';
  // readonly baseUrl = 'http://192.168.59.230:8017';

  constructor(protected http: HttpClient) {}
}
