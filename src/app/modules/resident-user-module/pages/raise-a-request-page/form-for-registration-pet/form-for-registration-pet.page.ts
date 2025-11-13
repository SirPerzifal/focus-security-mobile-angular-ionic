import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { ModalComponent } from 'src/app/shared/resident-components/choose-payment-methode/modal/modal.component';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-form-for-registration-pet',
  templateUrl: './form-for-registration-pet.page.html',
  styleUrls: ['./form-for-registration-pet.page.scss'],
})
export class FormForRegistrationPetPage implements OnInit {

  amountPayable: string = '';
  amountType = {
    amountUntaxed: 0,
    amountTaxed: 0,
    amountTotal: 0,
    isIncludeGST: false,
    isRequirePayment: false,
  }

  agreementChecked: boolean = false;

  formSent = {
    typeOfPet: '',
    typeOfBreed: '',
    imagePet: '',
    licencePet: '',
    notesForManagement: '',
    paymentReceipt: ''
  }
  projectId: number = 0;

  constructor(
    private modalController: ModalController,
    private mainApi: MainApiResidentService,
    private functionMain: FunctionMainService,
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.loadAmount();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.projectId = estate.project_id;
          }
        })
      }
    })
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

  selectedPetImage: string = '';
  // Method untuk menangani pemilihan file
  onFilePetImage(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedPetImage = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formSent.imagePet = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedPetImage = ''; // Reset if no file is selected
    }
  }

  selectedPetLicence: string = '';
  // Method untuk menangani pemilihan file
  onFilePetLicence(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedPetLicence = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formSent.licencePet = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedPetLicence = ''; // Reset if no file is selected
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

  onValueChange(event: any, type: string) {
    if (type === 'type_of_pet') {
      this.formSent.typeOfPet = event;
    } else if (type === 'breed_of_pet') {
      this.formSent.typeOfBreed = event;
    } else if (type === 'notes_for_management') {
      this.formSent.notesForManagement = event.target.value;
    }
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
      model: 'fs.residential.family.access.card',
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
          type_of_pet: this.formSent.typeOfPet,
          pet_breed: this.formSent.typeOfBreed,
          pet_license: this.formSent.licencePet,
          pet_image: this.formSent.imagePet,
          notes: this.formSent.notesForManagement,
          payment_receipt: result.data[1],
          stripe_id: this.stripeId
        }, 'post/request_pet_registration').subscribe((response: any) => {
          this.router.navigate(['raise-a-request-page'])
          this.functionMain.presentToast('Pet registration completed successfully', 'success')
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
        this.formSent.paymentReceipt = result.data;
        if (this.formSent.paymentReceipt === result.data) {
          this.mainApi.endpointMainProcess({
            type_of_pet: this.formSent.typeOfPet,
            pet_breed: this.formSent.typeOfBreed,
            pet_license: this.formSent.licencePet,
            pet_image: this.formSent.imagePet,
            notes: this.formSent.notesForManagement,
            payment_receipt: this.formSent.paymentReceipt
          }, 'post/request_pet_registration').subscribe((response: any) => {
            this.router.navigate(['raise-a-request-page'])
            this.functionMain.presentToast('Pet registration completed successfully', 'success')
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
      this.mainApi.endpointMainProcess({
        type_of_pet: this.formSent.typeOfPet,
        pet_breed: this.formSent.typeOfBreed,
        pet_license: this.formSent.licencePet,
        pet_image: this.formSent.imagePet,
        notes: this.formSent.notesForManagement,
        payment_receipt: this.formSent.paymentReceipt
      }, 'post/request_pet_registration').subscribe((response: any) => {
        this.router.navigate(['raise-a-request-page'])
        this.functionMain.presentToast('Pet registration completed successfully', 'success')
      })
    }
  }
}
