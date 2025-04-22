import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalChoosePaymentMethodComponent } from 'src/app/shared/resident-components/modal-choose-payment-method/modal-choose-payment-method.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-bicycle-tag-application',
  templateUrl: './bicycle-tag-application.page.html',
  styleUrls: ['./bicycle-tag-application.page.scss'],
})
export class BicycleTagApplicationPage implements OnInit {

  projectId: number =1;
  selectedOption: string = '';
  expectedBicycle: any = [];
  agreementChecked: boolean = false;
  userName: string = '';
  userPhoneNumber: string = '';
  condoName: string = '';
  unit: number = 1; // Replace with actual unit ID
  unitId: number = 1; // Replace with actual unit ID
  block: number = 1; // Replace with actual block ID
  noTel: string = '';
  selectedFileName: string = ''; // New property to hold the selected file name
  extend_mb = false
  formData = {
    id: 0,
    block_id: 0,
    unit_id: 0,
    bicycle_brand: '',
    bicycle_colour: '',
    bicycle_image: '',
    bicycle_tag_id: '',
  }
  amountPayable: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false,
    isRequirePayment: false,
  }

  constructor(private modalController: ModalController, private raiseARequestService: RaiseARequestService, private toastController: ToastController, private router: Router, private mainApiResidentService: MainApiResidentService, private storage: StorageService) { }

  termsAndCOndition: string = '';

  async presentModalAgreement() {
    // console.log("tes");
        // // console.log(email);
    // // console.log('presentModalpresentModalpresentModalpresentModalpresentModal');
    
    const modal = await this.modalController.create({
      component: TermsConditionModalComponent,
      cssClass: 'terms-condition-modal',
      componentProps: {
        // email: email
        terms_condition: this.termsAndCOndition
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {

      }
    });

    return await modal.present();
  }

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.projectId = Number(estate.project_id)
            this.unitId = Number(estate.unit_id);
            this.formData.unit_id = estate.unit_id;
            this.unit = estate.unit_id;
            this.block = estate.block_id;
            this.formData.block_id = estate.block_id;
            this.condoName = estate.project_name;
            this.userName = estate.family_name;
            this.userPhoneNumber = estate.family_mobile_number;
            this.loadAmount();
          }
        })
      }
    })
  }

  loadAmount() {
    this.mainApiResidentService.endpointProcess({
      project_id: this.projectId
    }, 'get/raise_a_request_charge').subscribe((result: any) => {
      this.amountType = {
        amountUntaxed: result.result.result.amount_untaxed,
        amountTaxed: result.result.result.amount_taxed,
        amountTotal: result.result.result.amount_total,
        isIncludeGST: result.result.result.is_include_gst,
        isRequirePayment: result.result.result.is_raise_a_request_payment
      };
      this.amountPayable = this.amountType.amountTotal;
    })
  }

  processSubmit() {
    if (this.amountType.isRequirePayment) {
      this.presentChoosePaymentMethodeModal();
    } else {
      this.onSubmit('');
    }
  }

  onShowAmountChange(event: any) {
    const type = event.target.value;

    if (type === 'untaxed') {
      this.amountPayable = this.amountType.amountUntaxed;
    } else if (type === 'taxed') {
      this.amountPayable = this.amountType.amountTaxed;
    } else {
      this.amountPayable = this.amountType.amountTotal;
    }
  }

  onOptionChange(option: string) {
    this.extend_mb = true
    this.selectedOption = '';
    this.formData = {
      id: 0,
      block_id: 1,
      unit_id: 1,
      bicycle_brand: '',
      bicycle_colour: '',
      bicycle_image: '',
      bicycle_tag_id: '',
    }
    this.selectedFileName = '';
    this.selectedOption = option;
    if (option === 'replacement') {
      this.loadBicycle();
      this.agreementChecked = false;
    } else if (option === 'new_application') {
      this.agreementChecked = false;
      this.expectedBicycle = [];
      // console.log("tes");
    }
  }

  onFileChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedFileName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.bicycle_image = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedFileName = ''; // Reset if no file is selected
    }
  }

  loadBicycle() {
    this.raiseARequestService.getBicycletag(this.unitId).subscribe(
      (response) => {
        // console.log('Response from server:', response);
        this.expectedBicycle = response.result.bicycle_tag_data;
      },
      (error) => {
        console.error('Error submitting form:', error);
        // Handle error response (e.g., show an error message)
      }
    );
  }

  onBicycleSelect(card: any) {
    // console.log('Selected Card:', card);
    this.formData.id = card.id;
    this.formData.bicycle_colour = card.bicycle_colour;
    this.formData.bicycle_brand = card.bicycle_brand;
    this.formData.bicycle_tag_id = card.bicycle_tag;
    // Perform action based on selected card
  }

  async presentChoosePaymentMethodeModal() {
    const modal = await this.modalController.create({
      component: ModalChoosePaymentMethodComponent,
      cssClass: 'raise-a-request-choose-payment-modal',
      componentProps: {
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        if (result.data === "electronic") {
          console.log("tes");
        } else {
          this.presentManualPaymentMethodeModal();
        }
      }
    });
    return await modal.present();
  }

  async presentManualPaymentMethodeModal() {
    const modal = await this.modalController.create({
      component: ModalPaymentManualCustomComponent,
      cssClass: 'raise-a-request-manual-payment-modal',
      componentProps: {
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        const receipt = result.data;
        this.onSubmit(receipt);
      }
    });
    return await modal.present();
  }

  onSubmit(paymentReceipt: string) {
    if (this.selectedOption === 'replacement') {
      if (this.formData.bicycle_brand && this.formData.bicycle_colour) {
        // console.log(this.formData);
        
        // Kirim data untuk replacement
        this.raiseARequestService.postRequestBicycle(
          this.formData.block_id,
          this.formData.unit_id,
          this.projectId,
          paymentReceipt,
          this.formData.bicycle_brand,
          this.formData.bicycle_colour,
          this.formData.id // Mengirim bicycle_id untuk replacement
        ).subscribe(
          (response) => {
            // console.log('Response from server:', response);
            this.formData = {
              id: 0,
              block_id: 1,
              unit_id: 1,
              bicycle_brand: '',
              bicycle_colour: '',
              bicycle_image: '',
              bicycle_tag_id: '',
            }
            this.presentToast('Form submitted successfully','success');
            this.router.navigate(['resident-raise-a-request'])
            this.OnDestroy();
            // Handle successful submission
          },
          (error) => {
            console.error('Error submitting form:', error);
            // Handle error response (e.g., show an error message)
          }
        );
      } else {
        // console.log('Form is invalid for replacement');
        this.presentToast('Please make sure you fill all the fields', 'danger');
      }
    } else if (this.selectedOption === 'new_application') {
      if (this.formData.bicycle_brand && this.formData.bicycle_colour && this.formData.bicycle_image) {
        // console.log(this.formData);
        
        // Kirim data untuk new application
        this.raiseARequestService.postRequestBicycle(
          this.formData.block_id,
          this.formData.unit_id,
          this.projectId,
          paymentReceipt,
          this.formData.bicycle_brand,
          this.formData.bicycle_colour,
          0,
          this.formData.bicycle_image // Mengirim bicycle_image untuk new application
        ).subscribe(
          (response) => {
            // console.log('Response from server:', response);
            this.formData = {
              id: 0,
              block_id: 1,
              unit_id: 1,
              bicycle_brand: '',
              bicycle_colour: '',
              bicycle_image: '',
              bicycle_tag_id: '',
            }
            this.presentToast('Form submitted successfully','success');
            this.router.navigate(['resident-raise-a-request'])
            this.OnDestroy();
            // Handle successful submission
          },
          (error) => {
            console.error('Error submitting form:', error);
            // Handle error response (e.g., show an error message)
          }
        );
      } else {
        // console.log('Form is invalid');
        this.presentToast('Please make sure you fill all the fields', 'danger');
      }
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

  private routerSubscription!: Subscription;
  OnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
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

  onCheck(focus: any) {
    this.extend_mb = focus
    this.agreementChecked = true;
    if (this.agreementChecked = true) {
      this.agreementChecked = false;
    }
  }
}
