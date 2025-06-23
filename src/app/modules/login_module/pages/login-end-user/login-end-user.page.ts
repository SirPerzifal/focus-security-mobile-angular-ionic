import { Component, OnInit } from '@angular/core';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { LoginParams } from 'src/models/resident/resident.model';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage/storage.service';

// Definisi interface
export interface AppDelegatePlugin {
  getValueFromAppDelegate(): Promise<{ value: string }>;
}

// Register plugin
const AppDelegatePlugin = registerPlugin<AppDelegatePlugin>('AppDelegatePlugin');

@Component({
  selector: 'app-login-end-user',
  templateUrl: './login-end-user.page.html',
  styleUrls: ['./login-end-user.page.scss'],
})
export class LoginEndUserPage implements OnInit {

  isAnimating: boolean = false;
  waitingResponseLoginApi: boolean = false;

  addMarginBottomExtend: boolean = false;

  existUser: LoginParams = {
    login: '',
    password: '',
  };
  fcmToken: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private functionMain: FunctionMainService,
    private platform: Platform,
    private storage: StorageService,
  ) {}

  ngOnInit() {
    this.waitingResponseLoginApi = false
    this.initializeBackButtonHandling();
  }

  initializeBackButtonHandling() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log("tres");
      
      this.router.navigate([''])
    });
  }

  handleFocus(event?: any) {
    if (event) {
      this.addMarginBottomExtend = event;
    }else if (event === false) {
      this.addMarginBottomExtend = false;
    } else {
      this.addMarginBottomExtend = true
    }
  }

  onLoginChange(event: any): void {
    this.existUser.login = event.target.value;
  }

  onPasswordChange(password: string | any ): void {
    this.existUser.password = password;
  }

  async getNotificationPermission(): Promise<string> {
    
    try {
      console.log("masuk try");
      if (typeof PushNotifications === 'undefined') {
        console.warn('PushNotifications not available.');
        return '';
      }

      const permission = await PushNotifications.requestPermissions();

      if (permission.receive !== 'granted') {
        console.log('Notification permission not granted');
        return '';
      }

      // ✅ Cleanup existing listeners sebelum register
      PushNotifications.removeAllListeners();
      PushNotifications.register();

      return new Promise((resolve, reject) => {
        console.log("masuk udah ke return");
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
          console.log("Masuk ios logic");
          // Set timeout untuk menghindari promise yang tidak pernah resolve
          const timeout = setTimeout(() => {
            cleanupListeners();
            console.log('FCM registration timed out');
            resolve(''); // Resolve dengan string kosong jika timeout
          }, 15000); // ✅ Increase timeout untuk iOS (15 detik)
          
          const cleanupListeners = () => {
            clearTimeout(timeout);
            PushNotifications.removeAllListeners();
          };
  
          PushNotifications.addListener('registration', (token: Token) => {
            if (token.value) {
              this.fcmToken = token.value;
              resolve(token.value)
              console.log('FCM Token received:', token.value);
            } else {
              cleanupListeners();
              resolve(''); // Resolve dengan string kosong jika token kosong
            }
          });
  
          PushNotifications.addListener('registrationError', (error) => {
            cleanupListeners();
            console.error('Push notification registration error:', error);
            resolve(''); // Resolve dengan string kosong untuk melanjutkan proses login
          });
        } else {
          console.log("Masuk android logic");
          // Set timeout untuk menghindari promise yang tidak pernah resolve
          const timeout = setTimeout(() => {
            cleanupListeners();
            console.log('FCM registration timed out');
            resolve(''); // Resolve dengan string kosong jika timeout
          }, 15000); // ✅ Increase timeout untuk iOS (15 detik)
          
          const cleanupListeners = () => {
            clearTimeout(timeout);
            PushNotifications.removeAllListeners();
          };
  
          PushNotifications.addListener('registration', (token: Token) => {
            if (token.value) {
              this.fcmToken = token.value;
              resolve(token.value)
              console.log('FCM Token received:', token.value);
            } else {
              cleanupListeners();
              resolve(''); // Resolve dengan string kosong jika token kosong
            }
          });
  
          PushNotifications.addListener('registrationError', (error) => {
            cleanupListeners();
            console.error('Push notification registration error:', error);
            resolve(''); // Resolve dengan string kosong untuk melanjutkan proses login
          });
        }
      });
    } catch (err) {
      console.error('Push Notification Error:', err);
      return ''; // Return string kosong untuk melanjutkan proses login
    }
  }
  
  async loginResident(){
    if (!this.existUser.login && !this.existUser.password) return
    this.waitingResponseLoginApi = true;
    this.isAnimating = true;
    setTimeout(() => {
      this.isAnimating = false;
    }, 300); // Match this duration with the CSS animation duration
    if(!this.existUser.login && !this.existUser.password){
      return
    } else {
      try{
        // Coba dapatkan token notifikasi, tapi jangan biarkan kegagalan menghentikan proses login
        try {
          await this.getNotificationPermission();
        } catch (notificationError) {
          console.error('Failed to get notification permission:', notificationError);
          // Lanjutkan proses login meskipun gagal mendapatkan token notifikasi
      }
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
          this.authService.postLoginAuthenticate(
            this.existUser.login, 
            this.existUser.password, 
            this.fcmToken,
            'ios'
          ).subscribe(
            res => {
              console.log(res);            
              if (res.result.status_code == 200) {
                if (res.result.is_client) {
                  Preferences.set({
                    key: 'USER_INFO',
                    value: res.result.access_token,
                  }).then(()=>{
                    this.storage.clearAllValueFromStorage()
                    let storageData = {
                      'image_profile': res.result.image_profile
                    }
                    this.storage.setValueToStorage('USESATE_DATA', storageData)
                    this.waitingResponseLoginApi = true;
                    this.isAnimating = true;
                    setTimeout(() => {
                      this.isAnimating = false;
                      this.waitingResponseLoginApi = false;
                      this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
                    }, 300); // Match this duration with the CSS animation duration
                  });
                } else if (res.result.is_resident) {
                  const estates = res.result.estates;
                  const emailOrPhone = res.result.login;
                  const userCredentials = {
                    emailOrPhone: emailOrPhone,
                    access_token: res.result.access_token
                  }
                  console.log(userCredentials)

                  Preferences.set({
                    key: 'USER_CREDENTIAL',
                    value: btoa(unescape(encodeURIComponent(JSON.stringify(userCredentials))))
                  }).then(() => {
                    this.existUser = {
                      login: '',
                      password: '',
                    }
                    this.router.navigate(['/resident-home-page'], {
                      state: {
                        estate: estates,
                      }
                    });
                    this.waitingResponseLoginApi = false;
                    this.isAnimating = true;
                    setTimeout(() => {
                      this.isAnimating = false;
                    }, 300); // Match this duration with the CSS animation duration
                  })
                };
              } else {
                this.waitingResponseLoginApi = false;
                this.isAnimating = true;
                setTimeout(() => {
                  this.isAnimating = false;
                }, 300); // Match this duration with the CSS animation duration
                this.functionMain.presentToast(`${res.result.status_desc}`, 'danger');
              }
            },
            error => {
              this.waitingResponseLoginApi = false;
              this.isAnimating = true;
              setTimeout(() => {
                this.isAnimating = false;
              }, 300); // Match this duration with the CSS animation duration
              this.functionMain.presentToast('Login Failed : Server not response well', 'danger');
            }
          );
        } else {
          this.authService.postLoginAuthenticate(
            this.existUser.login, 
            this.existUser.password, 
            this.fcmToken,
            'android'
          ).subscribe(
            res => {
              console.log(res);            
              if (res.result.status_code == 200) {
                if (res.result.is_client) {
                  Preferences.set({
                    key: 'USER_INFO',
                    value: res.result.access_token,
                  }).then(()=>{
                    this.storage.clearAllValueFromStorage()
                    let storageData = {
                      'image_profile': res.result.image_profile
                    }
                    this.storage.setValueToStorage('USESATE_DATA', storageData)
                    this.waitingResponseLoginApi = true;
                    this.isAnimating = true;
                    setTimeout(() => {
                      this.isAnimating = false;
                      this.waitingResponseLoginApi = false;
                      this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
                    }, 300); // Match this duration with the CSS animation duration
                  });
                } else if (res.result.is_resident) {
                  const estates = res.result.estates;
                  const emailOrPhone = res.result.login;
                  const userCredentials = {
                    emailOrPhone: emailOrPhone,
                    access_token: res.result.access_token
                  }
                  console.log(userCredentials)

                  Preferences.set({
                    key: 'USER_CREDENTIAL',
                    value: btoa(unescape(encodeURIComponent(JSON.stringify(userCredentials))))
                  }).then(() => {
                    this.existUser = {
                      login: '',
                      password: '',
                    }
                    this.router.navigate(['/resident-home-page'], {
                      state: {
                        estate: estates,
                      }
                    });
                    this.waitingResponseLoginApi = false;
                    this.isAnimating = true;
                    setTimeout(() => {
                      this.isAnimating = false;
                    }, 300); // Match this duration with the CSS animation duration
                  })
                };
              } else {
                this.waitingResponseLoginApi = false;
                this.isAnimating = true;
                setTimeout(() => {
                  this.isAnimating = false;
                }, 300); // Match this duration with the CSS animation duration
                this.functionMain.presentToast(`${res.result.status_desc}`, 'danger');
              }
            },
            error => {
              this.waitingResponseLoginApi = false;
              this.isAnimating = true;
              setTimeout(() => {
                this.isAnimating = false;
              }, 300); // Match this duration with the CSS animation duration
              this.functionMain.presentToast('Login Failed : Server not response well', 'danger');
            }
          );
        }
      } catch (error) {
        this.waitingResponseLoginApi = false;
        this.isAnimating = true;
        setTimeout(() => {
          this.isAnimating = false;
        }, 300); // Match this duration with the CSS animation duration
        this.functionMain.presentToast("There's something wrong with Server.", 'danger');
      }
    }
  }

  showForgotPasswordModal: boolean = false;
  showModalForgotPassword() {
    this.showForgotPasswordModal = !this.showForgotPasswordModal
  }

  closeRejectModal() {
    this.showForgotPasswordModal = !this.showForgotPasswordModal
  }
}
