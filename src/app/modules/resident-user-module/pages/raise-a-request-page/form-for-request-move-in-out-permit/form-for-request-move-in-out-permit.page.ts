import { Component, OnInit } from '@angular/core';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { trigger, style, animate, transition } from '@angular/animations';

import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { Router } from '@angular/router';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/shared/resident-components/choose-payment-methode/modal/modal.component';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { UploadReceiptModalComponent } from 'src/app/shared/resident-components/upload-receipt-modal/upload-receipt-modal.component';

@Component({
  selector: 'app-form-for-request-move-in-out-permit',
  templateUrl: './form-for-request-move-in-out-permit.page.html',
  styleUrls: ['./form-for-request-move-in-out-permit.page.scss'],
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
export class FormForRequestMoveInOutPermitPage implements OnInit {
  isModalInfoTimeOpen: boolean = false;
  expectedFamilyMember: any = [];
  agreementChecked: boolean = false;

  amountPayable: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false,
    isRequirePayment: false,
  }
  
  fromDisplay = {
    family_id: 0,
    family_name: '',
    block_name: '',
    unit_name: '',
    mobile_number: ''
  }
  minDate: string = '';
  selectedDate: string = '';
  contactPerson = {
    sameAsAbove: false,
    appointAnotherFamily: false
  }
  formSent = {
    requestDate: '',
    timeMove: '',
    typeSubmit: '',
    personAssign: 0,
    contractorContactPerson: '',
    contractorContactNumber: '',
    contractorCompanyName: '',
    contractorVehicleNumber: '',
    paymentReceipt: '',
  }

  constructor(
    private storage: StorageService,
    private functionMain: FunctionMainService,
    private mainApi: MainApiResidentService,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadAmount();
    this.getTodayDate();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.fromDisplay = {
              family_id: estate.family_id,
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
        const [first, second] = amountTotalStr.split('.');
        if (first && second) {
          if (second && second.length > 1) {
            this.amountPayable = `S$${first}.${second}`;
          } else {
            this.amountPayable = `S$${first}.${second}0`;
          }
        } else if (first) {
          this.amountPayable = `S$${first}.00`;
        }
      }
    });
  }

  getFamilyList() {
    this.expectedFamilyMember.pop();
    this.expectedFamilyMember = []
    this.mainApi.endpointMainProcess({}, 'get/get_family').subscribe((response: any) => {
      var result = response.result['response_result'];
      this.expectedFamilyMember.pop();
      this.expectedFamilyMember = [];
      result.filter((item: any) => item['family_id'] !== this.fromDisplay.family_id).forEach((item: any) => {
        // Jika stateFill tidak ada, tambahkan semua item
        this.expectedFamilyMember.push({
          id: item['family_id'], 
          type: item['member_type'], 
          hard_type: item['member_hard_type'], 
          name: item['family_full_name'], 
          mobile: item['family_mobile_number'], 
          nickname: item['family_nickname'], 
          email: item['family_email'], 
          head_type: item['member_hard_type'] == 'tenants' ? 'Tenants' : 'Family',
          end_date: item['end_of_tenancy_aggrement'],
          status: item['states'],
          tenancy_agreement: item['tenancy_aggrement'],
          family_photo: item['family_photo'],
          reject_reason: item['reject_reason']
        });
      });
    })
    // // console.log(this.stateFill);
    // console.log("tes", this.familyData);
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

  showTimeInfo() {
    this.isModalInfoTimeOpen = true; // Membuka modal
  }

  navigateToEditFamily(data: any) {
    this.router.navigate(['/family-form'], {
      state: {
        for: 'editData',
        from: 'raise-a-request',
        id: data.id,
        type: data.type,
        hard_type: data.hard_type,
        name: data.name,
        mobile: data.mobile,
        head_type: data.head_type,
        nickname: data.nickname,
        email: data.email,
        end_date: data.end_date,
        tenant: data.tenant,
        warning: data.warning,
        status: data.status, // Tambahkan ini jika perlu
        profile_image: data.family_photo,
        reject_reason: data.reject_reason
      }
    });
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

  onChangeRadio(event: any, type: string) {
    if (type === 'type_move') {
      this.formSent.typeSubmit = event.value;
    } else if (type === 'appoint_family') {
      this.formSent.personAssign = event['id']
      console.log(this.formSent.personAssign);
      
    } else {
      if (event.value === 'same_as_above') {
      this.formSent.personAssign = this.fromDisplay.family_id;
      console.log(this.formSent.personAssign);
        this.contactPerson = {
          sameAsAbove: true,
          appointAnotherFamily: false
        }
      } else {
        this.expectedFamilyMember = []
        this.getFamilyList();
        this.contactPerson = {
          sameAsAbove: false,
          appointAnotherFamily: true
        }
      }
    }
  }
  
  async presentModalAgreement() {
    const modal = await this.modalController.create({
      component: TermsConditionModalComponent,
      cssClass: 'terms-condition-modal',
    });
    modal.onDidDismiss().then((result) => {
      if (result) {
        // Handle result if needed
      }
    });
    return await modal.present();
  }

  onValueChange(event: any, type: string) {
    if (type === 'time_move') {
      this.formSent.timeMove = event;
    } else if (type === 'contact_person_contractor') {
      this.formSent.contractorContactPerson = event;
    } else if (type === 'contact_number_contractor') {
      this.formSent.contractorContactNumber = event;
    } else if (type === 'company_name_contractor') {
      this.formSent.contractorCompanyName = event;
    } else if (type === 'vehicle_number_contractor') {
      this.formSent.contractorVehicleNumber = event;
    }
  }

  onClick(type: string) {
    console.log('type', type, this.formSent);
    if (this.amountType.isRequirePayment) {
      this.payNow(0);
    } else {
      this.mainApi.endpointMainProcess({
        schedule_date: this.formSent.requestDate,
        schedule_type: this.formSent.typeSubmit,
        contact_person_id: this.formSent.personAssign,
        contractor_contact_person: this.formSent.contractorContactPerson, 
        contractor_contact_number: this.formSent.contractorContactNumber,
        contractor_company_name: this.formSent.contractorCompanyName,
        contractor_vehicle_number: this.formSent.contractorVehicleNumber,
        payment_receipt: this.formSent.paymentReceipt,
      }, 'post/request_schedule_permit').subscribe((response: any) => {
        if (response.result.response_code === 200) {
          this.functionMain.presentToast('Successfully added add schedule.', 'success');
          this.router.navigate(['/raise-a-request-page']);
        } else if (response.result.response_code === 400) {
          this.functionMain.presentToast('Failed added add schedule.', 'danger');
        }
      })
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
    this.mainApi.endpointCustomProcess({}, '/create-payment-intent').subscribe((response: any) => {
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
          this.mainApi.endpointMainProcess({
            schedule_date: this.formSent.requestDate,
            schedule_type: this.formSent.typeSubmit,
            contact_person_id: this.formSent.personAssign,
            contractor_contact_person: this.formSent.contractorContactPerson, 
            contractor_contact_number: this.formSent.contractorContactNumber,
            contractor_company_name: this.formSent.contractorCompanyName,
            contractor_vehicle_number: this.formSent.contractorVehicleNumber,
            payment_receipt: this.formSent.paymentReceipt,
          }, 'post/request_schedule_permit').subscribe((response: any) => {
            if (response.result.response_code === 200) {
              this.functionMain.presentToast('Successfully added add schedule.', 'success');
              this.router.navigate(['/raise-a-request-page']);
            } else if (response.result.response_code === 400) {
              this.functionMain.presentToast('Failed added add schedule.', 'danger');
            }
          })
        }
      } else {
        return
      }
    });

    return await modal.present();
  }

}
