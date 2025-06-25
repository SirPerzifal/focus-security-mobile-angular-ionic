import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { LoginParams } from 'src/models/resident/resident.model';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage/storage.service';

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

  ionViewWillEnter() {
    // Force video load di iOS
    if (this.isIOS()) {
      const video = document.querySelector('video');
      if (video) {
        video.load();
        video.play().catch(err => {
          console.log('Video autoplay failed:', err);
          // Show fallback background
          const fallback = document.querySelector('.video-fallback');
          if (fallback) {
            (fallback as HTMLElement).style.display = 'block';
          }
        });
      }
    }
  }

  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  ngOnInit() {
    this.waitingResponseLoginApi = false
    this.initializeBackButtonHandling();
  }

  showPassword: string = 'password'
  onToggleShowPassword() {
    this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
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

  onPasswordChange(password: any ): void {
    this.existUser.password = password.target.value;
  }

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

      // Clean up and register
      PushNotifications.removeAllListeners();
      PushNotifications.register();

      // Return promise for token registration
      return this.waitForToken();
    } catch (err) {
      console.error('Push Notification Error:', err);
      return '';
    }
  }

  private waitForToken(): Promise<string> {
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
