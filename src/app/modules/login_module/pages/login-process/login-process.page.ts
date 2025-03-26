import { Component, OnInit } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';

@Component({
  selector: 'app-login-process',
  templateUrl: './login-process.page.html',
  styleUrls: ['./login-process.page.scss'],
})
export class LoginProcessPage implements OnInit {

  constructor(private router: Router, private toastController: ToastController, private notificationService: NotificationService) { }

  ngOnInit() {
    // window.location.reload();
  }

  getNotificationPermission() {
    PushNotifications.requestPermissions().then((result) => {
      console.log("the granted", result)
      console.log("the granted", result.receive)
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log("inside the preferences")
        console.log("value",token.value)
        if (token.value) {
          this.notificationService.registerNotification(token.value).subscribe({
            next: (res) => {
              console.log('res', res)
              this.presentToast('It Works!', 'success');
              this.router.navigate(['resident-homepage']);
            },
            error: (err) => {
              console.log('err', err)
              this.presentToast('An error occurred while registering token push notification', 'danger');
            }
          });
        }
    });

    
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });

    toast.present().then(() => {
    });
  }
}
