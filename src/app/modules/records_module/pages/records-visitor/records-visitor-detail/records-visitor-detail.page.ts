import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { RecordsBlacklistFormPage } from '../../records-blacklist/records-blacklist-form/records-blacklist-form.page';
import { AlertController, ModalController } from '@ionic/angular';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { SearchNricConfirmationPage } from 'src/app/modules/resident_car_list_module/pages/search-nric-confirmation/search-nric-confirmation.page';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-records-visitor-detail',
  templateUrl: './records-visitor-detail.page.html',
  styleUrls: ['./records-visitor-detail.page.scss'],
})
export class RecordsVisitorDetailPage implements OnInit {

  record: any = {};
  issue_time = ''

  constructor(private router: Router, private route: ActivatedRoute, public functionMain: FunctionMainService, private modalController: ModalController, private clientMainService: ClientMainService, private alertController: AlertController, private webrtc: WebRtcService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { logs: any[]};
    if (state) {
      this.loadProjectName().then(() => {
        this.getBlacklist()
        this.record = state.logs
      })
    } 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
      this.loadProjectName().then(() => {
        this.getBlacklist()
      })
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  project_id = 0
  project_config: any = []

  returnNone(params: string){
    return params ? params : '-'
  }

  params: any
  pageType = 'visitor'

  async onBlacklist() {
    if((!this.record.vehicle_number || this.record.vehicle_number == '') && this.record.contact_number == ''){
      this.functionMain.presentToast("Unable to ban data that is missing a vehicle number and contact number!", 'warning')
    } else {
      this.router.navigate(['/records-blacklist-form'], {
        state: {
          record: this.record,
          is_ban_record: true,
          type: this.pageType,
          is_ban_notice: false,
        }
      })
    }
  }

  blacklist: any = []
  getBlacklist(){
    this.clientMainService.getApi({name: this.record.visitor_name ? this.record.visitor_name : '', vehicle_number: this.record.vehicle_number ? this.record.vehicle_number : '', project_id: this.project_id}, '/vms/get/visitor_ban_by_data').subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.response_code === 200) {
          this.blacklist = results.result.result
        } else {
          this.blacklist = []
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while searching this visitor blacklist history!', 'danger');
        console.error(error);
        // this.isLoading = false;
      }
    });
  }

  async onLiftBan() {
    const alertButtons = await this.alertController.create({
      cssClass: 'checkout-alert',
      header: `Are you sure you want to lift the ban?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.liftBanProc()
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

  async liftBanProc() {
    this.clientMainService.getApi({ id: this.blacklist[0].id }, '/vms/post/lift_ban').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_status === 200) {
          this.functionMain.presentToast('Successfully lifted the ban!', 'success');
          this.getBlacklist()
        } else {
          this.functionMain.presentToast('An error occurred while attempting to lift the ban!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while attempting to lift the ban!', 'danger');
        console.error(error);
      }
    });
  }

  async callResident(){
    console.log("tirgger olso", this.record);
    if (this.project_config.is_industrial){
      this.webrtc.createOffer(false, this.record.industrial_host_id, false, false);
    }else{
      this.webrtc.createOffer(false, this.record.requestor_id, this.record.unit_id, false);
    }
  }

  handleRefresh(event: any) {
    this.getBlacklist()
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

}
