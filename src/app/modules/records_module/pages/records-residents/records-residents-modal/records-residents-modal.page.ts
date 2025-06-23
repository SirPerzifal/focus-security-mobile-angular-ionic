import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

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
    private clientMainService: ClientMainService,
    private toastController: ToastController,
    public functionMain: FunctionMainService
  ) {
    this.nric_resident = this.navParams.get('nric_resident')
  }

  nric_resident = ''
  onNricInput(event: any) {
    this.nric_resident = this.functionMain.nricChange(event.target.value)
  }

  ngOnInit() {
    this.loadProject()
    this.loadOfficer()
    const closeModalOnBack = () => {
      this.modalController.dismiss(false);
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack)
  }

  url = '/vms/post/employee_nric'

  loadProject() {
    this.functionMain.vmsPreferences().then(value => {
      this.project_config = value.config
    })
  }
  project_config: any = {}

  onSubmit() {
    let errMsg = ''
    if (!this.nric_resident) {
      errMsg += 'You must provide your NRIC! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger');
    } else {
      let params = {
        nric: this.nric_resident,
        menu: `Record > ${this.project_config.is_industrial ? 'Employees' : 'Residents'}`
      }
      console.log(params)
      if (this.nric_resident != '') {
        this.clientMainService.getApi(params, this.url ).subscribe({
          next: (results) => {
            console.log(results)
            if (results.result.status_code === 200) {
              this.functionMain.presentToast(results.result.status_description, 'danger');
              setTimeout(() => {
                this.router.navigate(['/records-residents'], {state: {nric: this.nric_resident}})
                this.modalController.dismiss(true)
              }, 500);
            } else if (results.result.status_code === 401) {
              this.functionMain.presentToast(results.result.status_description, 'danger');
            } else {
              this.functionMain.presentToast('An error occurred while trying to record this activity!', 'danger');
            }
          },
          error: (error) => {
            this.functionMain.presentToast('An error occurred while trying to record this activity!', 'danger');
            console.error(error);
          }
        });
      } else {
        this.functionMain.presentToast('Please fill the NRIC!', 'danger')
      }
    }
  }

  onCancel() {
    this.modalController.dismiss(false);
  }

  Officer: any[] = []

  loadOfficer() {
    // this.clientMainService.getApi([], '/vms/get/issuing_officer' ).subscribe({
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
