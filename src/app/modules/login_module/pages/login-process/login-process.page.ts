import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login-process',
  templateUrl: './login-process.page.html',
  styleUrls: ['./login-process.page.scss'],
})
export class LoginProcessPage implements OnInit {

  constructor(    
    private platform: Platform,
  ) {}

  ionViewWillEnter() {
    this.initializeBackButtonHandling();
  }

  ngOnInit() {
  }

  initializeBackButtonHandling() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
      console.log("tres");
      
    });
  }
}
