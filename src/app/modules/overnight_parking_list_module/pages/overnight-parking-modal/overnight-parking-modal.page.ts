import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { OvernightParkingListPage } from '../overnight-parking-list/overnight-parking-list.page';
import { SearchNricConfirmationPage } from 'src/app/modules/resident_car_list_module/pages/search-nric-confirmation/search-nric-confirmation.page';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
@Component({
  selector: 'app-overnight-parking-modal',
  templateUrl: './overnight-parking-modal.page.html',
  styleUrls: ['./overnight-parking-modal.page.scss'],
})
export class OvernightParkingModalPage implements OnInit {

  constructor(
    private router: Router, 
    private modalController: ModalController, 
    private navParams: NavParams, 
    private clientMainService: ClientMainService,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef,
    private functionMain: FunctionMainService,
  ) {}

  alert: boolean = false
  no_nric: boolean = false
  search: boolean = false
  vehicle: any
  issue = 'wheel_clamp'
  isReadonly = false
  isReadonlyIssue = false

  ngOnInit() {
    this.loadProjectName()
    this.issue = this.navParams.get('issue')
    this.no_nric = this.navParams.get('no_nric')
    this.vehicle = this.navParams.get('vehicle')
    this.alert = this.navParams.get('alert') ? true : false
    if (this.alert && this.issue == 'none') {
      this.selectedNotice = 'first_warning'
      this.url = '/vms/post/offenses'
    }
    if (this.alert && this.issue == 'first_warning') {
      this.selectedNotice = 'second_warning'
      this.url = '/vms/post/issue_second_warning'
    }
    if ( this.issue == 'wheel_clamp') {
      this.selectedNotice = 'wheel_clamp'
      if (this.alert){
        this.url = '/vms/post/issue_wheel_clamp'
        console.log('TOP', this.selectedNotice)
      }
    }
    if (this.alert) {
      this.isReadonly = true
      this.isReadonlyIssue = true
      this.reason = this.vehicle.reason_for_issueance
      if (this.selectedNotice == 'first_warning') {
        this.isReadonly = false
      }
    }
    if (this.search && this.issue == 'none') {
      this.alert = false
    }
    if (this.no_nric) {
      this.search = false
    }
    this.vehicle_number = this.vehicle.vehicle_numbers ? this.vehicle.vehicle_numbers : (this.vehicle.vehicle_number ? this.vehicle.vehicle_number : '')
    console.log(this.vehicle_number)
    console.log(this.issue)
    console.log(this.vehicle)
    console.log(this.alert)
    this.loadOfficer()

    const closeModalOnBack = () => {
      this.modalController.dismiss(false);
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack)
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
    })
  }

  project_id = 0
  vehicle_number = ''

  url = '/vms/post/offenses'

  selectedNotice = ''
  beforeClampImageFile: string = '';
  afterClampImageFile: string = '';
  imageBeforeClampInput: string = '';
  imageAfterClampInput: string = '';
  issueOfficer = ''
  reason = ''

  onBeforeClampImageFileSelected(file: any): void {
    if (file) {
      let data = file;
      this.beforeClampImageFile = data.image
    }
    // if (data){
    //   this.convertToBase64(data).then((base64: string) => {
    //     console.log('Base64 successed');
    //   }).catch(error => {
    //     console.error('Error converting to base64', error);
    //   });
    // } 
  }

  onAfterClampImageFileSelected(file: any) {
    if (file) {
      let data = file;
      this.afterClampImageFile = data.image
    }
    // if (data){
    //   this.convertToBase64(data).then((base64: string) => {
    //     console.log('Base64 successed');
    //     this.afterClampImageFile = base64.split(',')[1]
    //   }).catch(error => {
    //     console.error('Error converting to base64', error);
    //   });
    // } 
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }


  onSubmit() {
    let errMsg = ''
    if (this.issue == 'wheel_clamp'){
      this.selectedNotice = 'wheel_clamp'
    } else {
      if (!this.selectedNotice) {
        errMsg += 'You must select a notice! \n'
      }
    }
    if (!this.reason) {
      errMsg += 'You must provide an issue reason! \n'
    }
    if (!this.beforeClampImageFile) {
      errMsg += this.issue == 'wheel_clamp' ? 'Before clamp image is required! \n' : 'You must upload an evidence image! \n'
    }
    if (this.issue == 'wheel_clamp') {
      if (!this.afterClampImageFile) {
        errMsg += 'After clamp image is required for wheel clamp issues! \n'
      }
    }
    if (!this.issueOfficer) {
      errMsg += 'Issue officer is required! \n'
    }
    if (errMsg) {
      this.presentToast(errMsg, 'danger');
    } else {
      let params = {}
      if (this.alert){
        params = {
          offence_id: this.search || this.no_nric ? this.vehicle.offence_id : this.vehicle.id , 
          issuing_officer: this.issueOfficer,
          notice_image: this.issue != 'wheel_clamp' ? this.beforeClampImageFile : false,
          before_clamp_image: this.issue == 'wheel_clamp' ? this.beforeClampImageFile : false,
          after_clamp_image: this.issue == 'wheel_clamp' ? this.afterClampImageFile : false,
        }
      } else {
        params = {
          vehicle_number: this.vehicle.vehicle_numbers ? this.vehicle.vehicle_numbers : this.vehicle.vehicle_number, 
          visitor_name: this.vehicle.visitor_name, 
          block_id: this.search || this.no_nric ? this.vehicle.block_id[0] : this.vehicle.block_id, 
          unit_id: this.search || this.no_nric ? this.vehicle.unit_id[0] : this.vehicle.unit_id, 
          host: this.search || this.no_nric ? this.vehicle.industrial_host_id[0] : this.vehicle.industrial_host_id, 
          host_ids: this.vehicle.industrial_host_ids, 
          contact_number: this.vehicle.contact_number,
          type_notice: this.selectedNotice, 
          issuing_officer_name: this.issueOfficer,
          type: this.vehicle.entry_type ? this.vehicle.entry_type : 'Drive In',
          entry_datetime: this.vehicle.create_date ? this.vehicle.create_date : false,
          reason: this.reason,
          notice_image: this.issue != 'wheel_clamp' ? this.beforeClampImageFile : false,
          before_clamp_image: this.issue == 'wheel_clamp' ? this.beforeClampImageFile : false,
          after_clamp_image: this.issue == 'wheel_clamp' ? this.afterClampImageFile : false,
          project_id: this.project_id,
        }
      }
      console.log(params)
      this.clientMainService.getApi(params, this.url ).subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.presentToast('Issue notice successfully submitted!', 'success');
            setTimeout(() => {this.modalController.dismiss(true)}, 500);
          } else {
            this.presentToast('An error occurred while submitting issue notice!', 'danger');
          }
  
          // this.isLoading = false;
        },
        error: (error) => {
          this.presentToast('An error occurred while submitting issue notice!', 'danger');
          console.error(error);
        }
      });
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

  async presentModalNric() {
    // if (this.search){
    //   console.log("TRY OPEN MODAL")
    //   const modal = await this.modalController.create({
    //     component: SearchNricConfirmationPage,
    //     cssClass: 'nric-confirmation-modal',
  
    //   });

    //   history.pushState(null, '', location.href);

    //   const closeModalOnBack = () => {
    //     window.removeEventListener('popstate', closeModalOnBack);
    //   };
    //   window.addEventListener('popstate', closeModalOnBack);
  
    //   modal.onDidDismiss().then((result) => {
    //     if (result) {
    //       console.log(result.data)
    //       if (result.data) {
    //         this.onSubmit()
    //       }
    //     }
    //   });
  
    //   return await modal.present();
    // } else {
    this.onSubmit()
    // }
    
  }


}
