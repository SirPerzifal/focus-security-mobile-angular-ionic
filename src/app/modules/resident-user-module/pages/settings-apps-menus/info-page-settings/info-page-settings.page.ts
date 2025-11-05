import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { catchError, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-info-page-settings',
  templateUrl: './info-page-settings.page.html',
  styleUrls: ['./info-page-settings.page.scss'],
})
export class InfoPageSettingsPage extends ApiService implements OnInit {

  pageName: string = '';
  currentversion: string = '';
  lastUpdatedDate: string = '';

  constructor(
    http: HttpClient, 
    private route: Router,
  ) {
    super(http)
    const navigation = this.route.getCurrentNavigation();
    const state = navigation?.extras.state as { pageName: string };
    if (state) {
      this.pageName = state.pageName;
    }
    this.getVersion();
  }

  ngOnInit() {
  }

  async getVersion() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const response: any = await this.http.post(this.baseUrl + '/get/app_detail', {jsonrpc: '2.0', params: {}}, { headers }).pipe(
      catchError(this.handleError)
    ).toPromise();
      const result = response.result;
      const [date, time] = response.result.when_the_app_get_update.split(' ')
      const [year, month, day] = date.split('-')

      this.lastUpdatedDate = `${day}-${month}-${year}` // Output: 09-10-2025
      console.log(this.lastUpdatedDate);  
    
    const appInfo = await App.getInfo();
    const currentVersion = appInfo.version;
    this.currentversion = currentVersion;
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
