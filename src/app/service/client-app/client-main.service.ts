import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { catchError, Observable, throwError, from, mergeMap, tap, timeout, TimeoutError, finalize } from 'rxjs';
import { FunctionMainService } from '../function/function-main.service';
import { ModalController } from '@ionic/angular';
import { ModalLoadingComponent } from 'src/app/shared/components/modal-loading/modal-loading.component';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientMainService extends ApiService {

  constructor(http: HttpClient, private functionMain: FunctionMainService, private modalController: ModalController, private storage: StorageService) { super(http) }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then(async (value) => {
      this.project = value
      await this.storage.getValueFromStorage('RGG_CALL_DATA').then((value) => {
        if (value) {
          this.rggData = value
        } else {
          this.rggData = false
        }
      })
    })
  }

  project: any = []
  rggData: any = false


  getApi(params: any, apiUrl: string): Observable<any> {
    let modalRef: HTMLIonModalElement | null = null;
    let openLoading = false;


    return from(this.loadProjectName()).pipe(
      mergeMap(async () => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': 'Bearer ' + this.project.access_token
        });
  
        if (!params.project_id) {
          params.project_id = this.project.project_id;
        }

        if (!params.family_id) {
          params.family_id = this.project.family_id;
        }

        if (this.rggData) {
          params.rgg_unique_user_id = this.rggData.user_id
          params.rgg_unique_call_id = this.rggData.call_id
        }
  
        const urlSegments = apiUrl.split('/');
        if (urlSegments.length > 2 && urlSegments[2] === 'post') {
          openLoading = true;
        }
  
        if (openLoading) {
          modalRef = await this.modalController.create({
            component: ModalLoadingComponent,
            cssClass: 'modal-loading',
          });
          await modalRef.present();
        }
        
        return this.http.post(this.baseUrl + apiUrl, {
          jsonrpc: '2.0',
          params: params,
        }, { headers });
      }),
      mergeMap(response$ => response$.pipe(
        
      )),
      tap(() => {
        if (modalRef) {
          modalRef.dismiss();
        }
      }),
      finalize(() => {
        if (modalRef) {
          modalRef.dismiss();
        }
      }),
      catchError(error => {
        console.log(error)
        if (error instanceof TimeoutError) {
          this.functionMain.presentToast('Request timed out. Please try again.', 'danger')
          return throwError(() => new Error('Request timed out. Please try again.'));
        }
        
        if (modalRef) {
          modalRef.dismiss();
        }

  
        return this.handleError(error); // Ensure handleError returns `Observable.throwError(...)`
      })
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
