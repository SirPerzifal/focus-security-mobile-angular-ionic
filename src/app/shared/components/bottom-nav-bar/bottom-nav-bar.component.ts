import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Platform } from '@ionic/angular';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { NavigationService } from 'src/app/service/global/navigation-service/navigation-service.service.spec';
import { App } from '@capacitor/app'

@Component({
  selector: 'app-bottom-nav-bar',
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.scss'],
})
export class BottomNavBarComponent implements OnInit {

  @Input() clientRoute: boolean = false

  constructor(
    private webRtcService: WebRtcService,
    private router: Router,
    private navigationService: NavigationService,
    public functionMain: FunctionMainService,
    private platform: Platform
  ) { }

  get activeButton() {
    return this.navigationService.getActiveButton();
  }

  is_client = false
  openModal = false
  
  routeTo() {
    this.navigationService.setActiveButton('home');
    let params = this.clientRoute ? {queryParams: {reload: true}} : {}
    this.router.navigate([this.clientRoute ? '/client-main-app' : '/resident-home-page'], params);
  }

  reportIssue() {
    this.navigationService.setActiveButton('report');
    this.router.navigate([this.clientRoute ? '/client-app-issues' : '/record-app-report']);
  }

  settings() {
    this.navigationService.setActiveButton('settings');
    this.router.navigate([this.clientRoute ? '/client-settings' : '/resident-settings-page']);
  }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value: any)=> {
      this.is_client = value.is_client
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const url = event['url'].split('?')[0];
        this.initializeBackButtonHandling(url === '/client-main-app')
        if (url !== '/resident-home-page' && url !== '/record-app-report' && url !== '/resident-settings-page') {
          this.navigationService.setActiveButton('');
        }
        if (url === '/resident-home-page' || url === '/client-main-app') {
          this.navigationService.setActiveButton('home');
        }
        if (url === '/record-app-report' || url === '/client-app-issues') {
          this.navigationService.setActiveButton('report');
        }
        if (url === '/resident-settings-page' || url === '/client-settings') {
          this.navigationService.setActiveButton('settings');
        }
      }
    });
  }

  initializeBackButtonHandling(is_home: boolean = false) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (is_home) {
        App.exitApp();
      } else {
        history.back();
      }
    });
  }

  callVms() {
    this.webRtcService.createOffer(false, '0812345678-Security', false, true);
  }
}