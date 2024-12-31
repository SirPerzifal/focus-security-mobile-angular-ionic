import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { OvernightParkingListPage } from '../overnight-parking-list/overnight-parking-list.page';

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
    private mainVmsService: MainVmsService,
    private toastController: ToastController
  ) {
    this.issue = this.navParams.get('issue')
    this.vehicle = this.navParams.get('vehicle')
    if ( this.issue == 'wheel_clamped') {
      this.selectedNotice = 'wheel_clamp'
    }
    console.log(this.issue)
    console.log(this.vehicle)
  }

  vehicle: any
  issue = 'wheel_clamped'

  ngOnInit() {
  }

  selectedNotice = ''
  beforeClampImageFile: string = '';
  afterClampImageFile: string = '';
  imageBeforeClampInput: string = '';
  imageAfterClampInput: string = '';
  issueOfficer = ''
  reason = ''

  onBeforeClampImageFileSelected(file: File): void {
    let data = file;
    if (data){
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.beforeClampImageFile = base64.split(',')[1]
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } 
  }

  onAfterClampImageFileSelected(file: File) {
    let data = file;
    if (data){
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.afterClampImageFile = base64.split(',')[1]
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } 
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
      console.log(this.afterClampImageFile, this.imageAfterClampInput, this.beforeClampImageFile, this.imageBeforeClampInput, this.selectedNotice, this.issueOfficer);
      let params = {
        vehicle_number: this.vehicle.vehicle_numbers, 
        visitor_name: this.vehicle.visitor_name, 
        block_id: this.vehicle.block_id, 
        unit_id: this.vehicle.unit_id, 
        contact_number: this.vehicle.contact_number,
        type_notice: this.selectedNotice, 
        issuing_officer_name: this.issueOfficer,
        type: 'Drive In',
        reason: this.reason,
        notice_image: this.issue != 'wheel_clamp' ? this.beforeClampImageFile : false,
        before_clamp_image: this.issue == 'wheel_clamp' ? this.beforeClampImageFile : false,
        after_clamp_image: this.issue == 'wheel_clamp' ? this.afterClampImageFile : false,
      }
      console.log(params)
      this.mainVmsService.getApi(params, '/vms/create/offenses' ).subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.presentToast('Issue notice successfully submitted!', 'success');
            this.modalController.dismiss(true);
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

}
