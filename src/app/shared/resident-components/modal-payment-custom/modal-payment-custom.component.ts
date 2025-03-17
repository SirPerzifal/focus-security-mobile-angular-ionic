import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-payment-custom',
  templateUrl: './modal-payment-custom.component.html',
  styleUrls: ['./modal-payment-custom.component.scss'],
})
export class ModalPaymentCustomComponent extends ApiService implements OnInit {

  @Input() stripe: any;
  @Input() clientSecret: any;
  elements: any;
  card: any;

  setupStripeElements(clientSecret: any) {
    const appearance = {
      theme: 'flat',
      variables: { colorPrimaryText: '#262626' }
    };
    // Store the Elements instance
    this.elements = this.stripe.elements({ clientSecret, appearance });

    // Create Payment Element and mount it
    this.card = this.elements.create('payment');
    this.card.mount('#card-element');
  }

  constructor(private modalController: ModalController, http: HttpClient, private router: Router) { super(http) }

  ngOnInit() {
    this.setupStripeElements(this.clientSecret);
  }

  async handlePayment() {
    if (!this.elements) {
      console.error('Stripe Elements is not initialized.');
      return;
    }
  
    // ✅ Submit the payment form first
    const { error: submitError } = await this.elements.submit();
    if (submitError) {
      console.error('Error submitting elements:', submitError);
      return;
    }
  
    const returnUrl = '';

    // ✅ Then confirm the payment
    this.stripe.confirmPayment({
      clientSecret: this.clientSecret,
      elements: this.elements, // Use the full Elements instance
      confirmParams: {
        return_url: 'focussecurity://resident-payment', // Replace with your actual return URL
      },
    }).then((result: any) => {
      if (result.error) {
        console.error(result.error.message);
      } else {
        console.log('Payment successful!', result.paymentIntent);
      }
    });

    // Navigate after 2 seconds
    setTimeout(() => {
      this.modalController.dismiss(true);
      this.router.navigate(['/resident-payment']);
    }, 2000);
  }
  

  closeModal() {
    this.modalController.dismiss(true);
  }

}
