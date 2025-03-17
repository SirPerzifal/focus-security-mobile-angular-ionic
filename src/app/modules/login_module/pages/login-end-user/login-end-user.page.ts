import { Component, OnInit } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

import { LoginUserDto } from 'src/models/resident/auth.model';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';

@Component({
  selector: 'app-login-end-user',
  templateUrl: './login-end-user.page.html',
  styleUrls: ['./login-end-user.page.scss'],
})
export class LoginEndUserPage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController, 
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
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

  onPasswordChange(event: any): void {
    this.existUser.params.password = event.target.value;
  }

  fcmToken: string = '';
  async loginResident(){
    // console.log(this.existUser.params.login, this.existUser.params.password, this.fcmToken);
    if(!this.existUser.params.login && !this.existUser.params.password){
      return
    } else {
      try{
        await this.getNotificationPermission();
        this.authService.postLoginAuthenticate(this.existUser.params.login,this.existUser.params.password, this.fcmToken).subscribe(
          res => {
            // console.log(res);
            if (res.result.status_code == 200) {
              const estate = res.result.estates;
              Preferences.set({
                key: 'USER_EMAIL',
                value: String(this.existUser.params.login),
              }).then(()=>{
                this.router.navigate(['/resident-homepage'], {
                  state: {
                    estate: estate,
                  }
                });
              });
            } else {
              this.presentToast(`${res.result.status_desc}`, 'danger');
            }
          },
          error => {
            console.error('Error:', error);
            this.presentToast('Login Failed :'+String(error.message), 'danger');
          }
        );
      } catch (error) {
        console.error('Unexpected error:', error);
        this.presentToast(String(error), 'danger');
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
