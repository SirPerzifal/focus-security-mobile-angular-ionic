import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OvernightParkingModalPage } from 'src/app/modules/overnight_parking_list_module/pages/overnight-parking-modal/overnight-parking-modal.page';

@Component({
  selector: 'app-records-wheel-clamped-detail',
  templateUrl: './records-wheel-clamped-detail.page.html',
  styleUrls: ['./records-wheel-clamped-detail.page.scss'],
})
export class RecordsWheelClampedDetailPage implements OnInit {

  vehicle: any = {};
  issue_time = ''

  constructor(private router: Router, private route: ActivatedRoute, private modalController: ModalController) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any[]};
    if (state) {
      this.vehicle = state.vehicle
      this.issue_time = this.vehicle.issue_time.split(' ')[1]
    } 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
    })
  }

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
  // issue_time = '07:30 AM'
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
      cssClass: issue == 'second_warning' ? 'record-modal' : 'record-modal-notice',
      componentProps: {
        issue: issue == 'second_warning' ? 'wheel_clamp' : 'first_warning',
        vehicle: vehicle,
        alert: true
      }

    });

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
}
