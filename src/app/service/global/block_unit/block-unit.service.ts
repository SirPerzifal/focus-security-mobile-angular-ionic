import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from, mergeMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';
import { GetUserInfoService } from '../get-user-info/get-user-info.service';
import { FunctionMainService } from '../../function/function-main.service';

@Injectable({
  providedIn: 'root'
})
export class BlockUnitService extends ApiService {
  private apiBlock = this.baseUrl + '/residential/get/block';
  private apiUnit = this.baseUrl + '/residential/get/units';

  constructor(http: HttpClient, private getUserInfoService: GetUserInfoService,private functionMain: FunctionMainService) { 
    super(http);
  }

  async loadPreferences() {
    await this.getUserInfoService.getPreferenceStorage(
        'project_id',
    ).then((value) => {
      this.project_id = value.project_id != null ? value.project_id : 1;
      console.log(this.project_id)
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      console.log(value)
    })
  }
  
  project_id = 0

  getBlock(): Observable<any> {
    return from(this.loadProjectName()).pipe(
      mergeMap(() => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
    
        const body = {
          jsonrpc: '2.0',
          params: {
            project_id: this.project_id,
          }
        };
        console.log(body)
        // Change to send data in request body
        return this.http.post(`${this.apiBlock}`, body, { headers }).pipe(
          catchError(this.handleError)
        );
      })
    );
    
  }

  getUnit(block_id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const body = {
      jsonrpc: '2.0',
      params: {
        project_id: Number(this.project_id),
        block_id: Number(block_id),
      }
    };

    // Change to send data in request body
    return this.http.post(`${this.apiUnit}`, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  getBlockRegister(project_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    console.log();
    const body = {
      jsonrpc: '2.0',
      params: {
        project_id: project_id,
      }
    };
  
    // Change to send data in request body
    return this.http.post(`${this.apiBlock}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }

    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
