import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { NavigationService } from 'src/app/service/global/navigation-service/navigation-service.service.spec';

@Component({
  selector: 'app-botton-nav-bar',
  templateUrl: './botton-nav-bar.component.html',
  styleUrls: ['./botton-nav-bar.component.scss'],
})
export class BottonNavBarComponent implements OnInit {

  constructor(
    private router: Router,
    private navigationService: NavigationService
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
    this.router.navigate(['/app-report-main']);
  }

  settings() {
    this.navigationService.setActiveButton('settings');
    this.router.navigate(['/settings-main']);
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
}
