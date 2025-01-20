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
    this.id = this.navParams.get('id')
    this.type = this.navParams.get('type')
    this.vehicle = this.navParams.get('vehicle')
  }

  id = 0
  type = 'checkout'
  vehicle: any

  ngOnInit() {
    this.takePicture()
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
      console.log(image)
      this.fileInput = image.base64String;

      this.showImage = `data:image/png;base64,${this.fileInput}`
      this.functionMain.presentToast('Image loaded!', 'success');
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }
  
      this.functionMain.presentToast('Error taking photo', 'danger')
    }
    
  };

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
      is_release: this.type != 'checkout'
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
    await alertButtons.present();
  }


}
