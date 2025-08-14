import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faEraser, faPenFancy } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

import { StorageService } from 'src/app/service/storage/storage.service';
import { SignaturePadComponent } from 'src/app/shared/components/signature-pad/signature-pad.component';
import { ModalComponent } from 'src/app/shared/resident-components/choose-payment-methode/modal/modal.component';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-form-for-request-registration-permit',
  templateUrl: './form-for-request-registration-permit.page.html',
  styleUrls: ['./form-for-request-registration-permit.page.scss'],
})
export class FormForRequestRegistrationPermitPage implements OnInit {
  @ViewChild('renovationSignContainer') renovationSignComponent!: SignaturePadComponent;
  faPenFancy = faPenFancy
  agreementChecked: boolean = false;
  faEraser = faEraser

  amountPayable: string = '';
  amountType = {
    amountUntaxed: 0,
    amountTaxed: 0,
    amountTotal: 0,
    isIncludeGST: false,
    isRequirePayment: false,
  }

  isModalInfoTimeOpen: boolean = false;
  expectedFamilyMember: any = [];
  fromDisplay = {
    family_name: '',
    block_name: '',
    unit_name: '',
    mobile_number: '',
    family_id: 0
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
    contractorContactPerson: '',
    contractorContactNumber: '',
    contractorCompanyName: '',
    contractorVehicleNumber: '',
    personAssign: 0,
    paymentReceipt: '',
    renovationSigned: ''
  }
  projectId: number = 0;
  renovationSigned: string = '';
  isRenovationSigned = false

  constructor(
    private storage: StorageService,
    private functionMain: FunctionMainService,
    private mainApi: MainApiResidentService,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTodayDate();
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
              family_id: estate.family_id
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

  onDateChange(event: any) {
    if (event) {
      const date = new Date(event);
      this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      this.formSent.requestDate = event;
    } else {
      this.selectedDate = ''
    }
  }

  showTimeInfo() {
    this.isModalInfoTimeOpen = true; // Membuka modal
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

  onChangeRadio(event: any, type: string) {
    if (type === 'appoint_family') {
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

  onRenovationSign(event: any) {
    this.renovationSigned = event
    this.formSent.renovationSigned = event.split(',')[1]
  }

  onClear() {
    this.renovationSigned = ''
    this.renovationSignComponent.clear();
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

  onClick(type: string) {
    console.log('type', type, this.formSent);
    if (this.amountType.isRequirePayment) {
      this.payNow(0);
    } else {
      this.mainApi.endpointMainProcess({
        schedule_date: this.formSent.requestDate,
        contact_person_id: this.formSent.personAssign,
        schedule_type: 'renovation',
        contractor_contact_person: this.formSent.contractorContactPerson, 
        contractor_contact_number: this.formSent.contractorContactNumber,
        contractor_company_name: this.formSent.contractorCompanyName,
        contractor_vehicle_number: this.formSent.contractorVehicleNumber,
        payment_receipt: this.formSent.paymentReceipt,
        requestor_signature: this.formSent.renovationSigned
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
    this.mainApi.endpointCustomProcess({
      project_id: this.projectId,
      model: 'fs.residential.request.schedule',
      from: 'raise-a-request-page'
    }, '/create-payment-intent').subscribe((response: any) => {
      const clientSecret = response.result.Intent.client_secret; // Adjust based on your API response structure
      if (clientSecret) {
        this.stripeId = response.result.Intent.id; // Simpan ID pembayaran
        this.presentModal(clientSecret, stripe);
      }
    });
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
            schedule_date: this.formSent.requestDate,
            schedule_type: 'renovation',
            contact_person_id: this.formSent.personAssign,
            contractor_contact_person: this.formSent.contractorContactPerson, 
            contractor_contact_number: this.formSent.contractorContactNumber,
            contractor_company_name: this.formSent.contractorCompanyName,
            contractor_vehicle_number: this.formSent.contractorVehicleNumber,
            payment_receipt: this.formSent.paymentReceipt,
            requestor_signature: this.formSent.renovationSigned
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
