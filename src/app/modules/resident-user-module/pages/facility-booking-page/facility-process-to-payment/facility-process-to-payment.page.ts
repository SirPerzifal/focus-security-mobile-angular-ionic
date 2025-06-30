import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from, Subscription } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';

declare var Stripe: any; // Declare Stripe

interface BookingState {
  type: 'BookingState'; // Tambahkan properti unik
  roomId: string; // Ubah ke number jika perlu
  startTimeString: string;
  endTimeString: string;
  unitId: number;
  partnerId: number;
  bookingFee: number;
  deposit: number;
  eventDate: string;
  bookingTime: string;
  facilityName: string;
  booking_id: number; 
}

interface FromPlaceBooking {
  type: 'FromPlaceBooking'; // Tambahkan properti unik
  amount_deposit: number,
  amount_taxed: string,
  amount_total: number,
  amount_untaxed: string,
  booked_by: string,
  booking_date: string,
  bookingId: number,
  facility_name: string,
  start_datetime: string,
  stop_datettime: string,
}

interface FromHistoryForm {
  bookingId: number,
  type: "FromHistoryForm",
  facilityName: string,
  eventDate: string,
  bookingTime: string,
  startTime: string,
  endTime: string,
  bookingFee: number,
  bookingTax: string,
  deposit: number,
  bookedBy: string,
  status: string,
  from: 'Active',
  amountDeposit: string
}

type State = BookingState | FromPlaceBooking | FromHistoryForm;

@Component({
  selector: 'app-facility-process-to-payment',
  templateUrl: './facility-process-to-payment.page.html',
  styleUrls: ['./facility-process-to-payment.page.scss'],
})
export class FacilityProcessToPaymentPage implements OnInit {
  isPaymentProcessed = false;
  selectedPaymentMethod: 'card' | 'paynow' | null = null;
  projectId: number = 0;

  paymentMethodAllowed: string = ''; // Default value
  qrCodeImage: string = '';

  selectedPaymentReceiptFileName: string = '';
  paymentReceipt: any = '';

  // Contoh data booking
  bookingDetails: BookingState | FromPlaceBooking | FromHistoryForm | null = null; // Atau gunakan BookingDetails jika Anda yakin akan selalu ada
  bookingState: BookingState | null = null; // Atau gunakan BookingDetails jika Anda yakin akan selalu ada
  fromPlaceBooking: FromPlaceBooking | null = null; // Atau gunakan BookingDetails jika Anda yakin akan selalu ada
  fromHistoryForm: FromHistoryForm | null = null; // Atau gunakan BookingDetails jika Anda yakin akan selalu ada
  eventDate: string = '';
  constructor(
    private router: Router,
    public functionMainService: FunctionMainService,
    private mainApiResidentService: MainApiResidentService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as State; // Menggunakan union type

    if (state && 'type' in state) {
      if (state.type === 'BookingState') {
        this.bookingDetails = {
          type: state.type,
          roomId: state.roomId,
          startTimeString: state.startTimeString,
          endTimeString: state.endTimeString,
          unitId: state.unitId,
          partnerId: state.partnerId,
          bookingFee: state.bookingFee,
          deposit: state.deposit,
          eventDate: state.eventDate,
          bookingTime: state.bookingTime,
          facilityName: state.facilityName,
          booking_id: state.booking_id, 
        };
        this.bookingState = this.bookingDetails;
      } else if (state.type === 'FromPlaceBooking') {
        this.bookingDetails = {
          type: state.type,
          amount_deposit: state.amount_deposit,
          amount_taxed: state.amount_taxed,
          amount_total: state.amount_total,
          amount_untaxed: state.amount_untaxed,
          booked_by: state.booked_by,
          booking_date: state.booking_date,
          bookingId: state.bookingId,
          facility_name: state.facility_name,
          start_datetime: state.start_datetime,
          stop_datettime: state.stop_datettime,
        };
        this.fromPlaceBooking = this.bookingDetails;
      } else if (state.type === 'FromHistoryForm') {
        this.bookingDetails = {
          bookingId: state.bookingId,
          type: state.type,
          facilityName: state.facilityName,
          eventDate: state.eventDate,
          bookingTime: state.bookingTime,
          startTime: state.startTime,
          endTime: state.endTime,
          bookingFee: state.bookingFee,
          bookingTax: state.bookingTax,
          deposit: state.deposit,
          bookedBy: state.bookedBy,
          status: state.status,
          from: state.from,
          amountDeposit: state.amountDeposit
        }
        this.fromHistoryForm = this.bookingDetails;
      }
    }
  }

  ngOnInit() {
    this.loadQRCode();
  }

  formatTime(datetime: string | undefined): string {
    if (!datetime) return '';
    const timePart = datetime.split(' ')[1];
    return timePart ? timePart.substring(0, 5) : '';
  }

  loadQRCode() {
    this.mainApiResidentService.endpointMainProcess({}, 'get/payment_qr_code').subscribe((result: any) => {
      this.qrCodeImage = result.result.qr_code;
      if (result.result.config.allowed_payment) {
        this.paymentMethodAllowed = result.result.config.allowed_payment;
      }
    })
  }

  donwloadQris() {
    if (!this.qrCodeImage) {
      this.functionMainService.presentToast('QR Code image is not available', 'danger');
      return;
    }
  
    // Membuat elemen <a> untuk mendownload gambar
    const link = document.createElement('a');
    link.href = this.qrCodeImage; // Mengatur href ke base64 image
    link.download = 'qr_code.png'; // Menentukan nama file yang akan diunduh
  
    // Menambahkan elemen ke body dan memicu klik
    document.body.appendChild(link);
    link.click();
  
    // Menghapus elemen setelah klik
    document.body.removeChild(link);
  }

  toggleShowActBk() {
    this.router.navigate(['facility-booking-main'], {
      state: {
        restart: true,
      }
    });
  }

  proceedToEmail() {
      // Logika untuk mengirim email
    this.mainApiResidentService.endpointMainProcess({
      booking_id: (this.bookingState?.booking_id ? this.bookingState.booking_id : this.fromHistoryForm?.bookingId) ? (this.bookingState?.booking_id ? this.bookingState.booking_id : this.fromHistoryForm?.bookingId) :  this.fromPlaceBooking?.bookingId,
    }, 'post/facility_send_email').subscribe((response: any) => {
      console.log(response);
      this.functionMainService.presentToast("Receipt has been sent to your email.", "success")
    })
  }

  proceedToDirectActiveBooking() {
    this.router.navigate(['facility-booking-main']);
  }

  proceedToCirectHomepage() {
    this.router.navigate(['resident-home-page']);
  }

  selectPaymentMethod(method: 'card' | 'paynow') {
    this.selectedPaymentMethod = method;
    if (method === 'card') {
      const stripe = Stripe('pk_test_51QpnAMEYQAqGD36Tk2M4AdoDQ6ngZVc41jB8vp88UF3XaeytrViZM1R2ax04szYUfL8vH4SOn8qi7ZS32ZXrqz0h00qJH2GoBK'); // Replace with your actual publishable key
      this.electricPay(stripe);
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

  onUploadPaymentReceipt(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedPaymentReceiptFileName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.paymentReceipt = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedPaymentReceiptFileName = ''; // Reset if no file is selected
    }
  }

  async proceedToPayment(bookingId: number | undefined) {
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
      if (!this.paymentReceipt) {
        this.functionMainService.presentToast('Please upload your receipt payment', 'danger');
        return;
      }

      this.mainApiResidentService.endpointProcess({
        booking_id: bookingId,
        payment_receipt: this.paymentReceipt
      }, 'post/facility_book_payment').subscribe((response: any) => {
        this.functionMainService.presentToast("Success Book", 'success');
        this.isPaymentProcessed = true;
      })
      
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
    this.router.navigate(['/resident-facility-bookings'])
  }

  // Metode untuk menghitung total pembayaran
  calculateTotal(bookingFee: number | undefined, deposit: number | undefined): number | undefined {
    if (bookingFee || deposit) {
      const bookingFeeFix = bookingFee
      if (bookingFee && deposit) {
        const bookingFeeFix = bookingFee
        const depositFix = deposit
        return bookingFeeFix + depositFix
      }
      return bookingFeeFix;
    }
    return 0; // Atau nilai default lainnya
  }

  stripeId: string = '';
  electricPay(stripe: any) {
    this.mainApiResidentService.endpointCustomProcess({
      id: (this.bookingState?.booking_id ? this.bookingState.booking_id : this.fromHistoryForm?.bookingId) ? (this.bookingState?.booking_id ? this.bookingState.booking_id : this.fromHistoryForm?.bookingId) :  this.fromPlaceBooking?.bookingId, // Pastikan booking_id ada di bookingState
      model: 'room.booking',
      amount_total_field: 'facility_book_amount_total'
    }, '/create-payment-intent').subscribe((response: any) => {
      const clientSecret = response.result.Intent.client_secret; // Adjust based on your API response structure
      if (clientSecret) {
        this.stripeId = response.result.Intent.id; // Simpan ID pembayaran
        this.presentModal(clientSecret, stripe)
      }
    })
  }

  async presentModal(clientSecret: string, stripe: any) {
    const modal = await this.modalController.create({
      component: ModalPaymentCustomComponent,
      cssClass: 'payment-modal',
      componentProps: {
        stripe: stripe,
        clientSecret: clientSecret,
        stripeId: this.stripeId,
        from: 'facility-booking-main',
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.functionMainService.presentToast("Success Book", 'success');
        this.isPaymentProcessed = true;
      } else {
        return
      }
    });

    return await modal.present();
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
