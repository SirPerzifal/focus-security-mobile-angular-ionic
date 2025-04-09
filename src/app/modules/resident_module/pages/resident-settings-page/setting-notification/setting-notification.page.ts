import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { MyVehicleFormService } from 'src/app/service/resident/my-vehicle/my-vehicle-form/my-vehicle-form.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-notification',
  templateUrl: './setting-notification.page.html',
  styleUrls: ['./setting-notification.page.scss'],
})
export class SettingNotificationPage implements OnInit {

  constructor(
    private myVehicleFormService:MyVehicleFormService,
    private toastController:ToastController,
    private router: Router
  ) { }

  requestorName = '';
  requestorId=0;
  activeWalkVisitorAlert = false;
  activeDriveVisitorAlert = false;

  ngOnInit() {
  }

  ionViewWillEnter(){
    Preferences.get({key:'USESTATE_DATA'}).then(async (value:any)=>{ 
      if(value?.value){
        const parseValue = JSON.parse(value.value);
        this.requestorId = parseInt(parseValue.family_id)
        this.requestorName = parseValue.family_name
        this.myVehicleFormService.getNotificationAlertSettings(this.requestorId).subscribe({
          next: (response: any) => {
            if (response.result.response_code === 200) {
              this.activeWalkVisitorAlert = response.result.response_result.is_active_walk_visitor_alert;
              this.activeDriveVisitorAlert = response.result.response_result.is_active_drive_visitor_alert;
            } else {
              this.presentToast('Failed to notifications settings!', 'danger');
              console.log(response);
            }
          },
          error: (error) => {
            this.presentToast('Internal Server Error', 'danger');
            console.error('Error:', error);
          }
        });

        
      }
    })
  }
  
  async onSaveChanges(){
    this.myVehicleFormService.postNotificationAlertSettings(this.requestorId,this.activeWalkVisitorAlert,this.activeDriveVisitorAlert).subscribe({
      next: (response: any) => {
        if (response.result.response_code === 200) {
          this.presentToast('Configuration update is saved!')
          this.router.navigate(  ['/resident-settings-page'])
          // this.activeWalkVisitorAlert = response.result.response_result.is_active_walk_visitor_alert;
          // this.activeDriveVisitorAlert = response.result.response_result.is_active_drive_visitor_alert;
        } else {
          this.presentToast('Failed to notifications settings!', 'danger');
          console.log(response);
        }
      },
      error: (error) => {
        this.presentToast('Internal Server Error', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      if (color === 'success') {
        pingSound.play().catch((err) => console.error('Error playing sound:', err));
      } else {
        errorSound.play().catch((err) => console.error('Error playing sound:', err));
      }
    });
  }


}
