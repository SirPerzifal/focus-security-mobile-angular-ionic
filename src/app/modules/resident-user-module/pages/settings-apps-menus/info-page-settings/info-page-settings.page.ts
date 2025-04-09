import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-page-settings',
  templateUrl: './info-page-settings.page.html',
  styleUrls: ['./info-page-settings.page.scss'],
})
export class InfoPageSettingsPage implements OnInit {

  pageName: string = '';

  constructor(
    private route: Router
  ) {
    const navigation = this.route.getCurrentNavigation();
    const state = navigation?.extras.state as { pageName: string };
    if (state) {
      this.pageName = state.pageName;
    }
  }

  ngOnInit() {
  }

}
