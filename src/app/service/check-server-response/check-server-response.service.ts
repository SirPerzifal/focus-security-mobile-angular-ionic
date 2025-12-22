import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { WebRtcService } from '../fs-web-rtc/web-rtc.service';

@Injectable({
  providedIn: 'root'
})
export class CheckServerResponseService extends ApiService{

  constructor(http: HttpClient, private webRtc: WebRtcService) {
    super(http);
  }

  private checkInterval: Subscription | null = null;
  private checkIntervalMinutes = 2;

  startPeriodicCheck() {
    this.webRtc.initializeMaintenanceSocket()
    if (this.checkInterval) {
      return;
    }

    setTimeout(() => {
      this.ping();
    }, 5000);

    this.checkInterval = interval(this.checkIntervalMinutes * 60 * 1000).subscribe(() => {
      this.ping();
    });
  }

  stopPeriodicCheck() {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
      this.checkInterval = null;
    }
  }
    
  async ping() {
    this.webRtc.checkServerMaintenance()
  }
}