import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { ModalController } from '@ionic/angular';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { ModalComponent } from 'src/app/shared/resident-components/choose-payment-methode/modal/modal.component';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Router } from '@angular/router';

interface Visitor {
  id: number;
  name: string;
  contact: string | null;
  vehicle: string | null;
}

@Component({
  selector: 'app-form-for-request-overnight-parking',
  templateUrl: './form-for-request-overnight-parking.page.html',
  styleUrls: ['./form-for-request-overnight-parking.page.scss'],
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
export class FormForRequestOvernightParkingPage implements OnInit {

  expectedVisitors: Visitor[] = [];

  fromDisplay = {
    family_name: '',
    block_name: '',
    unit_name: '',
    mobile_number: ''
  }
  projectId: number = 0;

  formSent = {
    typeSubmit: '',
    requestDate: '',
    vehicleNumber: '',
    visitorId: 0,
    purpose: '',
    rentalAgreement: '',
    payment_receipt: ''
  }

  amountPayable: string = '';
  amountType = {
    amountUntaxed: 0,
    amountTaxed: 0,
    amountTotal: 0,
    isIncludeGST: false,
    isRequirePayment: false,
  }

  isModalAddVehicleNumberOpen: boolean = false;
  agreementChecked: boolean = false;

  minDate: string = '';
  selectedDate: string = '';

  constructor(
    private storage: StorageService,
    private mainApi: MainApiResidentService,
    private modalController: ModalController,
    private requestService: RaiseARequestService,
    private functionMain: FunctionMainService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTodayDate();
    this.loadAmount();
    this.fetchExpectedVisitors();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.fromDisplay = {
              family_name: estate.family_name,
              block_name: estate.block_name,
              unit_name: estate.unit_name,
              mobile_number: estate.family_mobile_number
            }
            this.projectId = estate.project_id;
          }
        })
      }
    })
  }

  getTodayDate() {
    const today = new Date();
    const string = today.toString;
    const final = String(today);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    this.minDate = `${yyyy}-${mm}-${dd}`; // Format yyyy-mm-dd
  }

  loadAmount() {
    this.mainApi.endpointMainProcess({}, 'get/raise_a_request_charge').subscribe((result: any) => {
      this.amountType = {
        amountUntaxed: result.result.result.amount_untaxed,
        amountTaxed: result.result.result.amount_taxed,
        amountTotal: result.result.result.amount_total,
        isIncludeGST: result.result.result.is_include_gst,
        isRequirePayment: result.result.result.is_raise_a_request_payment
      };

      this.amountPayable = String(this.amountType.amountTotal);
      
      if (this.amountPayable) {
        const amountTotalStr = this.amountType.amountTotal.toString();
        const [ first, second ] = amountTotalStr.split('.');
        if (first && second) {
          if (second && second.length > 1) {
            this.amountPayable = `S$${first}.${second}`
          } else {
            this.amountPayable = `S$${first}.${second}0`
          }
        } else if (first) {
          this.amountPayable = `${first}.00`
        }
      }
    });
  }

  fetchExpectedVisitors() {
    // console.log(this.unitId);
    
    this.mainApi.endpointMainProcess({}, 'get/expected_visitor').subscribe(
      (response) => {
        if (response.result.response_code === 200) {
          // console.log(response);
          // Transform the result into an array of visitors
          this.expectedVisitors = response.result.result;
        }
      },
      (error) => {
        console.error('Error fetching expected visitors:', error);
      }
    );
  }

  onChangeRadio(event: any) {
    this.formSent.typeSubmit = event.value;
    this.formSent = {
      typeSubmit: event.value,
      requestDate: '',
      vehicleNumber: '',
      visitorId: 0,
      purpose: '',
      rentalAgreement: '',
      payment_receipt: '',
    }
  }

  onDateChange(event: any) {
    if (event) {
      const date = new Date(event);
      this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      this.formSent.requestDate = event;
    } else {
      this.selectedDate = ''
    }
  }

  selectedScreenshot: string = '';
  // Method untuk menangani pemilihan file
  onFileSelected(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedScreenshot = this.truncateFileName(data.name, 30); // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formSent.rentalAgreement = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedScreenshot = ''; // Reset if no file is selected
    }
  }

  truncateFileName(fileName: string, maxLength: number): string {
    if (fileName.length <= maxLength) {
      return fileName;
    }
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedLength = maxLength - extension!.length - 4; // 4 untuk "..." dan "."
    
    return nameWithoutExt.substring(0, truncatedLength) + '...' + '.' + extension;
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

  onVisitorSelect(visitorId: number) {
    this.formSent.visitorId = visitorId; // Update the form control for 'visitorId'
  }

  openModalVehicle(visitor: any) {
    this.isModalAddVehicleNumberOpen = true;
    console.log(visitor);
    // this.idVisitor = visitor.id; // Update the local variable
    this.vehicleUpdate.visitorId = visitor.id;
  }

  async presentModalAgreement() {
    const modal = await this.modalController.create({
      component: TermsConditionModalComponent,
      cssClass: 'terms-condition-modal',
    });
    modal.onDidDismiss().then((result) => {
      if (result) {
      }
    });
    return await modal.present();
  }

  async payNow(paymentId: number) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'choose-pay-modal',
      componentProps: {
        paymentId: paymentId
      }
    })
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.processPayment(result.data)
      } else {
        return
      }
    });
    return await modal.present();
  }

  processPayment(result: any) {
    if (result[1] === 'electronic') {
      this.electricPay(result[0])
    } else {
      this.manualPay(result[2])
    }
  }

  electricPay(stripe: any) {
    this.mainApi.endpointCustomProcess({
      project_id: this.projectId,
      model: 'fs.vms.overnight.parking.list',
      from: 'raise-a-request-page'
    }, '/create-payment-intent').subscribe((response: any) => {
      const clientSecret = response.result.Intent.client_secret; // Adjust based on your API response structure
      if (clientSecret) {
        this.stripeId = response.result.Intent.id; // Simpan ID pembayaran
        this.presentModal(clientSecret, stripe)
      }
    })
  }

  stripeId: string = ''; // Replace with your actual publishable key
  async presentModal(clientSecret: string, stripe: any) {
    const modal = await this.modalController.create({
      component: ModalPaymentCustomComponent,
      cssClass: 'payment-modal',
      componentProps: {
        stripe: stripe,
        clientSecret: clientSecret,
        stripeId: this.stripeId,
        from: 'raise-a-request-page',
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.mainApi.endpointMainProcess({
          visitor_id: this.formSent.visitorId,
          applicant_type: this.formSent.typeSubmit,
          request_date: this.functionMain.convertDateToYYYYMMDDHMS(this.formSent.requestDate),
          vehicle_number: this.formSent.vehicleNumber,
          rental_agreement: this.formSent.rentalAgreement,
          purpose: this.formSent.purpose,
          payment_receipt: result.data[1] || '', // Use receipt URL if available
          stripe_id: this.stripeId,
        }, 'post/overnight_parking_application').subscribe((response: any) => {
          this.functionMain.presentToast('Overnight Request submitted successfully', 'success');
          this.router.navigate(['/raise-a-request-page']);
        })
      } else {
        return
      }
    });
    return await modal.present();
  }

  async manualPay(paymentId: number) {
    const modal = await this.modalController.create({
      component: ModalPaymentManualCustomComponent,
      cssClass: 'upload-receipt-manual-pay',
      componentProps: {}
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.formSent.payment_receipt = result.data;
        if (this.formSent.payment_receipt === result.data) {
          this.mainApi.endpointMainProcess({
            visitor_id: this.formSent.visitorId,
            applicant_type: this.formSent.typeSubmit,
            request_date: this.functionMain.convertDateToYYYYMMDDHMS(this.formSent.requestDate),
            vehicle_number: this.formSent.vehicleNumber,
            rental_agreement: this.formSent.rentalAgreement,
            purpose: this.formSent.purpose,
            payment_receipt: this.formSent.payment_receipt,
          }, 'post/overnight_parking_application').subscribe((response: any) => {
            this.functionMain.presentToast('Overnight Request submitted successfully', 'success');
            this.router.navigate(['/raise-a-request-page']);
          })
        }
      } else {
        this.functionMain.presentToast('Please upload payment receipt', 'danger');
        return
      }
    });

    return await modal.present();
  }

  onSubmitNext() {
    if (this.formSent.typeSubmit == 'myself') {
      if (!this.formSent.requestDate) {
        this.functionMain.presentToast('Please select a request date', 'danger');
        return;
      } else if (!this.formSent.vehicleNumber) {
        this.functionMain.presentToast('Please enter vehicle number', 'danger');
        return;
      } else if (!this.formSent.purpose) {
        this.functionMain.presentToast('Please enter purpose', 'danger');
        return;
      } else if (!this.formSent.rentalAgreement) {
        this.functionMain.presentToast('Please upload rental agreement', 'danger');
        return;
      } else {
        if (this.amountType.isRequirePayment) {
          this.payNow(0);
        } else {
          this.mainApi.endpointMainProcess({
            visitor_id: this.formSent.visitorId,
            applicant_type: this.formSent.typeSubmit,
            request_date: this.functionMain.convertDateToYYYYMMDDHMS(this.formSent.requestDate),
            vehicle_number: this.formSent.vehicleNumber,
            rental_agreement: this.formSent.rentalAgreement,
            purpose: this.formSent.purpose,
            payment_receipt: this.formSent.payment_receipt
          }, 'post/overnight_parking_application').subscribe((response: any) => {
            this.functionMain.presentToast('Overnight Request submitted successfully', 'success');
            this.router.navigate(['/raise-a-request-page'])
          })
        }
      }
    } else if (this.formSent.typeSubmit == 'visitor') {
      if (!this.formSent.visitorId) {
        this.functionMain.presentToast('Please select a visitor', 'danger');
        return;
      } else {
        if (this.amountType.isRequirePayment) {
          this.payNow(0);
        } else {
          this.mainApi.endpointMainProcess({
            visitor_id: this.formSent.visitorId,
            applicant_type: this.formSent.typeSubmit,
            request_date: this.functionMain.convertDateToYYYYMMDDHMS(this.formSent.requestDate),
            vehicle_number: this.formSent.vehicleNumber,
            rental_agreement: this.formSent.rentalAgreement,
            purpose: this.formSent.purpose,
            payment_receipt: this.formSent.payment_receipt
          }, 'post/overnight_parking_application').subscribe((response: any) => {
            this.functionMain.presentToast('Overnight Request submitted successfully', 'success');
            this.router.navigate(['/raise-a-request-page'])
          })
        }
      }
    }
  }

  onChangeValue(event: any, type: string) {
    if (type === 'vehicle_update') {
      this.vehicleUpdate.vehicleNumber = event
    } else if (type === 'vehicle_number') {
      this.formSent.vehicleNumber = event
    }
  }

  vehicleUpdate = {
    vehicleNumber: '',
    visitorId: 0
  }
  onVehicleNumberSubmit() {
    const vehicleNumber = this.vehicleUpdate.vehicleNumber;
    if (vehicleNumber) {
      this.requestService.postUpdateVehicleNumber(
        this.vehicleUpdate.visitorId,
        vehicleNumber
      ).subscribe(
        (response) => {
          // console.log('Vehicle number updated successfully:', response);
          this.expectedVisitors = []
          if (this.expectedVisitors = []) {
            this.fetchExpectedVisitors();
          }
          this.isModalAddVehicleNumberOpen = false;
        },
        (error) => {
          console.error('Error updating vehicle number:', error);
        }
      )
    }
  }

}
