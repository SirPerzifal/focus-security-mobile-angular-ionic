import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { NavigationService } from 'src/app/service/global/navigation-service/navigation-service.service.spec';

@Component({
  selector: 'app-bottom-nav-bar',
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.scss'],
})
export class BottomNavBarComponent implements OnInit {

  @Input() clientRoute: boolean = false

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    public functionMain: FunctionMainService,
  ) { }

  get activeButton() {
    return this.navigationService.getActiveButton();
  }

  is_client = false
  openModal = false
  
  routeTo() {
    this.navigationService.setActiveButton('home');
    this.router.navigate([this.clientRoute ? '/client-main-app' : '/resident-homepage']);
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
        if (url !== '/resident-homepage' && url !== '/record-app-report' && url !== '/resident-settings-page') {
          this.navigationService.setActiveButton('');
        }
        if (url === '/resident-homepage' || url === '/client-main-app') {
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

  callVms() {
    console.log("CALL VMS")
  }
}