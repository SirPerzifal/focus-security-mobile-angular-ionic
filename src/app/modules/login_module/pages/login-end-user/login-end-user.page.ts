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
import { Subscription } from 'rxjs';

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
    private storage: StorageService
  ) {}
  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  ngOnInit() {
    this.waitingResponseLoginApi = false
    this.initializeBackButtonHandling();
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
        this.authService.postLoginAuthenticate(
          this.existUser.login, 
          this.existUser.password, 
          this.fcmToken,
          Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' ? 'ios' : 'android'
        ).subscribe(
          res => {
            if (res.result.status_code == 200) {
              console.log("works!", res);
              if (res.result.status === true) {
                Preferences.set({
                  key: 'USER_INFO',
                  value: res.result.access_token,
                }).then(()=>{
                  this.existUser = {
                    login: '',
                    password: '',
                  }
                  setTimeout(() => {
                    this.isAnimating = false;
                    this.waitingResponseLoginApi = false;
                    this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
                  }, 300); // Match this duration with the CSS animation duration
                });
              } else {
                const userCredentials = {
                  emailOrPhone: this.existUser.login,
                  access_token: res.result.access_token
                }
                Preferences.set({
                  key: 'USER_INFO',
                  value: btoa(unescape(encodeURIComponent(JSON.stringify(userCredentials))))
                }).then(() => {
                  this.existUser = {
                    login: '',
                    password: '',
                  }
                  setTimeout(() => {
                    this.isAnimating = false;
                    this.waitingResponseLoginApi = false;
                    this.router.navigate(['/resident-home-page']);
                  }, 300); // Match this duration with the CSS animation duration
                });
              }
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
            console.log('Login error:', error);
            
            this.waitingResponseLoginApi = false;
            this.isAnimating = true;
            setTimeout(() => {
              this.isAnimating = false;
            }, 300); // Match this duration with the CSS animation duration
            this.functionMain.presentToast('Login Failed : Server not response well', 'danger');
          }
        );
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
