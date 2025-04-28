import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';

declare var Stripe: any; // Declare Stripe

interface Vehicle {
  vehicleId: number,
  vehicleNumber: string,
  type_ofApplication: string,
  vehicleType: string,
  vehicleMake: string,
  vehicleColor: string,
  vehicleAmountUntaxed: string,
  vehicleAmountTaxed: string,
  vehicleAmountTotal: string,
  states: string,
  isPrimaryVehicle: string
}

interface VehicleResponse {
  vehicle_id: number,
  vehicle_number: string,
  type_of_application: string,
  vehicle_type: string,
  vehicle_make: string,
  vehicle_color: string,
  vehicle_amount_untaxed: string,
  vehicle_amount_taxed: string,
  vehicle_amount_total: string,
  states: string,
  is_primary_vehicle: string
}

@Component({
  selector: 'app-payment-form-vehicle',
  templateUrl: './payment-form-vehicle.page.html',
  styleUrls: ['./payment-form-vehicle.page.scss'],
})
export class PaymentFormVehiclePage implements OnInit {

  fromWhere: string = '';

  constructor(
    private router: Router, private mainApiResident: MainApiResidentService, public functionMainService: FunctionMainService, private modalController: ModalController
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicleId: number, from: string };
    if (state) {
      // // console.log(state.from);
      this.fromWhere = state.from
      this.loadVehicleDetail(state.vehicleId)
    } 
  }

  ngOnInit() {
    this.loadQRCode();
  }

  backTo() {
    // if (this.fromWhere === 'main') {
      this.router.navigate(['/my-vehicle-page-main'])
    // } else {
    //   this.router.navigate(['/vehicle-form'])
    // }
  }
  vehicleData: Vehicle | null = null;

  isPaymentProcessed: boolean = false;
  paymentMethodAllowed: string = ''; // Default value
  qrCodeImage: string = '';
  selectedPaymentMethod: string = '';
  selectedPaymentReceiptFileName: string = '';
  paymentReceipt: string = '';

  proceedToDirectActiveBooking() {
    this.router.navigate(['/my-vehicle-page-main']);
  }

  proceedToCirectHomepage() {
    this.router.navigate(['resident-home-page']);
  }

  loadVehicleDetail(vehicleId: number) {
    this.mainApiResident.endpointProcess({
      vehicle_id: vehicleId
    }, 'get/get_vehicle_detail').subscribe(
      (response: any) => {
        const result = response.result.response_result;
        if (result) {
          this.vehicleData = {
            vehicleId: result.vehicle_id,
            vehicleNumber: result.vehicle_number,
            type_ofApplication: result.type_of_application,
            vehicleType: result.vehicle_type,
            vehicleMake: result.vehicle_make,
            vehicleColor: result.vehicle_color,
            vehicleAmountUntaxed: result.vehicle_amount_untaxed,
            vehicleAmountTaxed: result.vehicle_amount_taxed,
            vehicleAmountTotal: result.vehicle_amount_total,
            states: result.states,
            isPrimaryVehicle: result.is_primary_vehicle
          };
        } else {
          this.vehicleData = null; // Handle case where no data is returned
        }
      },
      (error) => {
        console.error('Error loading vehicle details', error);
        // Display error message to the user
      }
    );
  }

  loadQRCode() {
    this.mainApiResident.endpointMainProcess({}, 'get/payment_qr_code').subscribe((result: any) => {
      this.qrCodeImage = result.result.qr_code;
      if (result.result.config.allowed_payment) {
        this.paymentMethodAllowed = result.result.config.allowed_payment;
      }
    })
  }

  donwloadQris() {
  
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

  selectPaymentMethod(method: 'card' | 'paynow') {
    this.selectedPaymentMethod = method;
    if (method === 'card') {
      const stripe = Stripe('pk_test_51QpnAMEYQAqGD36Tk2M4AdoDQ6ngZVc41jB8vp88UF3XaeytrViZM1R2ax04szYUfL8vH4SOn8qi7ZS32ZXrqz0h00qJH2GoBK'); // Replace with your actual publishable key
      this.electricPay(stripe);
    }
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

  uploadReceipt() {
    this.mainApiResident.endpointProcess({
      vehicle_id: this.vehicleData?.vehicleId,
      payment_receipt: this.paymentReceipt
    }, 'post/post_vehicle_receipt').subscribe((response: any) => {
      console.log(response);
      this.functionMainService.presentToast("Success Book", 'success');
      this.isPaymentProcessed = true;
    })
  }

    electricPay(stripe: any) {
      this.mainApiResident.endpointCustomProcess({}, '/create-payment-intent').subscribe((response: any) => {
        const clientSecret = response.result.Intent.client_secret; // Adjust based on your API response structure
        if (clientSecret) {
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
          clientSecret: clientSecret
        }
      });
  
      modal.onDidDismiss().then((result) => {
        if (result.data) {
          // console.log(result)
        } else {
          return
        }
      });
  
      return await modal.present();
    }
}
