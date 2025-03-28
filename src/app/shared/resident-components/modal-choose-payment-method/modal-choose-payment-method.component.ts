import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-choose-payment-method',
  templateUrl: './modal-choose-payment-method.component.html',
  styleUrls: ['./modal-choose-payment-method.component.scss'],
})
export class ModalChoosePaymentMethodComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  selectedPayment(selected_payment: string) {
    this.modalController.dismiss(selected_payment)
  }

}
