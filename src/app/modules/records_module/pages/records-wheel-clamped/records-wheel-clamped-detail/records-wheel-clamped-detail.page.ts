import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertModalPage } from 'src/app/modules/alert_module/pages/alert-modal/alert-modal.page';
import { OvernightParkingModalPage } from 'src/app/modules/overnight_parking_list_module/pages/overnight-parking-modal/overnight-parking-modal.page';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-records-wheel-clamped-detail',
  templateUrl: './records-wheel-clamped-detail.page.html',
  styleUrls: ['./records-wheel-clamped-detail.page.scss'],
})
export class RecordsWheelClampedDetailPage implements OnInit {

  vehicle: any = {};
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private modalController: ModalController,
    private alertController: AlertController,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
    private webRtcService: WebRtcService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any[]};
    if (state) {
      this.vehicle = state.vehicle
      this.hideCallEmployee = this.vehicle.industrial_host_id || this.vehicle.unit_id || (this.vehicle.industrial_host_ids && this.vehicle.industrial_host_ids.length > 0)
    } 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadProjectName()
      this.pageType = params['type']
      this.params = params
    })
  }
  hideCallEmployee= false

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  project_id = 0
  project_config: any = []

  returnFalse(data: any){
    return data ? data : '-'
  }

  params: any
  pageType = 'wheel_clamp'

  vehicle_number='';
  visitor_name = 'Jack';
  offence_no = 'RR/WC/24122024/001'
  name = 'Richard'
  contact_no = '+65 8192 022'
  issue_date = ''
  entry_time = '23/12/2024 11:00PM'
  entry_type = 'VISITOR'
  block = 'BLOCK 1'
  unit = 'UNIT 0101'
  reason = 'ILLEGAL PARKING'
  officer = 'Aiden'

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }
  
  onPaymentClick() {
    this.router.navigate(['records-wheel-clamped-payment'], {
      state: {
        vehicle: this.vehicle
      },
      queryParams: this.params
    });
  }

  onHistoryClick() {
    this.router.navigate(['records-warning-history'], {
      state: {
        vehicle: this.vehicle
      },
      queryParams: this.params
    });
  }

  async presentModal(issue: string = 'wheel_clamp', vehicle: any = []) {
    console.log("TRY OPEN MODAL")
    const modal = await this.modalController.create({
      component: OvernightParkingModalPage,
      cssClass: 'record-modal' ,
      componentProps: {
        issue: issue == 'second_warning' ? 'wheel_clamp' : 'first_warning',
        vehicle: vehicle,
        alert: true
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
        if (result.data) {
          console.log("SUCCEED")
          this.router.navigate(['records-wheel-clamped'], {
            queryParams: this.params
          });
        }
      }
    });

    return await modal.present();
  }

  public async showCheckoutAlert(id: number, type: string) {
    if (type == 'release') {
      this.presentModalRelease(id, 'release', this.vehicle)
    } else {
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
      })
      await alertButtons.present();
    }
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
            this.router.navigate(['/records-wheel-clamped'], {queryParams: this.params}) 
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

  callResident(record:any){
    if (this.project_config.is_industrial) {
      this.webRtcService.createOffer(false, record.industrial_host_id, false, false);
    } else {
      this.webRtcService.createOffer(false, false, record.unit_id, false);
    }
  }

  async presentModalRelease(id: number, type: string, vehicle: any) {
    const modal = await this.modalController.create({
      component: AlertModalPage,
      cssClass: 'nric-scan-modal',
      componentProps: {
        id: id,
        type: type
      }
  
    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    modal.onDidDismiss().then((result) => {
      if (result) {
        if(result.data){
          this.router.navigate(['/records-wheel-clamped'], {queryParams: this.params}) 
          this.functionMain.presentToast(`Successfully release vehicle!`, 'success');
        }
      }
    });

    return await modal.present();
  }
}
