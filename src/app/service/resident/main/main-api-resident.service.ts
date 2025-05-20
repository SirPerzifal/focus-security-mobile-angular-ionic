import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from, switchMap, mergeMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';
import { StorageService } from '../../storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { ModalController } from '@ionic/angular';
import { ModalLoadingComponent } from 'src/app/shared/components/modal-loading/modal-loading.component';

@Injectable({
  providedIn: 'root'
})
export class MainApiResidentService extends ApiService {

  hostId: number = 0;
  familyId: number = 0;
  unitId: number = 0;
  blockId: number = 0;
  projectId: number = 0;

  constructor(http: HttpClient, private storage: StorageService, private modalController: ModalController) { 
    super(http);
  }

  endpointMainProcess(params: any, apiUrl: string): Observable<any> {
    let modalRef: HTMLIonModalElement | null = null;
    let openLoading = false;
  
    // Check if API URL contains 'post' to determine whether to show loading modal
    const urlSegments = apiUrl.split('/');
    if (urlSegments.length > 0 && urlSegments.includes('post')) {
      openLoading = true;
    }
    
    // Mengkonversi Promise chain menjadi Observable
    return from(this.storage.getValueFromStorage('USESATE_DATA')).pipe(
      // Flatmap untuk menangani Promise berikutnya
      switchMap((value: any) => {
        if (!value) {
          // Menangani kasus jika value tidak ada
          return throwError(() => new Error('No estate data found'));
        }
  
        return from(this.storage.decodeData(value));
      }),
      switchMap((decodedValue: any) => {
        if (!decodedValue) {
          return throwError(() => new Error('Failed to decode estate data'));
        }
        
        const estate = JSON.parse(decodedValue) as Estate;
        
        // Set ID berdasarkan tipe estate
        if (estate.record_type === 'industrial') {
          this.hostId = estate.family_id;
          this.familyId = 0
          this.unitId = 0
          this.blockId = 0
        } else if (estate.record_type === 'resident') {
          this.familyId = estate.family_id;
          this.hostId = 0
        }
        
        // Set ID yang sama untuk kedua tipe
        this.unitId = estate.unit_id;
        this.blockId = estate.block_id;
        this.projectId = estate.project_id;
        
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
        
        // Body request berdasarkan ada/tidaknya data estate
        let body;
        console.log(estate.record_type, params);
        
        if (estate.record_type === 'industrial' || estate.record_type === 'resident') {
          body = {
            jsonrpc: '2.0',
            params: {
              host: this.hostId ? this.hostId : 0,
              family_id: this.familyId ? this.familyId : 0,
              unit_id: this.unitId ? this.unitId : 0,
              block_id: this.blockId ? this.blockId : 0,
              project_id: this.projectId ? this.projectId : 0,
              ...params
            }
          };
        } else {
          body = {
            jsonrpc: '2.0',
            params: params
          };
        }
        
        // Create and present loading modal if needed
        return from((async () => {
          if (openLoading) {
            modalRef = await this.modalController.create({
              component: ModalLoadingComponent,
              cssClass: 'modal-loading',
            });
            await modalRef.present();
          }
          
          // Mengirim HTTP request
          return this.http.post(this.baseUrl + '/resident/' + apiUrl, body, { headers });
        })());
      }),
      mergeMap(response$ => response$),
      tap(() => {
        // Dismiss modal after successful response
        if (modalRef) {
          modalRef.dismiss();
        }
      }),
      catchError((error) => {
        // Dismiss modal on error
        if (modalRef) {
          modalRef.dismiss();
        }
        return this.handleError(error);
      })
    );
  }

  endpointCustomProcess(params: any, apiUrl: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    // console.log(params)
    return this.http.post(this.baseUrl + apiUrl, {jsonrpc: '2.0', params: params}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  endpointProcess(params: any, apiUrl: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    // console.log(params)
    return this.http.post(this.baseUrl + '/resident/' + apiUrl, {jsonrpc: '2.0', params: params}, { headers }).pipe(
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
