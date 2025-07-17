import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';

import { StorageService } from 'src/app/service/storage/storage.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

import { Estate } from 'src/models/resident/resident.model';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { Router } from '@angular/router';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-modal-estate-homepage',
  templateUrl: './modal-estate-homepage.component.html',
  styleUrls: ['./modal-estate-homepage.component.scss'],
})
export class ModalEstateHomepageComponent  implements OnInit {

  profileEstate: Estate[] = [];
  isLoading: boolean = false;
  activeUnit : number = 0;
  noData: boolean = false;
  client: boolean = false;
  fcmToken: string = '';

  constructor(
    private webRtcService: WebRtcService,
    private navParams: NavParams,
    private modalController: ModalController,
    private storage: StorageService,
    public functionMain: FunctionMainService,
    private mainApiResident: MainApiResidentService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if (value) {
        const decodedUserState = decodeURIComponent(escape(atob(value)));
        this.activeUnit = JSON.parse(decodedUserState).unit_id; // Pastikan untuk mengurai JSON
        console.log(JSON.parse(decodedUserState).unit_id); // Pastikan untuk mengurai JSON
      } else {
        console.log(value); // Pastikan untuk mengurai JSON
        this.activeUnit = 0
      }
    })

    const estate = this.navParams.get('estate');
    this.profileEstate = Object.keys(estate).map(key => ({
      user_id: estate[key]?.user_id,
      family_id: estate[key]?.family_id,
      family_name: estate[key]?.family_name || '',
      family_nickname: estate[key]?.family_nickname || '',
      image_profile: estate[key]?.image_profile || '',
      family_email: estate[key]?.family_email || '',
      family_mobile_number: estate[key]?.family_mobile_number || '',
      family_type: estate[key]?.family_type || '',
      unit_id: estate[key]?.unit_id,
      unit_name: estate[key]?.unit_name || '',
      block_id: estate[key]?.block_id,
      block_name: estate[key]?.block_name || '',
      project_id: estate[key]?.project_id,
      project_name: estate[key]?.project_name || '',
      project_image: estate[key]?.project_image || '',
      record_type: estate[key]?.record_type || '',
    }));
  
    this.isLoading = false;
  }

  async chooseEstateClick(estate: any) {
    if (estate.user_id) {
      if (!this.client) {
        this.modalController.dismiss('gas ini dari resident');
        let storageData = {
          'image_profile': estate.image_profile
        }
        this.storage.clearAllValueFromStorage();
        this.storage.setValueToStorage('USESATE_DATA', storageData)
        this.getNotificationPermission(estate.family_id);
          this.getAccessToken(estate.family_id);
        // this.router.navigate(['/client-main-app'], {queryParams: {reload: true}});
        return;
      } else {
        this.modalController.dismiss(estate);
        this.getNotificationPermission(estate.family_id);
          this.getAccessToken(estate.family_id);
        return;
      }
    } else {
      if (this.client) {
        const estateString = JSON.stringify(estate);
        // Melakukan encoding ke Base64
        const encodedEstate = btoa(unescape(encodeURIComponent(estateString)));
        this.storage.clearAllValueFromStorage();
        this.storage.setValueToStorage('USESATE_DATA', encodedEstate).then((response: any) => {
          this.modalController.dismiss('gas ini dari client');
          this.getNotificationPermission(estate.family_id);
          this.getAccessToken(estate.family_id);
          // this.router.navigate(['/resident-home-page'], {queryParams: {reload: true}});
        })
        return;
      } else {
        const estateString = JSON.stringify(estate);
        // Melakukan encoding ke Base64
        const encodedEstate = btoa(unescape(encodeURIComponent(estateString)));
        this.storage.clearAllValueFromStorage();
        this.storage.setValueToStorage('USESATE_DATA', encodedEstate).then((response: any) => {
          this.modalController.dismiss(encodedEstate);
          this.getNotificationPermission(estate.family_id);
          this.getAccessToken(estate.family_id);
        })
        return;
      }
    }
    // Mengubah estate menjadi string JSON
  }

  async getAccessToken(familyId: number) {
    this.mainApiResident.endpointCustomProcess({
      family_id: familyId,
    }, '/get/access_token').subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          Preferences.clear();
          if (response.result.email) {
            const userCredentials = {
              emailOrPhone: response.result.email,
              access_token: response.result.access_token
            }
            Preferences.set({
              key: 'USER_INFO',
              value: btoa(unescape(encodeURIComponent(JSON.stringify(userCredentials))))
            })
          } else {
            Preferences.set({
              key: 'USER_INFO',
              value: response.result.access_token,
            })
          }
        }
      },
      error: (error) => {
        console.error('Failed to get access token:', error);
      }
    });
  }
  
  async getNotificationPermission(familyId: number): Promise<string> {
      try {
        // Check if PushNotifications is available
        if (typeof PushNotifications === 'undefined') {
          console.warn('PushNotifications not available.');
          return '';
        }
  
        // Request permissions
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive !== 'granted') {
          console.log('Notification permission not granted');
          return '';
        }
  
        // Clean up and register
        PushNotifications.removeAllListeners();
        PushNotifications.register();
  
        // Return promise for token registration
        return this.waitForToken(familyId);
      } catch (err) {
        console.error('Push Notification Error:', err);
        return '';
      }
    }
  
    private waitForToken(familyId: number): Promise<string> {
      return new Promise((resolve) => {
        const TIMEOUT_MS = 10000; // Reduced from 15s to 10s
        
        const timeout = setTimeout(() => {
          this.cleanupTokenListeners();
          console.log('FCM registration timed out');
          resolve('');
        }, TIMEOUT_MS);
  
        const onRegistration = (token: Token) => {
          this.cleanupTokenListeners();
          if (token.value) {
            this.fcmToken = token.value;
            console.log('FCM Token received:', token.value);
              
            // ✅ Send token to backend
            this.mainApiResident.endpointCustomProcess({
              family_id: familyId,
              fcm_token: token.value,
              device_new: Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' ? 'ios' : 'android'
            }, '/set/fcm_token').subscribe({
              next: (response: any) => {
                console.log('FCM token sent to backend successfully:', response);
                resolve(token.value); // ✅ PERBAIKAN: resolve dengan token
              },
              error: (error) => {
                console.error('Failed to send FCM token to backend:', error);
                resolve(token.value); // ✅ Tetap resolve dengan token meski gagal kirim ke backend
              }
            });
            resolve(token.value);
          } else {
            resolve('');
          }
        };
  
        const onRegistrationError = (error: any) => {
          this.cleanupTokenListeners();
          console.error('Push notification registration error:', error);
          resolve('');
        };
  
        // Add listeners
        PushNotifications.addListener('registration', onRegistration);
        PushNotifications.addListener('registrationError', onRegistrationError);
  
        // Store cleanup function
        this.cleanupTokenListeners = () => {
          clearTimeout(timeout);
          PushNotifications.removeAllListeners();
        };
      });
    }
  
    private cleanupTokenListeners: () => void = () => {};
}
