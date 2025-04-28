import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

@Injectable({
  providedIn: 'root'
})
export class NewBookingService extends ApiService {
  private facilityRoomApi = this.baseUrl + '/resident/get/facilities';
  private facilityByIdApi = this.baseUrl + '/resident/get/facility_by_id';
  private roomByIdApi = this.baseUrl + '/resident/get/room_schedule';
  private createFaciityBook = this.baseUrl + '/resident/post/facility_book';

  constructor(http: HttpClient, private storage: StorageService) {
    super(http);
  }

  hostId: number = 0;
  familyId: number = 0;
  unitId: number = 0;
  blockId: number = 0;
  projectId: number = 0;

  getFacilityServices(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Change to send data in request body
    return this.http.post(`${this.facilityRoomApi}`, {}, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  getFacilityById(facilityId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      jsonrpc: '2.0',
      params: {
        facility_id: Number(facilityId),
      }
    };

    return this.http.post(`${this.facilityByIdApi}`, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  getRoomById(roomId: number, date: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      jsonrpc: '2.0',
      params: {
        room_id: Number(roomId),
        booking_date: date
      }
    };

    return this.http.post(`${this.roomByIdApi}`, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  postFacilityBook(
    roomId: number,
    startTime: string,
    endTime: string,
    unitId: number,
    partnerId: number
  ): Observable<any> {
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

        const body = {
          jsonrpc: '2.0',
          params: {
            room_id: Number(roomId),
            start_time: startTime,
            end_time: endTime,
            unit_id: unitId,
            partner_id: partnerId,
            host: this.hostId,
            project_id: this.projectId
          }
        };

        return this.http.post(`${this.createFaciityBook}`, body, { headers: headers })
      }),
      catchError(this.handleError)
    )
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
