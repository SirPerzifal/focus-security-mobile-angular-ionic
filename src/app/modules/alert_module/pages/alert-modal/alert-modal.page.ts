import { Component, OnInit } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.page.html',
  styleUrls: ['./alert-modal.page.scss'],
})
export class AlertModalPage implements OnInit {

  constructor(
    private functionMain: FunctionMainService, 
    private modalController: ModalController, 
    private mainVmsService: MainVmsService, 
    private navParams: NavParams,
    private alertController: AlertController) 
  {
    this.is_search_barcode = this.navParams.get('is_search_barcode')
    if ( this.is_search_barcode ) {
      this.upload_text = 'UPLOAD IMAGE'
    } else {
      this.id = this.navParams.get('id')
      this.type = this.navParams.get('type')
      this.vehicle = this.navParams.get('vehicle')
      this.upload_text = 'UPLOAD VEHICLE IMAGE'
    }
    
  }

  id = 0
  type = 'checkout'
  vehicle: any
  upload_text = 'UPLOAD VEHICLE IMAGE'
  is_search_barcode = false

  ngOnInit() {
  }

  fileInput: any
  showImage = ''
  fileName = ''

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      this.fileInput = image.base64String;
      this.functionMain.presentToast('Image loaded!', 'success');
      
      this.showImage = `data:image/png;base64,${this.fileInput}`
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }
  
      this.functionMain.presentToast('Error taking photo', 'danger')
      console.error(error)
    }
    
  };

  base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
  

  onCancel() {
    this.modalController.dismiss(false);
  }

  onSubmit() {
    console.log("SUBMITTED");
    this.modalController.dismiss(true);
  }

  onDeleteImage(){
    this.showImage = ''
    this.fileInput = ''
  }

  paymentSubmit() {
    let params = {
      offence_id: this.id,
      is_checkout: this.type == 'checkout',
      is_release: this.type != 'checkout',
      before_image: this.beforeClampImageFile,
      after_image: this.afterClampImageFile
    }
    console.log(params)
    this.mainVmsService.getApi(params, '/vms/post/checkout_or_release_offence').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMain.presentToast(`Successfully ${this.type} vehicle!`, 'success');
        } else {
          this.functionMain.presentToast(`Failed to ${this.type} vehicle!`, 'danger');
        }
        this.modalController.dismiss(true);
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while submitting coach data!', 'danger');
        console.error(error);
      }
    });
  }

  public async showAlertButtons() {
    const alertButtons = await this.alertController.create({
      cssClass: 'checkout-alert',
      header: `Are you sure you want to ${this.type} this vehicle?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.paymentSubmit()
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
    let errMsg = ''
    if (!this.beforeClampImageFile) {
      errMsg += 'Before clamp image is required! \n'
    }
    if (!this.afterClampImageFile) {
      errMsg += 'After clamp image is required for wheel clamp issues! \n'
    }
    if (errMsg == '') {
      await alertButtons.present();
    } else {
      this.functionMain.presentToast(errMsg, 'danger')
    }
    
  }

  imageSrc: string | ArrayBuffer | null = null;
  barcodeResult: string | null = null;

  async searchImageId(id: string) {
    console.log(id);
    
    this.mainVmsService.getApi({id: id}, '/vms/get/search_expected_visitor').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.modalController.dismiss({scan: results.result.result[0]})
        } else {
          this.functionMain.presentToast('Expected visitor not found!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while searching the expected visitor!', 'danger');
        console.error(error);
      }
    });
  }

  beforeClampImageFile: string = '';
  afterClampImageFile: string = '';

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

}
