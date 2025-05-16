import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

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

  ngOnInit() {
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
