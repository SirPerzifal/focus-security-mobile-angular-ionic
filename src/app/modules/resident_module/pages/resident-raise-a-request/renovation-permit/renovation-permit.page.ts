import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { faEraser, faPenFancy } from '@fortawesome/free-solid-svg-icons';
import { Preferences } from '@capacitor/preferences';

import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { FamilyService } from 'src/app/service/resident/family/family.service';
import { SignaturePadComponent } from 'src/app/shared/components/signature-pad/signature-pad.component';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalChoosePaymentMethodComponent } from 'src/app/shared/resident-components/modal-choose-payment-method/modal-choose-payment-method.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-renovation-permit',
  templateUrl: './renovation-permit.page.html',
  styleUrls: ['./renovation-permit.page.scss'],
})
export class RenovationPermitPage implements OnInit {
  @ViewChild('renovationSignContainer') renovationSignComponent!: SignaturePadComponent;

  faPenFancy = faPenFancy
  faEraser = faEraser
  renovationForm: FormGroup;
  agreementChecked: boolean = false; // Status checkbox
  userName: string = '';
  condoName: string = '';
  userPhoneNumber: string = '';
  unit: number = 1; // Replace with actual unit ID
  unitId: number = 1; // Replace with actual unit ID
  block: number = 1; // Replace with actual block ID
  noTel: string = '';
  projectId: number = 0;
  extend_mb = true
  isModalOpen: boolean = false; // Status modal
  dateNow = new Date().toISOString().slice(0, 10);
  contactPerson: string = '';
  expectedFamilyMember = [
    { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date() }
  ];
  renovationSigned: string = '';
  isRenovationSigned = false
  unitIdForGetFamily: number = 0;
  amountPayable: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false,
    
    isRequirePayment: false,
  }

  constructor(private modalController: ModalController, private familyService: FamilyService, private fb: FormBuilder, private renovationService: RaiseARequestService, private toastController: ToastController, private alertController: AlertController,private route: Router, private mainApiResidentService: MainApiResidentService) {
    this.renovationForm = this.fb.group({
      requestorId: [36],
      name_of_resident: ['KingsMan Condominium'],
      phone_number: ['085830122464'],
      renovation_date: ['', Validators.required],
      renovation_time: ['', Validators.required],
      partner_name: ['Veknesh'],
      renovation_type: ['renovation'],
      block: [1],
      unit: [1],
      contact_person_id: [0],
      contractor_contact_person: [''], 
      contractor_contact_number: [''],
      contractor_company_name: [''],
      contractor_vehicle_number: [''],
      renovation_signature: [''],
    });
  }

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

  showTimeInfo() {
    this.isModalOpen = true; // Membuka modal
  }

  onRenovationSign(event: any) {
    this.renovationSigned = event
    this.renovationForm.value.renovation_signature = event.split(',')[1]
  }

  onContactPersonChange(option: string) {
    this.contactPerson = option;
    this.renovationForm.value.contact_person_id = 1;
  }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unitId = Number(parseValue.unit_id);
        this.renovationForm.get('block')!.setValue(Number(parseValue.block_id))        
        this.renovationForm.get('contact_person_id')!.setValue(Number(parseValue.family_id))
        this.unit = parseValue.unit_name;
        this.block = parseValue.block_name;
        this.projectId = parseValue.project_id;
        this.renovationForm.get('unit')!.setValue(Number(parseValue.unit_id));
        this.condoName = parseValue.project_name;
        this.userName = parseValue.family_name;
        this.userPhoneNumber = parseValue.family_mobile_number;
        this.loadExpectedFamily();
        this.loadAmount();
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

  loadCards() {
    this.renovationService.getCardFamilyMember(this.unitId).subscribe(
      (response) => {
        if (response) {
          this.renovationForm.value.requestorId = response.result.family_data[0].id;
        } else {
          this.presentToast('Failed to load card data', 'danger');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  loadExpectedFamily() {
    this.expectedFamilyMember.pop()
    this.familyService.getFamilyList(this.unitIdForGetFamily).subscribe(
      res => {
        var result = res.result['response_result']
        // console.log(result)
        result.forEach((item: any) => {
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
            tenancy_agreement: item['tenancy_aggrement'] });
        });
        this.renovationForm.value.contact_person_id = result[0].id;
      },
      error => {
        // console.log(error)
      }
    )
  }

  onClear() {
    this.renovationSigned = ''
    this.renovationSignComponent.clear();
  }

  onSelect(select: any) {
    // console.log('Selected:', select);
    this.renovationForm.value.contact_person_id = select['id'];
  }

  public async presentCustomAlert(
    header: string = 'By clicking "Confirm," you consent to sharing your name, contact number, and address with your designated contractor', 
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel',
  ) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: header,
      message: '', 
      buttons: [
        {
          text: confirmText,
          cssClass: 'confirm-button',
          handler: () => {
            this.processSubmit();
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
          }
        },
      ]
    });
  
    await alert.present(); // Tambahkan baris ini
  }

  processSubmit() {
    if (this.amountType.isRequirePayment) {
      this.presentChoosePaymentMethodeModal();
    } else {
      this.onSubmit('');
    }
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
    if (this.renovationForm.valid) {
      if (!this.renovationForm.value.renovation_signature) {
        this.presentToast('Please provide your sign.', 'danger');
        return
      }
      // console.log(this.renovationForm.value);

      // Gabungkan renovation_date dan renovation_time
      const renovationDate = this.renovationForm.value.renovation_date;
      const renovationTime = this.renovationForm.value.renovation_time;

      // Format menjadi string ISO
      const formattedDateTime = new Date(`${renovationDate}T${renovationTime}`);

      // Panggil service untuk mengirim data
      this.renovationService.postSchedule(
        formattedDateTime.toISOString(),
        this.renovationForm.value.requestorId,
        this.renovationForm.value.renovation_type,
        this.renovationForm.value.block,
        this.renovationForm.value.unit,
        this.projectId,
        paymentReceipt,
        this.renovationForm.value.contact_person_id,
        this.renovationForm.value.renovation_signature,
        this.renovationForm.value.contractor_contact_person,
        this.renovationForm.value.contractor_contact_number,
        this.renovationForm.value.contractor_company_name,
        this.renovationForm.value.contractor_vehicle_number
      ).subscribe({
        next: (response) => {
          if (response.result.response_code === 400) {
            // console.log(this.renovationForm);
            this.presentToast('Theres something wrong when submit your form!', 'danger');
          } else {
            // console.log('Response:', response);
            this.OnDestroy();
            this.presentToast('Request submitted successfully!', 'success');
            this.route.navigate(['resident-raise-a-request'])
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.presentToast('Failed to submit request.', 'danger');
        }
      });
    } else {
      // console.log('Form is invalid');
      this.presentToast('Form is invalid. Please fill all required fields.', 'danger');
    }
  }

  navigateToEditFamily(family: any) {
    // console.log(family)
    this.route.navigate(['/family-edit-member'], {
      state: {
        id: family.id,
        type: family.type,
        hard_type: family.hard_type,
        name: family.name,
        mobile: family.mobile,
        head_type: family.head_type,
        nickname: family.nickname,
        email: family.email,
        end_date: family.end_date,
        tenant: family.tenant,
        warning: family.warning,
        status: family.status, // Tambahkan ini jika perlu
      }
    });
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
  OnDestroy() {
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
