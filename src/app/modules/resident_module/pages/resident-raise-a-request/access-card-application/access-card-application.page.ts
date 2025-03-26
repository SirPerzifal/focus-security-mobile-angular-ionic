import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalChoosePaymentMethodComponent } from 'src/app/shared/resident-components/modal-choose-payment-method/modal-choose-payment-method.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-access-card-application',
  templateUrl: './access-card-application.page.html',
  styleUrls: ['./access-card-application.page.scss'],
})
export class AccessCardApplicationPage implements OnInit {
  selectedOption: string = '';
  expectedCards: any = [];
  expectedFamily: any = [];
  agreementChecked: boolean = false;
  projectId: number = 0;
  userName: string = '';
  phoneNumber: string = '';
  familyType: string = '';
  unit: number = 0; // Replace with actual unit ID
  unitId: number = 0; // Replace with actual unit ID
  block: number = 0; // Replace with actual block ID
  noTel: string = '';
  qrCodeImage: string = '';
  selectedPaymentMethod: string = '';
  amountPayable: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false
  }

  extend_mb = false;

  formData = {
    card_id: 0,
    block_id: 1,
    unit_id: 1,
    card_number: '',
    card_holder_name: '',
    card_holder_type: '',
    card_type: '',
    card_expiry_date: '',
    card_cvv: '',
    family_id: 36,
    reason: '',
  }

  constructor(private modalController: ModalController, private router: Router, private raiseARequestService: RaiseARequestService, private toastController: ToastController, private mainApiResidentService: MainApiResidentService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.formData.family_id = Number(parseValue.family_id)
        this.projectId = Number(parseValue.project_id);
        this.unitId = Number(parseValue.unit_id);
        this.unit = parseValue.unit_name;
        this.block = parseValue.block_name;
        this.phoneNumber = parseValue.family_mobile_number;
        this.userName = parseValue.family_name;
        this.familyType = parseValue.family_type;
      }
    })
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
    this.selectedOption = option;
    if (option === 'replacement') {
      this.loadCards();
      this.agreementChecked = false;
    } else if (option === 'new_application') {
      this.loadCards();
      this.agreementChecked = false;
      this.expectedCards = [];
    }
  }

  loadCards() {
    // // console.log(this.unit);
    
    this.raiseARequestService.getCardFamilyMember(Number(this.unitId)).subscribe(
      (response) => {
        if (response) {
          // console.log(response);
          if (response.result.family_data_with_no_ac) {
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
              assigned_resident_name: member.full_name // Assuming you want to show the member's name
            }))
          );
        } else {
          this.presentToast('Failed to load card data', 'danger');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onCardSelect(card: any) {
    
    if (this.formData.card_id !== 0) { // Periksa jika card_id tidak kosong
        if (this.formData.card_id === card.access_card_id) { // Gunakan === untuk perbandingan
            this.formData.card_id = 0; // Kosongkan jika sama
            // // console.log("tes1", this.formData.card_id);
        } else {
            this.formData.card_id = card.access_card_id; // Isi dengan access_card_id jika tidak sama
            // // console.log("tes2", this.formData.card_id);
        }
        // // console.log("tes3", this.formData.card_id);
    } else {
        this.formData.card_id = card.access_card_id; // Isi jika kosong
    }
    // Lakukan aksi berdasarkan kartu yang dipilih
}

  onNewCardSelect(type: any) {
    // console.log('New Card Type:', type);
    this.formData.family_id = type;
    // Perform action based on selected card type
  }

  selectPaymentMethod(method: 'card' | 'paynow') {
    this.selectedPaymentMethod = method;
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

  onSubmit(paymentReceipt: string) {
    if (this.selectedOption === 'replacement' && this.agreementChecked) {
      this.raiseARequestService.postRequestCard(
        this.formData.family_id,
        this.projectId,
        paymentReceipt,
        this.formData.card_id,
        this.formData.reason
      ).subscribe(
        (response) => {
          // console.log(response);
          if (response.result.status === 'success') {
            this.presentToast('Access card data has been successfully saved!', 'success');
            this.router.navigate(['resident-raise-a-request'])
            this.ngOnDestroy();
          } else {
            this.presentToast('Failed to save access card data', 'danger');
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else if (this.selectedOption === 'new_application' && this.agreementChecked) {
      this.raiseARequestService.postRequestCard(
        this.formData.family_id,
        this.projectId,
        paymentReceipt
      ).subscribe(
        (response) => {
          // console.log(response);
          if (response.result.status === 'success') {
            this.presentToast('Access card data has been successfully saved!', 'success');
            this.router.navigate(['resident-raise-a-request'])
            this.ngOnDestroy();
          } else {
            this.presentToast('Failed to save access card data', 'danger');
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      this.presentToast('Please fill all field and agree to the terms and conditions before submitting', 'danger');
    }
  }

  termsAndCOndition: string = '';

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

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onCheck(focus: any) {
    this.extend_mb = focus
    this.agreementChecked = true;
    if (this.agreementChecked = true) {
      this.agreementChecked = false;
    }
  }
}
