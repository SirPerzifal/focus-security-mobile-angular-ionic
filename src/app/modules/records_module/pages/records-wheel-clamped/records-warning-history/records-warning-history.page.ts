import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { RecordsAlertNextPage } from '../records-alert-next/records-alert-next.page';

@Component({
  selector: 'app-records-warning-history',
  templateUrl: './records-warning-history.page.html',
  styleUrls: ['./records-warning-history.page.scss'],
})
export class RecordsWarningHistoryPage implements OnInit {

  vehicle: any = {}

  constructor(private route: ActivatedRoute, private router: Router, public functionMain: FunctionMainService,
    private mainVmsService: MainVmsService,
    private modalController: ModalController,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any};
    if (state) {
      this.vehicle = state.vehicle
      this.vehicle_number = state.vehicle.vehicle_number
      this.loadProjectName().then(() => {
        this.getOffenceCount()
      })
    } 
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
    })
    console.log(this.vehicle)
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
    })
  }

  project_id = 0

  params: any
  pageType = 'wheel_clamp'


  qr_code = ''

  vehicle_number='';
  first_issued = '4'
  second_issued = '4'
  wheel_clamp = '4'
  last_offence = ''

  onClickDetails() {
    this.router.navigate(['records-warning-detail'], {
      state: {
        vehicle: this.vehicle,
        offence_detail: this.offence_detail
      },
      queryParams: this.params
    });
  }

  async onBlacklist() {
    if(this.vehicle.vehicle_number == '' && this.vehicle.contact_number == ''){
      this.functionMain.presentToast("Unable to ban data that is missing a vehicle number and contact number!")
    } else {
      this.router.navigate(['/records-blacklist-form'], {
        state: {
          record: this.vehicle,
          is_ban_record: false,
          type: this.pageType,
          is_ban_notice: true,
        }
      })
    }
  }

  offence_detail: any = []

  getOffenceCount() {
    this.mainVmsService.getApi({vehicle_number: this.vehicle_number, project_id: this.project_id}, '/vms/get/offenses_count_based_on_vehicle_number').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.offence_detail = results.result.response_result
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while fetching offence count!', 'danger');
        console.error(error);
      }
    });
  }

  openModal(){
    console.log(this.vehicle)
    this.functionMain.openAlertModal(
      {
        id: this.vehicle.id,
        vehicle_number: this.vehicle.vehicle_number,
        contact_number: this.vehicle.contact_number
      }, true)
  }

}
