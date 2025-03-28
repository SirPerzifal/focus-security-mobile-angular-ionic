import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { payment } from 'src/models/resident/poymentModel.model';
import { PaymentService } from 'src/app/service/resident/payment/payment.service';
import { ApiService } from 'src/app/service/api.service';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';


declare var Stripe: any; // Declare Stripe

@Component({
  selector: 'app-bills-maintenance',
  templateUrl: './bills-maintenance.page.html',
  styleUrls: ['./bills-maintenance.page.scss'],
})
export class BillsMaintenancePage extends ApiService implements OnInit, OnDestroy {
  isLoading: boolean = true;
  choosePaymentModal: boolean = false;
  paymentLoaded: payment[] = [];
  stripe: any;
  card: any;

  blockId: number = 0;
  unitId: number = 0;
  projectId: number = 0;

  isModalUploadReceiptOpen: boolean = false;
  paymentid: number = 0;
  selectedFileName: string = '';
  receiptBase64: string = '';

  constructor(private paymentService: PaymentService, private modalController: ModalController, http: HttpClient, private mainApiResidentService: MainApiResidentService, public functionMain: FunctionMainService, private router: Router) { super(http) }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unitId = parseValue.unit_id; // Ambil data unit_id
        this.blockId = parseValue.block_id; // Ambil data block_id
        this.projectId = parseValue.project_id; // Ambil data project_id
        this.loadPayment();
      }
    })
    this.stripe = Stripe('pk_test_51QpnAMEYQAqGD36Tk2M4AdoDQ6ngZVc41jB8vp88UF3XaeytrViZM1R2ax04szYUfL8vH4SOn8qi7ZS32ZXrqz0h00qJH2GoBK'); // Replace with your actual publishable key
  }

  loadPayment() {
    this.paymentLoaded = []
    // console.log("tes");
    
    this.mainApiResidentService.endpointProcess({
      unit_id: this.unitId,
      project_id: this.projectId,
      block_ids: this.blockId
    }, 'get/active_bills').subscribe((result: any) => {
      this.isLoading = false;
      // console.log(result);
      const paymentLoaded = result.result.response_result;

      this.paymentLoaded = paymentLoaded.map((item: any) => {
        const isOverdue = item.start_date < new Date().toISOString().split('T')[0];
        return {
          id: item.id,
          title: item.bill_references,
          description: item.bill_name,
          total: Number(item.total_bill),
          date: item.start_date,
          overdue_in: item.due_date,
          overdue: isOverdue ? 'Yes' : 'No' // Menentukan status overdue
        } as payment; // Menyatakan bahwa objek ini sesuai dengan tipe payment
      });

    })
  }

  payNow(idPayment: number) {
    this.choosePaymentModal = !this.choosePaymentModal;
    if (this.paymentid === idPayment) {
      this.paymentid = 0;
    } else {
      this.paymentid = idPayment;
    }
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
      bills_id: this.paymentid,
      payment_proof: this.receiptBase64
    }, 'post/manual_pay_bills').subscribe((response: any) => {
      Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
        if (value?.value) {
          const parseValue = JSON.parse(value.value);
          this.unitId = parseValue.unit_id; // Ambil data unit_id
          this.blockId = parseValue.block_id; // Ambil data block_id
          this.projectId = parseValue.project_id; // Ambil data project_id
          this.isModalUploadReceiptOpen = !this.isModalUploadReceiptOpen;
          this.paymentLoaded = [];
          this.loadPayment();
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