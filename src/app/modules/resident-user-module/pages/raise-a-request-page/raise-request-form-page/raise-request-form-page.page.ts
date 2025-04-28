import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalComponent } from 'src/app/shared/resident-components/choose-payment-methode/modal/modal.component';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { UploadReceiptModalComponent } from 'src/app/shared/resident-components/upload-receipt-modal/upload-receipt-modal.component';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-raise-request-form-page',
  templateUrl: './raise-request-form-page.page.html',
  styleUrls: ['./raise-request-form-page.page.scss'],
})
export class RaiseRequestFormPagePage implements OnInit {

  subPageName: string = '';
  formDefaultDisplay: any[] = [
    {
      id: 'name_of_resident_applying',
      text: 'Name of Resident Applying',
      disabled: true,
      value: ''
    },
    {
      id: 'block_name',
      text: 'Block Name',
      disabled: true,
      value: ''
    },
    {
      id: 'unit_name',
      text: 'Unit Name',
      disabled: true,
      value: ''
    },
    {
      id: 'mobile_number',
      text: 'Contact Number',
      disabled: true,
      value: ''
    },
    {
      id: 'family_status',
      text: 'Family Status',
      disabled: true,
      value: ''
    }
  ]
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false,
    isRequirePayment: false,
  }

  termsAndCOndition: string = '';
  agreementChecked: boolean = false;

  //forAccessCard
  selectedOptionCard: 'replacement' | 'new_application' | null = null;
  formAccessCard = {
    family_ids: [] as number[],
    payment_receipt: '',
    access_card_replacement_id: [] as number[],
    reason_for_replacement: ''
  }
  expectedCards: any = [];
  expectedFamily: any = [];

  //forOvernightParking
  

  //forCoach
  formNextCoach: boolean = false;

  constructor(
    private router: Router,
    private storage: StorageService,
    private mainApi: MainApiResidentService,
    private modalController: ModalController,
    private functionMain: FunctionMainService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { pageName: any };
    if (state) {
      this.subPageName = `${state.pageName} Form`;
      if (state.pageName === 'Appeal Parking') {
        this.subPageName = state.pageName;
      }
    }
  }

  ngOnInit() {
    this.loadAmount();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.formDefaultDisplay = [
              {
                id: 'name_of_resident_applying',
                text: 'Name of Resident Applying',
                disabled: true,
                value: estate.family_name
              },
              {
                id: 'block_id',
                text: 'Block Name',
                disabled: true,
                value: estate.block_name
              },
              {
                id: 'unit_id',
                text: 'Unit Name',
                disabled: true,
                value: estate.unit_name
              },
              {
                id: 'mobile_number',
                text: 'Contact Number',
                disabled: true,
                value: estate.family_mobile_number
              },
              {
                id: 'family_status',
                text: 'Family Status',
                disabled: true,
                value: estate.family_type
              }
            ]
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
        amountTotal: 'S$' + `${result.result.result.amount_total}`,
        isIncludeGST: result.result.result.is_include_gst,
        isRequirePayment: result.result.result.is_raise_a_request_payment
      };
    })
  }

  async presentModalAgreement() {
    
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

  //forAccessCard
  onChangePurpose(event: any) {
    console.log(event);
    this.selectedOptionCard = event.value;
    this.loadCards();
    this.formAccessCard = {
      family_ids: [] as number[],
      payment_receipt: '',
      access_card_replacement_id: [] as number[],
      reason_for_replacement: ''
    }
  }

  loadCards() {
    // // console.log(this.unit);
    this.mainApi.endpointMainProcess({}, 'get/access_card_family_member_data').subscribe(       
      (response) => {
        if (response) {
          if (response.result) {
            this.expectedFamily = response.result.family_data_with_no_ac.map((family_with_no_ac: any) => {
              return {
                family_id: family_with_no_ac.id,
                family_name: family_with_no_ac.full_name,
                member_type: family_with_no_ac.member_type
              }
            })
          }
          // Flatten the access cards from family members
          this.expectedCards = response.result.family_data.flatMap((member: any) => 
            member.access_cards.map((card: any) => ({
              access_card_id: card.id,
              access_card_number: card.access_card_number,
              access_card_status: card.access_card_status,
              assigned_resident_name: member.full_name, // Assuming you want to show the member's name
              assigned_resident_id: member.id // Assuming you want to show the member's name
            }))
          );
          console.log(this.expectedCards, this.expectedFamily);
          
        } else {
          console.log(response);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    )
  }

  onCardSelect(card: any) {
    const cardId = card.access_card_id;
    const familyId = card.assigned_resident_id;
    const index = this.formAccessCard.access_card_replacement_id.indexOf(cardId); // Mencari indeks dari card_id
    const indexFamily = this.formAccessCard.family_ids.indexOf(cardId); // Mencari indeks dari card_id
  
    if (index === -1) {
      // Jika card_id tidak ada dalam array, tambahkan
      this.formAccessCard.access_card_replacement_id.push(cardId);
      if (indexFamily === -1) {
        this.formAccessCard.family_ids.push(familyId);
      } else {
        this.formAccessCard.family_ids.push(indexFamily, 1);
      }
    } else {
      // Jika access_card_replacement_id sudah ada, hapus
      this.formAccessCard.access_card_replacement_id.splice(index, 1); // Menghapus elemen pada indeks yang ditemukan
    }
  }

  onNewCardSelect(type: number) {
    const index = this.formAccessCard.family_ids.indexOf(type); // Mencari indeks dari family_id
  
    if (index === -1) {
      // Jika family_id tidak ada dalam array, tambahkan
      this.formAccessCard.family_ids.push(type);
    } else {
      // Jika family_id sudah ada, hapus
      this.formAccessCard.family_ids.splice(index, 1); // Menghapus elemen pada indeks yang ditemukan
    }
  }

  onReplacementChange(event: any) {
    this.formAccessCard.reason_for_replacement = event;
  }

  onSubmit() {
    if (this.amountType.isRequirePayment) {
      this.payNow(0)
    } else {

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
    this. mainApi.endpointCustomProcess({}, '/create-payment-intent').subscribe((response: any) => {
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

  async manualPay(paymentId: number) {
    const modal = await this.modalController.create({
      component: UploadReceiptModalComponent,
      cssClass: 'upload-receipt-manual-pay',
      componentProps: {}
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (this.subPageName === 'Access Card Form') {
          if (this.agreementChecked) {
            this.mainApi.endpointMainProcess({
              family_ids: this.formAccessCard.family_ids,
              payment_receipt: result.data,
              card_replacement_ids : this.formAccessCard.access_card_replacement_id,
              reason_for_replacement : this.formAccessCard.reason_for_replacement
            }, 'post/request_access_card').subscribe(
              (response: any) => {
                console.log(response);
                if (response.result.status === 'success') {
                  this.functionMain.presentToast('Access card data has been successfully saved!', 'success');
                  this.router.navigate(['/raise-a-request-page-main'])
                } else {
                  this.functionMain.presentToast('Failed to save access card data', 'danger');
                }
              }, (error) => {
                console.error('Error:', error);
              }
            )
          } else {
            this.functionMain.presentToast('Please agree to the terms and conditions before submitting', 'danger');
          }
        }
      } else {
        return
      }
    });

    return await modal.present();
  }
}
