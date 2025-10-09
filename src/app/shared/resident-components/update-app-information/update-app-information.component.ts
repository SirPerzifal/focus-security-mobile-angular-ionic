import { Component, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-update-app-information',
  templateUrl: './update-app-information.component.html',
  styleUrls: ['./update-app-information.component.scss'],
})
export class UpdateAppInformationComponent {
  @Input() newVersion: string = '';
  @Input() updateDate: string = '';

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  async updateNow() {
    // Redirect ke store
    // Android: package name, iOS: app id
    let storeUrl = '';

    console.log('Platform is', this.platform.platforms());
    
    
    if (this.platform.is('android')) {
      // Ganti dengan package name Android kamu
      storeUrl = 'https://play.google.com/store/apps/details?id=com.sgeede.focus.security';
    } else if (this.platform.is('ios')) {
      // Ganti dengan App ID iOS kamu
      storeUrl = 'https://apps.apple.com/us/app/ifs360/id6746474771';
    }
    
    if (storeUrl) {
      await Browser.open({ url: storeUrl });
      // Tutup modal setelah buka store
      this.modalController.dismiss();
    }
  }

  remindLater() {
    this.modalController.dismiss();
  }

  dontShowToday() {
    // Simpan flag di localStorage
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    localStorage.setItem('skipUpdateNotificationUntil', tomorrow.getTime().toString());
    this.modalController.dismiss();
  }
}