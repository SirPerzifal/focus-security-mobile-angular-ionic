import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NewBookingService } from 'src/app/service/resident/facility-bookings/new-booking/new-booking.service';
import { Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BookingDetails } from 'src/models/resident/facility.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-facility-booking-payment',
  templateUrl: './facility-booking-payment.page.html',
  styleUrls: ['./facility-booking-payment.page.scss'],
})
export class FacilityBookingPaymentPage implements OnInit, OnDestroy {
  isPaymentProcessed = false;
  selectedPaymentMethod: 'card' | 'paynow' | null = null;
  projectId: number = 0;

  qrCodeImage: string = '';

  selectedPaymentReceiptFileName: string = '';
  paymentReceipt: any = '';

  // Contoh data booking
  bookingDetails: BookingDetails | null = null; // Atau gunakan BookingDetails jika Anda yakin akan selalu ada
  eventDate: string = '';
  constructor(
    private router: Router,
    private alertController: AlertController,
    public functionMainService: FunctionMainService,
    private facilityService: NewBookingService,
    private toastController: ToastController,
    private mainApiResidentService: MainApiResidentService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
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
      booking_id: string;
    };
    if (state) {
      this.bookingDetails = state
      this.eventDate = String(state.eventDate)
      if (this.bookingDetails) {
        // console.log(this.bookingDetails)
      }
    } 
  }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.projectId = Number(parseValue.project_id);
        this.loadQRCode();
      }
    })
  }

  loadQRCode() {
    this.mainApiResidentService.endpointProcess({
      project_id: this.projectId
    }, 'get/payment_qr_code').subscribe((result: any) => {
      this.qrCodeImage = result.result.qr_code;
    })
  }

  donwloadQris() {
    if (!this.qrCodeImage) {
      this.presentToast('QR Code image is not available', 'danger');
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
    this.router.navigate(['resident-facility-bookings'], {
      queryParams: {
        restart: 'restart',
      }
    });
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
    // console.log("email sent");
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

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
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
      if (!this.paymentReceipt) {
        this.presentToast('Please upload your receipt payment', 'danger');
        return;
      }

      this.mainApiResidentService.endpointProcess({
        booking_id: this.bookingDetails?.booking_id,
        payment_receipt: this.paymentReceipt
      }, 'post/facility_book_payment').subscribe((response: any) => {
        this.presentToast("Success Book", 'success');
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

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Metode untuk menghitung total pembayaran
  calculateTotal(): number {
    if (this.bookingDetails) {
      return this.bookingDetails.bookingFee + this.bookingDetails.deposit;
    }
    return 0; // Atau nilai default lainnya
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}