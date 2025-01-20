import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-records-residents-modal',
  templateUrl: './records-residents-modal.page.html',
  styleUrls: ['./records-residents-modal.page.scss'],
})
export class RecordsResidentsModalPage implements OnInit {

  constructor(
    private router: Router, 
    private modalController: ModalController, 
    private navParams: NavParams, 
    private mainVmsService: MainVmsService,
    private toastController: ToastController
  ) {
    this.nric_resident = this.navParams.get('nric_resident')
  }

  nric_resident = ''

  ngOnInit() {
    this.loadOfficer()
  }

  url = '/vms/create/offenses'

  onSubmit() {
    let errMsg = ''
    if (!this.nric_resident) {
      errMsg += 'You must provide your NRIC! \n'
    }
    if (errMsg) {
      this.presentToast(errMsg, 'danger');
    } else {
      let params = {}
      console.log(params)
      if (this.nric_resident == 'S11111111') {
        this.router.navigate(['/records-residents'], {state: {nric: this.nric_resident}})
        this.modalController.dismiss(true);
      } else {
        this.presentToast('FAILED!', 'danger')
      }
      // this.mainVmsService.getApi(params, this.url ).subscribe({
      //   next: (results) => {
      //     console.log(results)
      //     if (results.result.response_code === 200) {
      //       this.presentToast('Success!', 'success');
      //       this.modalController.dismiss(true);
      //     } else {
      //       this.presentToast('Failed!', 'danger');
      //     }
  
      //     // this.isLoading = false;
      //   },
      //   error: (error) => {
      //     this.presentToast('Failed!', 'danger');
      //     console.error(error);
      //   }
      // });
    }
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

  onCancel() {
    this.modalController.dismiss(false);
  }

  Officer: any[] = []

  loadOfficer() {
    // this.mainVmsService.getApi([], '/vms/get/issuing_officer' ).subscribe({
    //   next: (results) => {
    //     if (results.result.response_code === 200) {
    //       console.log(results.result.response_result)
    //       this.Officer = results.result.response_result
    //     } else {
    //       this.presentToast('An error occurred while loading overnight parking data!', 'danger');
    //     }
    //   },
    //   error: (error) => {
    //     this.presentToast('An error occurred while loading overnight parking data!', 'danger');
    //     console.error(error);
    //   }
    // });
    this.Officer = [
      {id: 'ERIC', name: 'ERIC'}
    ]
  }

}
