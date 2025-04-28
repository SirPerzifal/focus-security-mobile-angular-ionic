import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SearchNricConfirmationPage } from 'src/app/modules/resident_car_list_module/pages/search-nric-confirmation/search-nric-confirmation.page';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-records-blacklist-detail',
  templateUrl: './records-blacklist-detail.page.html',
  styleUrls: ['./records-blacklist-detail.page.scss'],
})
export class RecordsBlacklistDetailPage implements OnInit {

  record: any = {};
  issue_time = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public functionMain: FunctionMainService,
    private mainVmsService: MainVmsService,
    private alertController: AlertController,
    private modalController: ModalController,
    private webRtcService: WebRtcService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any[] };
    if (state) {
      this.record = state.record
      this.ban_image = `data:image/png;base64,${this.record.ban_image}`
      console.log(this.record)
    }
  }

  ngOnInit() {
    this.loadProjectName()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  ban_image = ''

  params: any
  pageType = 'wheel_clamp'

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

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_name = value.project_name.toUpperCase()
      this.project_config = value.config
    })
  }

  project_name = ''
  project_config: any = []

  async liftBanProc() {
    console.log("TRY OPEN MODAL")
    const modal = await this.modalController.create({
      component: SearchNricConfirmationPage,
      cssClass: 'nric-confirmation-modal',

    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    await modal.present();
    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if (result.data) {
          this.mainVmsService.getApi({ id: this.record.id }, '/vms/post/lift_ban').subscribe({
            next: (results) => {
              console.log(results)
              if (results.result.response_status === 200) {
                this.functionMain.presentToast('Successfully lifted the ban!', 'success');
                this.onBackMove()
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
      }
    });
  }

  onBackMove() {
    this.router.navigate(['/records-blacklist'], { queryParams: { reload: true } })
  }

  callResident(){
    if(this.project_config.is_industrial){
      this.webRtcService.createOffer(false, this.record.industrial_host_id[0], false, false);
    }else{
      this.webRtcService.createOffer(false, false, this.record.unit_id, false);
    }
  }

  callMA(){
    this.webRtcService.createOffer(false, )
  }

  srcImg= "assets/img/SCDF.png"
}
