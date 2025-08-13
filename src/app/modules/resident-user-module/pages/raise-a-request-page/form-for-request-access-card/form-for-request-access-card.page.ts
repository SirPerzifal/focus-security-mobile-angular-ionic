import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ModalComponent } from 'src/app/shared/resident-components/choose-payment-methode/modal/modal.component';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-form-for-request-access-card',
  templateUrl: './form-for-request-access-card.page.html',
  styleUrls: ['./form-for-request-access-card.page.scss'],
})
export class FormForRequestAccessCardPage implements OnInit {

  amountPayable: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false,
    isRequirePayment: false,
  }

  fromDisplay = {
    family_name: '',
    block_name: '',
    unit_name: '',
    mobile_number: '',
    applicant_state: ''
  }
  projectId: number = 0;
  agreementChecked: boolean = false;

  expectedCards: any = [];
  expectedFamily: any = [];
  formSent = {
    typeSubmit: '',
    previousCardId: [] as number[],
    reasonForReplacement: '',
    paymentReceipt: '',
    familyToAsign: [] as number[]
  }

  constructor(
    private storage: StorageService, 
    private mainApi: MainApiResidentService, 
    private functionMain: FunctionMainService,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCards();
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
              mobile_number: estate.family_mobile_number,
              applicant_state: estate.family_type,
            }
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

  loadCards() {
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
        } else {
          this.functionMain.presentToast('Failed to load card data', 'danger');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onChangeRadio(event: any) {
    this.formSent = {
      typeSubmit: event.value,
      previousCardId: [] as number[],
      reasonForReplacement: '',
      paymentReceipt: '',
      familyToAsign: [] as number[]
    }
    console.log(event);
    this.formSent.typeSubmit = event.value;
  }

  onNewCardSelect(type: number) {
    const index = this.formSent.familyToAsign.indexOf(type); // Mencari indeks dari family_id
  
    if (index === -1) {
      // Jika family_id tidak ada dalam array, tambahkan
      this.formSent.familyToAsign.push(type);
    } else {
      // Jika family_id sudah ada, hapus
      this.formSent.familyToAsign.splice(index, 1); // Menghapus elemen pada indeks yang ditemukan
    }
  }

  onCardSelect(card: any) {
    const cardId = card.access_card_id;
    const familyId = card.assigned_resident_id;
    const index = this.formSent.previousCardId.indexOf(cardId); // Mencari indeks dari card_id
    const indexFamily = this.formSent.familyToAsign.indexOf(cardId); // Mencari indeks dari card_id
  
    if (index === -1) {
      // Jika card_id tidak ada dalam array, tambahkan
      this.formSent.previousCardId.push(cardId);
      if (indexFamily === -1) {
        this.formSent.familyToAsign.push(familyId);
      } else {
        this.formSent.familyToAsign.push(indexFamily, 1);
      }
    } else {
      // Jika card_id sudah ada, hapus
      this.formSent.previousCardId.splice(index, 1); // Menghapus elemen pada indeks yang ditemukan
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
          family_ids: this.formSent.familyToAsign,
          card_replacement_ids: this.formSent.previousCardId,
          reason_for_replacement: this.formSent.reasonForReplacement,
          payment_receipt: result.data[1] || '', // Use receipt URL if available
          stripe_id: this.stripeId,
        }, 'post/request_access_card').subscribe((response: any) => {
          if (response.result.status === 'success') {
            this.functionMain.presentToast('Successfully added card access', 'success');
            this.router.navigate(['/raise-a-request-page']);
          } else if (response.result.response_code === 400) {
            this.functionMain.presentToast('Failed added card access', 'danger');
          }
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
      console.log(result.data);
      
      if (result.data) {
        this.formSent.paymentReceipt = result.data;
        if (this.formSent.paymentReceipt === result.data) {
          this.mainApi.endpointMainProcess({
            family_ids: this.formSent.familyToAsign,
            payment_receipt: this.formSent.paymentReceipt,
            card_replacement_ids: this.formSent.previousCardId,
            reason_for_replacement: this.formSent.reasonForReplacement
          }, 'post/request_access_card').subscribe((response: any) => {
            if (response.result.status === 'success') {
              this.functionMain.presentToast('Successfully added card access', 'success');
              this.router.navigate(['/raise-a-request-page']);
            } else if (response.result.response_code === 400) {
              this.functionMain.presentToast('Failed added card access', 'danger');
            }
          })
        }
      } else {
        this.functionMain.presentToast('Please upload payment receipt', 'danger');
      }
    });

    return await modal.present();
  }

  onSubmitNext() {
    if (this.amountType.isRequirePayment) {
      if (this.formSent.typeSubmit === 'replacement' && this.formSent.previousCardId.length === 0) {
        this.functionMain.presentToast('Please select a previous card to replace', 'danger');
        return;
      } else if (this.formSent.typeSubmit === 'new_application' && this.formSent.familyToAsign.length === 0) {
        this.functionMain.presentToast('Please select a family member to assign', 'danger');
        return;
      } else {
        this.payNow(0);
      }
    } else {
      if (this.formSent.typeSubmit === 'replacement' && this.formSent.previousCardId.length === 0) {
        this.functionMain.presentToast('Please select a previous card to replace', 'danger');
        return;
      } else if (this.formSent.typeSubmit === 'new_application' && this.formSent.familyToAsign.length === 0) {
        this.functionMain.presentToast('Please select a family member to assign', 'danger');
        return;
      } else {
        this.mainApi.endpointMainProcess({
          family_ids: this.formSent.familyToAsign,
          card_replacement_ids: this.formSent.previousCardId,
          reason_for_replacement: this.formSent.reasonForReplacement,
          payment_receipt: this.formSent.paymentReceipt,
        }, 'post/request_access_card').subscribe((response: any) => {
          if (response.result.status === 'success') {
            this.functionMain.presentToast('Successfully added card access', 'success');
            this.router.navigate(['/raise-a-request-page']);
          } else if (response.result.response_code === 400) {
            this.functionMain.presentToast('Failed added card access', 'danger');
          }
        })
      }
    }
  }

}
