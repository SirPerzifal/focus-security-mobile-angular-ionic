import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Platform } from '@ionic/angular';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { NavigationService } from 'src/app/service/global/navigation-service/navigation-service.service.spec';
import { App } from '@capacitor/app'
import NavigationType from 'src/app/plugins/navigation-type.plugin';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-bottom-nav-bar',
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.scss'],
})
export class BottomNavBarComponent implements OnInit {

  @Input() clientRoute: boolean = false
  navigationMode: 'gesture' | 'button' | 'unknown' = 'unknown';
  private navigationListener?: PluginListenerHandle;

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

  async ngOnInit() {
    if (this.platform.is('android')) {
      // 1. Get current navigation type
      await this.checkNavigationType();
      
      // 2. Listen for changes
      await this.listenNavigationChanges();
    }
    this.functionMain.vmsPreferences().then((value: any)=> {
      // console.log(value)
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

  async checkNavigationType() {
    try {
      const result = await NavigationType.getNavigationType();
      
      console.log('Navigation Type:', result.type);
      console.log('Height (dp):', result.heightDp);
      console.log('Height (px):', result.heightPx);
      
      // Adjust UI based on type
      this.adjustUIForNavigationType(result.type);
    } catch (error) {
      console.error('Error detecting navigation type:', error);
    }
  }

  async listenNavigationChanges() {
    try {
      // Start listening
      await NavigationType.startListening();
      
      // Add listener untuk perubahan
      this.navigationListener = await NavigationType.addListener(
        'navigationTypeChanged',
        (data) => {
          console.log('Navigation type changed to:', data.type);
          this.adjustUIForNavigationType(data.type);
        }
      );
      
      console.log('👂 Listening for navigation type changes...');
    } catch (error) {
      console.error('Error setting up listener:', error);
    }
  }

  adjustUIForNavigationType(type: string) {
    if (type === 'gesture') {
      console.log('User pakai GESTURE navigation');
      // Adjust bottom padding, margin, etc
      // this.bottomPadding = '20px';
      this.navigationMode = type;
    } else if (type === 'button') {
      this.navigationMode = type;
      console.log('User pakai BUTTON navigation (3 buttons)');
      // Adjust untuk button navigation
      // this.bottomPadding = '0px';
    }
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

  ngOnDestroy() {
    // Cleanup listener
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
  }

  callVms() {
    this.functionMain.vmsPreferences().then((value: any)=> {
      const project_id = 'Project-' + value.project_id.toString();
      // const project_id = 'Intercom-3'
      this.webRtcService.createOffer(false, project_id, false, true);
    })
  }
}