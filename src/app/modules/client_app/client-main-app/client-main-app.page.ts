import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-client-main-app',
  templateUrl: './client-main-app.page.html',
  styleUrls: ['./client-main-app.page.scss'],
})
export class ClientMainAppPage implements OnInit {

  unit_id: number = 1;
  partner_id: number = 1;
  paramForBadgeNotification: number = 0;
  condominiumName: string = '';

  constructor(private notificationService: NotificationService, private route: Router) { }

  ngOnInit() {
    this.loadCountNotification();
    this.loadPreferenceProjectName();
  }

  async loadPreferenceProjectName(){
    const projectName = await Preferences.get({key: 'PROJECT_NAME'})
    if(projectName?.value){
      this.condominiumName = projectName.value
    }
  }



  loadCountNotification() {
    this.notificationService.countNotifications(this.unit_id, this.partner_id)
      .subscribe({next: (response: any) => {
        if (response.result.response_code === 200) {
          // Map data dengan tipe yang jelas
          this.paramForBadgeNotification = response.result.notifications; // Simpan jumlah notifikasi baru
          // if (this.paramForBadgeNotification) {
          //   console.log('it works!', this.paramForBadgeNotification)
          // }
          console.log(response.result)
        } else {
          console.error('Error:', response);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  directToNotifications() {
    this.paramForBadgeNotification = 0;
    this.route.navigate(['resident-notification']);

  }

}
