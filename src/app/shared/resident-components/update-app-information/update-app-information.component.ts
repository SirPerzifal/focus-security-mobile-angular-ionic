import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { Preferences } from '@capacitor/preferences';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-update-app-information',
  templateUrl: './update-app-information.component.html',
  styleUrls: ['./update-app-information.component.scss'],
})
export class UpdateAppInformationComponent implements OnInit {
  @Input() newVersion: string = '';
  @Input() updateDate: string = '';
  @Input() isVms: boolean = false;

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    if (!this.isVms) {
      this.isVms = await this.detectIsVms();
    }
  }

  async detectIsVms(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const path = (window.location.pathname || '') + (window.location.hash || '');
        if (path.toLowerCase().includes('vms')) {
          return true;
        }
      }
      const tokenData = await Preferences.get({ key: 'USER_INFO' });
      if (tokenData?.value) {
        let rawToken = tokenData.value;
        try {
          const decodedString = decodeURIComponent(escape(atob(rawToken)));
          const credential = JSON.parse(decodedString);
          if (credential?.access_token) {
            rawToken = credential.access_token;
          }
        } catch {}
        const decoded: any = jwtDecode(rawToken);
        return !!decoded?.is_vms;
      }
      return false;
    } catch {
      return false;
    }
  }

  async updateNow() {
    let storeUrl = '';
    console.log('Platform is', this.platform.platforms());
    
    if (this.platform.is('android')) {
      storeUrl = 'https://play.google.com/store/apps/details?id=com.sgeede.focus.security';
    } else if (this.platform.is('ios')) {
      storeUrl = 'https://apps.apple.com/us/app/ifs360/id6746474771';
    }
    
    if (storeUrl) {
      await Browser.open({ url: storeUrl });
      this.modalController.dismiss();
    }
  }

  closeModal() {
    const todayStr = new Date().toDateString();
    localStorage.setItem('vms_last_update_modal_date', todayStr);
    Preferences.set({ key: 'vms_last_update_modal_date', value: todayStr }).catch(() => {});
    this.modalController.dismiss();
  }

  remindLater() {
    this.closeModal();
  }

  dontShowToday() {
    this.closeModal();
  }
}