import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-facility-booking-payment',
  templateUrl: './facility-booking-payment.page.html',
  styleUrls: ['./facility-booking-payment.page.scss'],
})
export class FacilityBookingPaymentPage implements OnInit {
  isPaymentProcessed = false;
  selectedPaymentMethod: 'card' | 'paynow' | null = null;

  // Contoh data booking
  bookingDetails = {
    eventDate: '26/10/2024',
    eventDay: 'Saturday',
    bookingTime: '1600 - 2200',
    facilityName: 'Tennis Court',
    bookingFee: 20.00,
    deposit: 40.00
  };

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  toggleShowActBk() {
    this.router.navigate(['resident-facility-bookings']);
  }

  toggleShowNewBk() {
    this.router.navigate(['facility-new-booking']);
  }

  toggleShowDep() {
    this.router.navigate(['facility-deposits']);
  }

  toggleShowHis() {
    this.router.navigate(['facility-history']);
  }

  proceedToEmail() {
    console.log("email sent");
  }

  proceedToDirectActiveBooking() {
    this.router.navigate(['resident-facility-bookings']);
  }

  proceedToCirectHomepage() {
    this.router.navigate(['resident-homepage']);
  }

  selectPaymentMethod(method: 'card' | 'paynow') {
    this.selectedPaymentMethod = method;
  }

  async proceedToPayment() {
    // Validasi metode pembayaran
    if (!this.selectedPaymentMethod) {
      const alert = await this.alertController.create({
        header: 'Payment Method Required',
        message: 'Please select a payment method',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Simulasi proses pembayaran
    try {
      // Contoh proses pembayaran (ganti dengan logika sebenarnya)
      await this.processPayment();
      
      // Jika pembayaran berhasil
      this.isPaymentProcessed = true;
    } catch (error) {
      // Tangani error pembayaran
      const alert = await this.alertController.create({
        header: 'Payment Failed',
        message: 'Unable to process payment. Please try again.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  private async processPayment(): Promise<void> {
    // Simulasi proses pembayaran dengan promise
    return new Promise((resolve, reject) => {
      // Simulasi proses pembayaran
      setTimeout(() => {
        // Misalkan pembayaran berhasil
        resolve();
        // Untuk mensimulasikan kegagalan, gunakan: reject(new Error('Payment failed'));
      }, 2000);
    });
  }

  backToFacilityBooking() {
    this.router.navigate(['/facility-place-booking']);
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Metode untuk menghitung total pembayaran
  calculateTotal(): number {
    return this.bookingDetails.bookingFee + this.bookingDetails.deposit;
  }
}