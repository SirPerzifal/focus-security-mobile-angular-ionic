import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { OvernightParkingModalPage } from '../overnight-parking-modal/overnight-parking-modal.page';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { Subscription } from 'rxjs';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-overnight-parking-detail',
  templateUrl: './overnight-parking-detail.page.html',
  styleUrls: ['./overnight-parking-detail.page.scss'],
})
export class OvernightParkingDetailPage implements OnInit {

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private alertController: AlertController,
    private offensesService: OffensesService,
    private modalController: ModalController,
    private webRtcService: WebRtcService) {
      const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any};
    if (state) {
      this.vehicle = state.vehicle
      this.loadProjectName()
      
    } 
     }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params ) {
        if (params['reload']){
          this.loadProjectName()
        }
      }
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
      this.getOffence(this.vehicle.vehicle_numbers, this.vehicle.id, this.project_id)
    })
  }

  project_id = 0
  project_config: any = []

  vehicle: any
  vehicleDetail: any = []
  offence: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // async presentModal(issue: string= 'wheel_clamp', vehicle: any = this.vehicle) {
  //   const modal = await this.modalController.create({
  //     component: OvernightParkingModalPage,
  //     cssClass: issue == 'wheel_clamp' ? 'record-modal' : 'record-modal-notice',
  //     componentProps: {
  //       issue: issue,
  //       vehicle: vehicle
  //     }
  
  //   });

  //   modal.onDidDismiss().then((result) => {
  //     if (result) {
  //       console.log(result.data)
  //       if(result.data){
  //         console.log("SUCCEED")
  //       }
  //     }
  //   });

  //   return await modal.present();
  // }

  async presentModal(issue: string= 'wheel_clamp', vehicle: any = this.vehicleDetail) {
    console.log(vehicle)
    const modal = await this.modalController.create({
      component: OvernightParkingModalPage,
      cssClass: 'record-modal',
      componentProps: {
        issue: issue,
        vehicle: vehicle,
        alert: true,
        search: true,
        no_nric: true,
      }
  
    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if(result.data){
          this.loadProjectName()
          console.log("SUCCEED")
        }
      }
    });

    return await modal.present();
  }

  getOffence(vehicle_number: string, id: any, project_id: number) {
    this.clientMainService.getApi({vehicle_number: vehicle_number, id: id, project_id: project_id}, '/vms/get/overnight_parking_list_detail' ).subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.vehicleDetail = results.result.result[0]
        } 
        // this.isLoading = false;
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading overnight parking data offence!', 'danger');
        console.error(error);
        // this.isLoading = false;
      }
    });
  }

  public async showCheckoutAlert(id: number, type: string) {
    const alertButtons = await this.alertController.create({
      cssClass: 'checkout-alert',
      header: `Are you sure you want to ${type} this vehicle?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.onCheckOut(id, type)
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  onCheckOut(id: number, type: string) {
    let params = {
      offence_id: id,
      is_checkout: type == 'checkout',
      is_release: type != 'checkout',
      is_unregistered: false,
    }
    if (true) {
      this.clientMainService.getApi(params, '/vms/post/checkout_or_release_offence').subscribe({
        next: (results) => {
          if (results.result.response_code === 200) {
            this.loadProjectName()
            this.functionMain.presentToast(`Successfully ${type} vehicle!`, 'success');

          } else {
            this.functionMain.presentToast(`Failed to ${type} vehicle!`, 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while processing function!', 'danger');
          console.error(error);
        }
      });
    }
    
  }

  wheelClamp: any = []

  loadRecordsWheelClampById(id: any){
    this.offensesService.getOfffenses('wheel_clamp', true, parseInt(id)).subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.response_code === 200) {
          this.onPaymentClick(results.result.response_result[results.result.response_result.length - 1])
        } else {
        }

        // this.isLoading = false;
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
        // this.isLoading = false;
      }
    });
  }

  onPaymentClick(alert: any = []) {
    this.router.navigate(['records-wheel-clamped-payment'], {
      state: {
        vehicle: alert,
        overnight: true,
      },
    });
  }

  callResident(record:any){
    record.requestor_contact_number = record.requestor_phone;
    // console.log("overnigth parking ==========", record);
    // this.webRtcService.createOffer(record);
  }


}
