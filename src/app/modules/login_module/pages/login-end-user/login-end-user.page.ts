import { Component, OnInit } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { LoginParams, EstateProfile } from 'src/models/resident/resident.model';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';

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
    private notificationService: NotificationService,
    private functionMain: FunctionMainService
  ) {}

  ngOnInit() {
    this.waitingResponseLoginApi = false
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

  async getNotificationPermission() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });
    PushNotifications.addListener('registration', async (token: Token) => {
      if (token.value) {
        this.fcmToken = token.value;
        this.notificationService.registerNotification(token.value).subscribe({
          next: (res) => {
          },
          error: (err) => {
            this.functionMain.presentToast('An error occurred while registering token push notification', 'danger');
          }
        });
      }
    });
  }

  async loginResident(){
    this.waitingResponseLoginApi = true;
    this.isAnimating = true;
    setTimeout(() => {
      this.isAnimating = false;
    }, 300); // Match this duration with the CSS animation duration
    if(!this.existUser.login && !this.existUser.password){
      return
    } else {
      try{
        await this.getNotificationPermission();
        this.authService.postLoginAuthenticate(
          this.existUser.login, 
          this.existUser.password, 
          this.fcmToken
        ).subscribe(
          res => {
            if (res.result.status_code == 200) {
              if (res.result.is_client) {
                Preferences.set({
                  key: 'USER_INFO',
                  value: JSON.stringify(res.result.access_token),
                }).then(()=>{
                  this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
                  this.waitingResponseLoginApi = true;
                  this.isAnimating = true;
                  setTimeout(() => {
                    this.isAnimating = false;
                  }, 300); // Match this duration with the CSS animation duration
                });
              } else if (res.result.is_resident) {
                const estates = res.result.estates;
                const emailOrPhone = res.result.login;
                const userCredentials = {
                  emailOrPhone: emailOrPhone,
                  password: this.existUser.password
                }

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
                  this.waitingResponseLoginApi = true;
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
      } catch (error) {
        this.waitingResponseLoginApi = false;
        this.isAnimating = true;
        setTimeout(() => {
          this.isAnimating = false;
        }, 300); // Match this duration with the CSS animation duration
        this.functionMain.presentToast("There's somrthing wrong with Server.", 'danger');
      }
    }
  }
}
