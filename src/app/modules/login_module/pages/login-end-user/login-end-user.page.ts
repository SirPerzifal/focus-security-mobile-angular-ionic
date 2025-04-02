import { Component, OnInit } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

import { LoginUserDto } from 'src/models/resident/auth.model';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';

interface Estate {
  family_id: number;
  family_name: string;
  family_email: string;
  family_mobile_number: string;
  family_type: string;
  unit_id: number;
  unit_name: string;
  block_id: number;
  block_name: string;
  project_id: number;
  project_name: string;
}

@Component({
  selector: 'app-login-end-user',
  templateUrl: './login-end-user.page.html',
  styleUrls: ['./login-end-user.page.scss'],
})
export class LoginEndUserPage implements OnInit {

  

  isAnimating: boolean = false;
  waitingResponseLoginApi: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController, 
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
  }

  addMarginBottomExtend: boolean = false;

  
  ionViewWillEnter() {
    this.waitingResponseLoginApi = false

  }
  // Fungsi untuk mengubah nilai addMarginBottomExtend
  handleFocus() {
    this.addMarginBottomExtend = true;
  }

  handleBlur() {
    this.addMarginBottomExtend = false;
  }

  existUser: LoginUserDto = {
    jsonrpc: '2.0',
    params: {
      login: '',
      password: '',
    },
  };

  showPassword: string = 'password';

  onLoginChange(event: any): void {
    this.existUser.params.login = event.target.value
  }

  onToggleShowPassword() {
    this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
  }

  onPasswordChange(password: string): void {
    this.existUser.params.password = password;
  }

  fcmToken: string = '';
  async loginResident(){
    // If a different dial is clicked, animate the popdown first
    this.waitingResponseLoginApi = true;
    this.isAnimating = true;
    setTimeout(() => {
      this.isAnimating = false;
    }, 300); // Match this duration with the CSS animation duration
    // console.log(this.existUser.params.login, this.existUser.params.password, this.fcmToken);
    if(!this.existUser.params.login && !this.existUser.params.password){
      return
    } else {
      try{
        await this.getNotificationPermission();
        this.authService.postLoginAuthenticate(this.existUser.params.login,this.existUser.params.password, this.fcmToken).subscribe(
          res => {
            console.log(res);
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
                const filteredEstates: Record<string, Estate> = {};
                Object.entries(estates).forEach(([key, value]) => {
                    if (key !== "login") {
                        const estate = value as any;
                        if (estate.family_email === estates.login || estate.family_mobile_number === estates.login) {
                            filteredEstates[key] = estate;
                        }
                    }
                });
              console.log('filteredEstatesfilteredEstatesfilteredEstatesfilteredEstates');
              console.log(filteredEstates);
              console.log(Object.entries(filteredEstates)[0]);
              let [firstKey, firstValue] = Object.entries(filteredEstates)[0]
              
                Preferences.set({
                  key: 'USER_EMAIL',
                  value: String(firstValue.family_email),
                }).then(()=>{
                  console.log(firstValue);
                  console.log("firstValuefirstValuefirstValuefirstValue");
                  
                  Preferences.set({
                    key: 'USER_MOBILE',
                    value: String(firstValue.family_mobile_number),
                  }).then(()=>{
                  Preferences.set({
                    key: 'CURRENT_PASS',
                    value: String(this.existUser.params.password)
                  }).then(() => {
                    this.existUser.params = {
                      login: '',
                      password: '',
                    }
                    this.router.navigate(['/resident-homepage'], {
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
                })
              });
              }
            } else {
              this.waitingResponseLoginApi = false;
              this.isAnimating = true;
              setTimeout(() => {
                this.isAnimating = false;
              }, 300); // Match this duration with the CSS animation duration
              this.presentToast(`${res.result.status_desc}`, 'danger');
            }
          },
          error => {
            this.waitingResponseLoginApi = false;
            this.isAnimating = true;
            setTimeout(() => {
              this.isAnimating = false;
            }, 300); // Match this duration with the CSS animation duration
            this.presentToast('Login Failed : Server not response well', 'danger');
          }
        );
      } catch (error) {
        this.waitingResponseLoginApi = false;
        this.isAnimating = true;
        setTimeout(() => {
          this.isAnimating = false;
        }, 300); // Match this duration with the CSS animation duration
        this.presentToast("There's somrthing wrong with Server.", 'danger');
      }
    }
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
            // this.presentToast('It Works!', 'success');
            // this.router.navigate(['resident-homepage']);
          },
          error: (err) => {
            this.presentToast('An error occurred while registering token push notification', 'danger');
          }
        });
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present().then(() => {
    });;
  }

}
