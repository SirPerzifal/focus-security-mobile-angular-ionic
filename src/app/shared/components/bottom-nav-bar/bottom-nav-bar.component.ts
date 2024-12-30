import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/service/global/navigation-service/navigation-service.service.spec';

@Component({
  selector: 'app-bottom-nav-bar',
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.scss'],
})
export class BottomNavBarComponent  implements OnInit {

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) { }

  get activeButton() {
    return this.navigationService.getActiveButton();
  }

  routeTo() {
    this.navigationService.setActiveButton('resident-homepage');
    this.router.navigate(['/resident-homepage']);

  }

  reportIssue() {
    this.navigationService.setActiveButton('home');
    this.router.navigate(['/record-app-report']);
    // Lakukan navigasi ke halaman report issue
  }

  settings() {
    this.navigationService.setActiveButton('home');
    this.router.navigate(['/resident-settings-page']);
    // Lakukan navigasi ke halaman settings
  }

  ngOnInit() {}

}
