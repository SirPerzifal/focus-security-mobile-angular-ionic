import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

@Component({
  selector: 'app-appeal-parking-fines',
  templateUrl: './appeal-parking-fines.page.html',
  styleUrls: ['./appeal-parking-fines.page.scss'],
})
export class AppealParkingFinesPage implements OnInit {

  unitId: number = 1;

  appealData: any = [];

  constructor(private raiseARequestService: RaiseARequestService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unitId = Number(parseValue.unit_id);
        this.loadOffence();
      }
    })
  }

 ambil_tanggal(datetime_str: any) {
   const tanggal = datetime_str.split(" ")[0]
   return tanggal
 }

  loadOffence() {
    this.raiseARequestService.getOffensesApi(
      this.unitId
    ).subscribe((response: any) => {
      if (response.result.response_code === 200) {
        // console.log(response);
        this.appealData = response.result.response_result.map((appeal_data: any) => {
          return {
            'id' : appeal_data.id,
            'name' : appeal_data.name,
            'contact_number' : appeal_data.contact_number,
            'offender_name' : appeal_data.offender_name,
            'vehicle_number' : appeal_data.vehicle_number,
            'block_id' : appeal_data.block_id,
            'block_name' : appeal_data.block_name,
            'unit_id' : appeal_data.unit_id,
            'unit_name' : appeal_data.unit_name,
            'issue_time' : this.ambil_tanggal(appeal_data.issue_time),
            'appeal_status' : appeal_data.appeal_status
          }
        })
        if (this.appealData) {
          // console.log("cor");
          
        }
      } 
    });
  }

  navigateToAppealForm(appealData: any) {
    this.router.navigate(['/appeal-form'], {
      state: {
        appealData: appealData
      }
    });
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

}
