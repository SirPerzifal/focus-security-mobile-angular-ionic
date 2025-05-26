import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

import { StorageService } from 'src/app/service/storage/storage.service';
import { ModalComponent } from 'src/app/shared/resident-components/choose-payment-methode/modal/modal.component';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { UploadReceiptModalComponent } from 'src/app/shared/resident-components/upload-receipt-modal/upload-receipt-modal.component';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-form-for-request-bibycle-tag-application',
  templateUrl: './form-for-request-bibycle-tag-application.page.html',
  styleUrls: ['./form-for-request-bibycle-tag-application.page.scss'],
})
export class FormForRequestBibycleTagApplicationPage implements OnInit {

  fromDisplay = {
    family_name: '',
    block_name: '',
    unit_name: '',
    mobile_number: ''
  }

  expectedBicycle: any = [];

  amountPayable: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false,
    isRequirePayment: false,
  }

  formSent = {
    cardId: '',
    typeSubmit: '',
    bicycleBrand: '',
    bicycleColour: '',
    bicycleImage: '',
    paymentReceipt: '',
    bicycleTagId: '',
  }
  agreementChecked: boolean = false;

  constructor(
    private storage: StorageService,
    private modalController: ModalController,
    private mainAPi: MainApiResidentService,
    private router: Router,
    private functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    this.loadAmount();
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
          }
        })
      }
    })
  }

  loadAmount() {
    this.mainAPi.endpointMainProcess({}, 'get/raise_a_request_charge').subscribe((result: any) => {
      this.amountType = {
        amountUntaxed: result.result.result.amount_untaxed,
        amountTaxed: result.result.result.amount_taxed,
        amountTotal: result.result.result.amount_total,
        isIncludeGST: result.result.result.is_include_gst,
        isRequirePayment: result.result.result.is_raise_a_request_payment
      };
      this.amountPayable = this.amountType.amountTotal;
      
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

  onChangeRadio(event: any) {
    this.formSent.typeSubmit = event.value;
    if (this.formSent.typeSubmit === 'replacement') {
      this.loadBicylceData();
    }
    this.formSent = {
      cardId: '',
      typeSubmit: event.value,
      bicycleBrand: '',
      bicycleColour: '',
      bicycleImage: '',
      paymentReceipt: '',
      bicycleTagId: '',
    }
  }

  onBicycleSelect(card: any) {
    // console.log('Selected Card:', card);
    this.formSent.cardId = card.id;
    this.formSent.bicycleColour = card.bicycle_colour;
    this.formSent.bicycleBrand = card.bicycle_brand;
    this.formSent.bicycleTagId = card.bicycle_tag;
    // Perform action based on selected card
  }

  loadBicylceData() {
    this.mainAPi.endpointMainProcess({}, 'get/bicycle_tag_based_on_unit').subscribe((response: any) => {
      this.expectedBicycle = response.result.bicycle_tag_data;
    })
  }

  selectedBicycleImage: string = '';
  // Method untuk menangani pemilihan file
  onFileSelected(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedBicycleImage = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formSent.bicycleImage = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedBicycleImage = ''; // Reset if no file is selected
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

  onChangeValue(event: any, type: string) {
    if (type === 'Brand') {
      this.formSent.bicycleBrand = event
    } else if (type === 'Colour') {
      this.formSent.bicycleColour = event
    }
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
    this.mainAPi.endpointCustomProcess({}, '/create-payment-intent').subscribe((response: any) => {
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
      } else {
        return
      }
    });
    return await modal.present();
  }

  async manualPay(paymentId: number) {
    const modal = await this.modalController.create({
      component: UploadReceiptModalComponent,
      cssClass: 'upload-receipt-manual-pay',
      componentProps: {}
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.formSent.paymentReceipt = result.data;
        if (this.formSent.paymentReceipt === result.data) {
          this.mainAPi.endpointMainProcess({
            paymentReceipt: this.formSent.paymentReceipt,
            bicycle_brand: this.formSent.bicycleBrand,
            bicycle_colour: this.formSent.bicycleColour,
            bicycle_tag_id: this.formSent.cardId ? this.formSent.cardId : 0, // Optional untuk replacement
            bicycle_image: this.formSent.bicycleImage, // Optional untuk new application
          }, 'post/request_bicycle_tag').subscribe((response: any) => {
            this.functionMain.presentToast('Successfully added bicycle card.', 'success')
            this.router.navigate(['raise-a-request-page'])
          })
        }
      } else {
        return
      }
    });

    return await modal.present();
  }

  onSubmitNext() {
    if (this.amountType.isRequirePayment) {
      this.payNow(0);
    } else {
      this.mainAPi.endpointMainProcess({
        paymentReceipt: this.formSent.paymentReceipt,
        bicycle_brand: this.formSent.bicycleBrand,
        bicycle_colour: this.formSent.bicycleColour,
        bicycle_tag_id: this.formSent.cardId ? this.formSent.cardId : 0, // Optional untuk replacement
        bicycle_image: this.formSent.bicycleImage, // Optional untuk new application
      }, 'post/request_bicycle_tag').subscribe((response: any) => {
        this.functionMain.presentToast('Successfully added bicycle card.', 'success')
        this.router.navigate(['raise-a-request-page'])
      })
    }
  }

}
