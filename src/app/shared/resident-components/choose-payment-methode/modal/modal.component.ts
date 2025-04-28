import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

declare var Stripe: any; // Declare Stripe

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit {

  stripe: any;
  paymentId: number = 0;
  paymentMethodAllowed: string = ''; // Default value

  constructor(
    private mainApi: MainApiResidentService,
    private navParams: NavParams,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    const paymentId = this.navParams.get('paymentId');
    this.paymentId = paymentId
    this.loadQRCode();
    this.stripe = Stripe('pk_test_51QpnAMEYQAqGD36Tk2M4AdoDQ6ngZVc41jB8vp88UF3XaeytrViZM1R2ax04szYUfL8vH4SOn8qi7ZS32ZXrqz0h00qJH2GoBK'); // Replace with your actual publishable key
  }

  loadQRCode() {
    this.mainApi.endpointMainProcess({}, 'get/payment_qr_code').subscribe((result: any) => {
      if (result.result.config.allowed_payment) {
        this.paymentMethodAllowed = result.result.config.allowed_payment;
      }
    })
  }

  onClickPaymentChoose(paymentChoosen: any) {
    this.modalController.dismiss([this.stripe, paymentChoosen, this.paymentId])
  }

}
