import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { App } from '@capacitor/app'

@Component({
  selector: 'app-maintenance-page',
  templateUrl: './maintenance-page.page.html',
  styleUrls: ['./maintenance-page.page.scss'],
})
export class MaintenancePagePage implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService, private webRtc: WebRtcService, private platform: Platform) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { data: any};
    console.log(state)
    if (state) {
      this.data = state
    }
  }

  data: any = false

  initializeBackButtonHandling() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
  }

  ngOnInit() {
    this.initializeBackButtonHandling()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  handleRefresh(event: any) {
    this.webRtc.checkServerMaintenance()
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

}
