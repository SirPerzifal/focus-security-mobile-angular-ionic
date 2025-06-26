import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-wheel-clamp',
  templateUrl: './client-wheel-clamp.page.html',
  styleUrls: ['./client-wheel-clamp.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class ClientWheelClampPage implements OnInit {

  constructor(
    private offensesService: OffensesService,
    public functionMain: FunctionMainService,
    private router: Router,
    private clientMainService: ClientMainService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadRecordsWheelClamp()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isMain = true
  isPayment = false
  wheelClampList: any[] = []

  isLoading = false
  async loadRecordsWheelClamp() {
    this.isLoading = true
    this.offensesService.getOfffenses('wheel_clamp', true).subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        if (results.result.response_code === 200) {
          if (results.result.response_result.length > 0) {
            this.wheelClampList = results.result.response_result
          } else {
          }
        } else {
          this.functionMain.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        }
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
      }
    });
  }

  vehicle: any = []

  onPaymentClick(record: any) {
    console.log(record)
    this.vehicle = record
    this.isMain = false
    this.qr_code = `data:image/png;base64,${record.payment_qr_code}`
    setTimeout(() => {
      this.isPayment = true
    }, 300)
  }

  async onBypass(record: any) {
    const alertButtons = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: `Are you sure you want to bypass this vehicle?`,
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => {
            this.openBypassModal(record.id)
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  isModalReasonBanOpen = false
  bypass_id = 0
  bypassRemarks = ''

  openBypassModal(id: number) {
    this.bypass_id = id
    this.isModalReasonBanOpen = true
    this.bypassRemarks = ''
  }

  closeBypassModal() {
    this.bypass_id = 0
    this.isModalReasonBanOpen = false
    this.bypassRemarks = ''
  }

  bypassOffence() {
    this.clientMainService.getApi({ offence_id: this.bypass_id, bypass_remarks: this.bypassRemarks }, '/client/post/bypass_offence').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          console.log(results)
          this.closeBypassModal()
          this.functionMain.presentToast('Successfully bypass offence!', 'success');
          this.loadRecordsWheelClamp()
        } else {
          this.functionMain.presentToast('An error occurred while trying to bypass this data!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to bypass this data!', 'danger');
        console.error(error);
      }
    });
  }

  onBack() {
    if (this.isMain) {
      this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
    } else {
      this.onDeleteImage()
      this.qr_code = ''
      this.isPayment = false
      setTimeout(() => {
        this.isMain = true
      }, 300)
    }

  }

  qr_code = ''
  showImage = ''
  fileInput: any
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64
      });
      console.log(image)
      this.fileInput = image.base64String;

      this.showImage = `data:image/png;base64,${this.fileInput}`
      this.functionMain.presentToast('Receipt loaded!', 'success');
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }
  
      this.functionMain.presentToast('Error taking photo', 'danger');
    }
    
  };

  paymentSubmit() {
    this.clientMainService.getApi({ offence_id: this.vehicle.id, receipt_image: this.fileInput }, '/vms/post/offence_upload_receipt').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          console.log(results)
          this.functionMain.presentToast('Successfully upload receipt!', 'success');
          this.loadRecordsWheelClamp()
          this.onBack()
        } else {
          this.functionMain.presentToast('Failed to load vehicle data', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Failed to load vehicle data', 'danger');
        console.error(error);
      }
    });
  }

  onDeleteImage(){
    this.showImage = ''
    this.fileInput = ''
  }

  handleRefresh(event: any) {
    this.loadRecordsWheelClamp().then(() => event.target.complete())
  }
}
