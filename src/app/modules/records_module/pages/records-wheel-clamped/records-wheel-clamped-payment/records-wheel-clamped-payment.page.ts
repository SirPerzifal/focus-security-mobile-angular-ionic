import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-records-wheel-clamped-payment',
  templateUrl: './records-wheel-clamped-payment.page.html',
  styleUrls: ['./records-wheel-clamped-payment.page.scss'],
})
export class RecordsWheelClampedPaymentPage implements OnInit {

  vehicle: any = {}

  constructor(private route: ActivatedRoute, private router: Router, private clientMainService: ClientMainService, private toastController: ToastController, public functionMain: FunctionMainService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any, alert: boolean, search: boolean, overnight: boolean };
    if (state) {
      this.vehicle = state.vehicle
      // this.qr_code = `data:image/png;base64,${state.vehicle.payment_qr_code}`
      if (state.alert) {
        this.alert = state.alert
        this.home_url = 'alert-main'
        this.back_url = '/alert-main'
        this.params = {reset: true}
      }
      if (state.search) {
        this.search = state.search
        this.home_url = 'resident-car-list'
        this.back_url = '/resident-car-list'
      }
      if (state.overnight) {
        this.overnight = state.overnight
        this.home_url = 'overnight-parking-detail'
        this.back_url = '/overnight-parking-detail'
      }
    }
  }

  ngOnInit() {
    console.log(this.vehicle)
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  params: any
  pageType = 'wheel_clamp'

  alert = false
  search = false
  overnight = false
  home_url = 'records-wheel-clamped-detail'
  back_url = '/records-wheel-clamped-detail'
  qr_code = ''

  vehicle_number = '';
  offence_no = ''
  charges = 'S$120.00'
  gst = 'S$9.60'
  total = 'S$129.60'

  fileInput: any

  // onFileUpload(): void {
  //   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // }

  onFileChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.fileInput = base64.split(',')[1]
        this.paymentSubmit()
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
    }
  }

  paymentSubmit() {
    this.clientMainService.getApi({ offence_id: this.vehicle.id, receipt_image: this.fileInput }, '/vms/post/offence_upload_receipt').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          console.log(results)
          this.presentToast('Successfully upload receipt!', 'success');
          if (this.home_url == 'records-wheel-clamped-detail') {
            this.vehicle.is_pay = true
            this.router.navigate([this.home_url], { state: {vehicle: this.vehicle}, queryParams: { type: 'wheel_clamp'} });
          } else {
            this.router.navigate([this.home_url], this.alert ? { queryParams: { alert: true} } : ( this.search ? { queryParams: { vehicle_number: this.vehicle.vehicle_number} } :( this.overnight ? { queryParams: { reload: 'true'} } : { queryParams: { type: 'wheel_clamp'} })) );
          }
        } else {
        }
      },
      error: (error) => {
        this.presentToast('Failed to load vehicle data', 'danger');
        console.error(error);
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
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

  imageFile: any;
  showImage = ''

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
      this.presentToast('Receipt loaded!', 'success');
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }
  
      this.presentToast('Error taking photo', 'danger');
    }
    
  };

  onDeleteImage(){
    this.showImage = ''
    this.fileInput = ''
  }


}
