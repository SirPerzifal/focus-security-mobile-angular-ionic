import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import NavigationType from 'src/app/plugins/navigation-type.plugin';
import { PluginListenerHandle } from '@capacitor/core';

import { NavigationService } from 'src/app/service/global/navigation-service/navigation-service.service.spec';

@Component({
  selector: 'app-botton-nav-bar',
  templateUrl: './botton-nav-bar.component.html',
  styleUrls: ['./botton-nav-bar.component.scss'],
})
export class BottonNavBarComponent implements OnInit {

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private platform: Platform,
  ) { }

  navigationMode: 'gesture' | 'button' | 'unknown' = 'unknown';
  private navigationListener?: PluginListenerHandle;

  get activeButton() {
    return this.navigationService.getActiveButton();
  }

  routeTo() {
    this.navigationService.setActiveButton('home');
    this.router.navigate(['/resident-home-page']);
  }

  reportIssue() {
    this.navigationService.setActiveButton('report');
    this.router.navigate(['/app-report-main'], {
      state: {
        fromWhere: 'app-report',
      }
    });
  }

  settings() {
    this.navigationService.setActiveButton('settings');
    this.router.navigate(['/settings-main']);
  }

  ionViewWillEnter() {
    console.log("tes");
    
    this.initializeBackButtonHandling();
  }

  async ngOnInit() {
    if (this.platform.is('android')) {
      // 1. Get current navigation type
      await this.checkNavigationType();
      
      // 2. Listen for changes
      await this.listenNavigationChanges();
    } else {
      this.adjustUIForNavigationType('gesture')
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const url = event['url'].split('?')[0];
        if (url !== '/resident-home-page' && url !== '/app-report-main' && url !== '/settings-main') {
          this.navigationService.setActiveButton('');
        }
        if (url === '/resident-home-page') {
          this.navigationService.setActiveButton('home');
        }
        if (url === '/app-report-main') {
          this.navigationService.setActiveButton('report');
        }
        if (url === '/settings-main') {
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

  initializeBackButtonHandling() {
    console.log("tes");
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log("tes");
      this.router.events.subscribe(event => {
        console.log("tes");
        if (event instanceof NavigationStart) {
          const url = event['url'].split('?')[0];
          console.log("tes", url);
          if (url === '/resident-home-page') {
            console.log("tes");
            
            App.exitApp();
          } else if (url !== '/resident-home-page') {
            console.log("tes");
            
            history.back()
          } else {
            console.log("tes");
            
            this.router.navigate(['resident-home-page']);
          }
        }
      });
    });
  }
}
