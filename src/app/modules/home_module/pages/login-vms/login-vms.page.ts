import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Html5Qrcode } from 'html5-qrcode';
import { Platform } from '@ionic/angular';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Preferences } from '@capacitor/preferences';
import { StorageService } from 'src/app/service/storage/storage.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { CheckAppVersionService } from 'src/app/service/check-app-version/check-app-version.service';
import { CalendarUtils } from 'angular-calendar';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FcmTokenService } from 'src/app/service/fcm-token/fcm-token.service';

@Component({
  selector: 'app-login-vms',
  templateUrl: './login-vms.page.html',
  styleUrls: ['./login-vms.page.scss'],
})
export class LoginVmsPage implements OnInit {

  constructor(
    private router: Router, 
    private platform: Platform, 
    private clientMainService: ClientMainService, 
    public functionMain: FunctionMainService,
    private storage: StorageService,
    private appVersionCheck: CheckAppVersionService,
    private route: ActivatedRoute,
    private webrtc: WebRtcService,
    private fcmTokenService: FcmTokenService,
  ) {}

  ngOnInit() {
    this.initializeBackButtonHandling()
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if (params) {
        if (params['user_id']){
          this.direct_user_id = params['user_id']
        }
        if (params['call_id']){
          this.direct_call_id = params['call_id']
        }
        if (params['project_id']){
          console.log("EYYOYOOOO", params['project_id'])
          this.searchBarcode('', params['project_id'])
        }
      }
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  direct_user_id: any = 0
  direct_call_id: any = 0

  onBack() {
    this.router.navigate([''])
  }

  async getPreference() {
    return this.functionMain.vmsPreferences().then((value) => {
      return value ? value : false
    })
  }

  async searchBarcode(barcode: string, direct_project_id: any = false){
    if (barcode || direct_project_id) {
      try {
        await this.getNotificationPermission();
      } catch (notificationError) {
          console.error('Failed to get notification permission:', notificationError);
      }
      let callStorage: any = false
      if (direct_project_id) {
        if (this.direct_call_id && this.direct_user_id) {
          callStorage = {
            'user_id': this.direct_user_id,
            'call_id': this.direct_call_id,
          }
        } else {
          this.functionMain.presentToast("Invalid URL.", 'danger')
        }
      }
      console.log("HI")
      this.getPreference().then((value: any) => {
        this.storage.clearAllValueFromStorage()
        console.log(value)
        let params = {
          barcode: barcode, 
          fcm_token: this.fcmToken, 
          direct_project_id: direct_project_id, 
          direct_user_id: this.direct_user_id, 
          direct_call_id: this.direct_call_id, 
          fcm_token_id: (value ? value.fcm_token_id : false)
        }
        console.log(params)
        this.clientMainService.getApi(params, '/vms/post/vms_login').subscribe({
          next: (results) => {
            console.log(results.result)
            if (results.result.status_code === 200) {
              this.project_key = ''
              this.functionMain.logout()
              Preferences.set({
                key: 'USER_INFO',
                value: results.result.response_status.access_token,
              }).then(()=>{
                let storageData = {
                  'background': results.result.response_status.background
                }
                this.storage.setValueToStorage('USESATE_DATA', storageData)
                let countryCodeData = results.result.response_status.country_codes.country_code_data
                this.storage.setValueToStorage('COUNTRY_CODES_DATA', countryCodeData)
                if (callStorage) {
                  this.storage.setValueToStorage('RGG_CALL_DATA', callStorage)
                }
                setTimeout(() => {
                  this.router.navigate(['/home-vms']);
                }, 300)
              });
            } else {
              this.functionMain.presentToast(results.result.status_description, 'danger');
            }
          },
          error: (error) => {
            this.functionMain.presentToast('An error occurred while logging into VMS!', 'danger');
            console.error(error);
          }
        });
      })
    } else {
      this.functionMain.presentToast('Project code is required!', 'warning')
    }
    
  }

  project_key = ''

  initializeBackButtonHandling() {
    // Force check saat masuk halaman ini
    this.appVersionCheck.checkVersion(true);
    console.log("tes");
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/'])
    });
  }

  fcmToken: any = ''

  async getNotificationPermission(): Promise<string> {
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

      // ✅ Use FcmTokenService which correctly returns Firebase FCM token on iOS
      const token = await this.fcmTokenService.getToken(10000);
      if (token) {
        this.fcmToken = token;
        console.log('FCM Token received via FcmTokenService:', token);
        return token;
      }
      return '';
    } catch (err) {
      console.error('Push Notification Error:', err);
      return '';
    }
  }
}
