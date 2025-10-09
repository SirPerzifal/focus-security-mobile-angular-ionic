import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { ModalShowQRAccessDoorComponent } from 'src/app/shared/resident-components/modal-show-qr-access-door/modal-show-qr-access-door.component';

@Component({
  selector: 'app-door-access-main',
  templateUrl: './door-access-main.page.html',
  styleUrls: ['./door-access-main.page.scss'],
})
export class DoorAccessMainPage implements OnInit {

  isLoading = true;
  userRole: string = '';

  intercomDoorAccessList: any[] = [];

  constructor(
    private functionMain: FunctionMainService,
    private platform: Platform,
    private mainApi: MainApiResidentService,
    private router: Router,
    private modalController: ModalController
  ) {}

  handleRefresh(event: any) {
    setTimeout(() => {
      this.isLoading = true;
      this.loadIntercomDoorAccess();
      event.target.complete();
    }, 1000)
  }

  onClickNav(event: any) {
    if (event[1] === 'home-page') {
      this.router.navigate(['resident-home-page']);
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadIntercomDoorAccess();
  }

  ionViewWillLeave() {
  }

  onChangeTypeOfUser(event: any) {
    this.userRole = event;
  }

  loadIntercomDoorAccess() {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/list_of_the_intercom_door').subscribe((response: any) => {
      if (response.result && response.result.response_code === 200) {
        this.isLoading = false;
        this.intercomDoorAccessList = response.result.data;
      } else {
        this.functionMain.presentToast('Failed to load data', 'danger');
      }
    })
  }

  async onClickDoor(door: any) {
    this.mainApi.endpointMainProcess({
      intercom_door_id: door.id
    }, 'get/barcode_access_intercom_door').subscribe(async (response: any) => {
      if (response.result && response.result.response_code === 200) {
        this.isLoading = false;
        const QRResult = response.result.barcode;
        const modal = await this.modalController.create({
          component: ModalShowQRAccessDoorComponent,
          backdropDismiss: false,
          cssClass: 'show-qr-access-door-modal',
          componentProps: {
            QRResult: QRResult,
            closeModalTime: response.result.expiry_time_barcode * 1000
          }
      
        });
    
        modal.onDidDismiss().then((result) => {
          if (result) {
            console.log(result.data);
          }
        });
    
        return await modal.present();
      } else {
        this.functionMain.presentToast('Failed to load intercom door', 'danger');
      }
    })
  }

}
