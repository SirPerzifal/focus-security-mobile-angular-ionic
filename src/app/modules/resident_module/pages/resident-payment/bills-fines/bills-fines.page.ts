import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { PaymentService } from 'src/app/service/resident/payment/payment.service';
import { fines } from 'src/models/resident/poymentModel.model';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';

declare var Stripe: any; // Declare Stripe

@Component({
  selector: 'app-bills-fines',
  templateUrl: './bills-fines.page.html',
  styleUrls: ['./bills-fines.page.scss'],
})
export class BillsFinesPage implements OnInit, OnDestroy {
  choosePaymentModal: boolean = false;

  stripe: any;
  fines: fines[] = []

  blockId: number = 0;
  unitId: number = 0;
  projectId: number = 0;

  isModalUploadReceiptOpen: boolean = false;
  selectedFileName: string = '';
  paymentid: number = 0;
  receiptBase64: string = '';
  constructor( private modalController: ModalController, private paymentService: PaymentService, private mainApiResidentService: MainApiResidentService, public functionMainService: FunctionMainService) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unitId = parseValue.unit_id; // Ambil data unit_id
        this.blockId = parseValue.block_id; // Ambil data block_id
        this.projectId = parseValue.project_id; // Ambil data project_id
        this.loadFinesData();
      }
    })
    this.stripe = Stripe('pk_test_51QpnAMEYQAqGD36Tk2M4AdoDQ6ngZVc41jB8vp88UF3XaeytrViZM1R2ax04szYUfL8vH4SOn8qi7ZS32ZXrqz0h00qJH2GoBK'); // Replace with your actual publishable key
  }

  loadFinesData() {
    this.mainApiResidentService.endpointProcess({
      unit_id: this.unitId,
      project_id: this.projectId
    }, 'get/active_fines').subscribe((response: any) => {
      // console.log(response.result)
      const finesLoaded = response.result.response_result;

      this.fines = finesLoaded.map((fine: any) => {
        const isOverdue = fine.start_date < new Date().toISOString().split('T')[0];
        return {
          id : fine.id,
          fines_references : fine.fines_references,
          fines_name : fine.fines_name,
          start_date : fine.start_date,
          total_bill : fine.total_bill,
          is_pay : fine.is_pay,
          overdue: isOverdue ? true : false, // Menentukan status overdue
          offence_data : fine.offence_data.map((offence_data: any) => {
            return {
              id : offence_data.id,
              vehicle_number : offence_data.vehicle_number,
            }
          })
        }
      })
      // console.log(this.fines);
      
    })
  }

  electricPay() {
    this.choosePaymentModal = !this.choosePaymentModal;
    this.paymentService.postPaymentIntent().subscribe(
      (response: any) => {
        const clientSecret = response.result.Intent.client_secret; // Adjust based on your API response structure
        if (clientSecret) {
          
          this.presentModal(clientSecret)
        }
      },
      (error) => {
        console.error('Error creating payment intent:', error);
      }
    );
  }

  async presentModal(clientSecret: string) {
    const modal = await this.modalController.create({
      component: ModalPaymentCustomComponent,
      cssClass: 'payment-modal',
      componentProps: {
        stripe: this.stripe,
        clientSecret: clientSecret
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        // console.log(result)
      }
    });

    return await modal.present();
  }

  payNow(event: any) {
    this.choosePaymentModal = !this.choosePaymentModal;
    // // console.log(event.paymentId);
    this.paymentid = event.paymentId;
  }

  manualPayment() {
    // // console.log("manual");
    this.choosePaymentModal = !this.choosePaymentModal;
    this.isModalUploadReceiptOpen = !this.isModalUploadReceiptOpen;
    // this.mainApiResidentService.endpointProcess({}, '').subscribe((response: any) => {
      
    // })
  }

  uploadReceipt(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedFileName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.receiptBase64 = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedFileName = ''; // Reset if no file is selected
    }
  }

  onSubmitReceipt() {
    // console.log(this.paymentid, this.receiptBase64);
    this.mainApiResidentService.endpointProcess({
      fines_id: this.paymentid,
      payment_proof: this.receiptBase64
    }, 'post/manual_pay_fines').subscribe((response: any) => {
      Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
        if (value?.value) {
          const parseValue = JSON.parse(value.value);
          this.unitId = parseValue.unit_id; // Ambil data unit_id
          this.blockId = parseValue.block_id; // Ambil data block_id
          this.projectId = parseValue.project_id; // Ambil data project_id
          this.isModalUploadReceiptOpen = !this.isModalUploadReceiptOpen;
          this.fines = [];
          this.loadFinesData();
        }
      })
    })
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

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
