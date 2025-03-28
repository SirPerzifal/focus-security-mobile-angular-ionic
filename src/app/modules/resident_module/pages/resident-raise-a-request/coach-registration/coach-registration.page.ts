import { trigger, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalChoosePaymentMethodComponent } from 'src/app/shared/resident-components/modal-choose-payment-method/modal-choose-payment-method.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';

@Component({
  selector: 'app-coach-registration',
  templateUrl: './coach-registration.page.html',
  styleUrls: ['./coach-registration.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class CoachRegistrationPage implements OnInit {

  selectedOption: string = '';
  coachingType: any = [];
  facilityRequired: any = [];
  dateNow = new Date().toISOString().slice(0, 10);
  agreementChecked: boolean = false;
  extend_mb = false
  showNextForm: boolean = false; // New variable to control visibility of next-form
  expectedCoach: any = [];
  formData = {
    block_id: 0,
    unit_id: 0,
    coach_name: '',
    contact_number: '',
    coach_sex: '',
    nationality: 'tes',
    affliated_organization: '',
    coaching_reg_number: '',
    type_of_coaching: '',
    facility_required: '',
    facility_required_other: '',
    expected_start_date: '',
    duration_per_session: '',
    registered_coach_id: 0,
  }

  amountPayable: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false,
    isRequirePayment: false,
  }

  otherNationality: string = '';
  otherCoachType: string = '';
  otherFacility: string = '';

  constructor(private modalController: ModalController, private alertController: AlertController, private raiseARequestService: RaiseARequestService, private toastController: ToastController, private router: Router, private mainApiResidentService: MainApiResidentService) { }

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
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.formData.unit_id = Number(parseValue.unit_id); // Mengambil nilai unit dari objek
        this.formData.block_id = Number(parseValue.block_id); // Mengambil nilai block dari objek
        this.project_id = Number(parseValue.project_id)
        this.loadAmount();
      }
    });
  }

  project_id = 0

  loadAmount() {
    this.mainApiResidentService.endpointProcess({
      project_id: this.project_id
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
      this.onSubmitCoach('');
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

  onCoachSexChange(event: any) {
    this.formData.coach_sex = event.target.value;
  }

  onCoachNationalityChange(event: any) {
    if (event.target.value === 'Singaporean') {
      this.formData.nationality = event.target.value;
      this.otherNationality = '';
    } else if (event.target.value === 'others') {
      this.otherNationality = event.target.value;
      this.formData.nationality = ''; // Atur ke string kosong untuk menampilkan input "Others"
    }
  }

  onKeyup(event: any) {
    this.formData.nationality = event.target.value; // Atur ke string kosong untuk menampilkan input "Others"
  }

  onNextClick(next: any) {
    if (next === 'next') {
      if (!this.formData.coach_name) {
        this.presentToast('Please fill in the Coach Name field.', 'danger');
        return;
      }
      if (!this.formData.contact_number) {
        this.presentToast('Please fill in the Contact Number field.', 'danger');
        return;
      }
      if (!this.formData.coach_sex) {
        this.presentToast('Please select the Coach Sex field.', 'danger');
        return;
      }
      if (!this.formData.nationality || this.formData.nationality === 'tes') {
        this.presentToast('Please fill in the Nationality field.', 'danger');
        return;
      }
      // // console.log(this.formData);
      
      this.showNextForm = true; // Show next form when Next button is clicked
      this.loadFacilityRequired();
      this.loadTypeCoach();
    } else {
      this.showNextForm = false; // Hide next form when Previous button is clicked
    }
  }

  loadTypeCoach() {
    this.raiseARequestService.getTypeCoach(this.project_id).subscribe(
      (response: any) => {
        if (response.result.response_code === 200) {
          this.coachingType = response.result.coaches_type; // Atau gunakan map jika perlu
        } else {
          this.presentToast('An error occurred while loading coaching type data!', 'danger');
        }
      }
    )
  }

  loadFacilityRequired() {
    this.raiseARequestService.getFacilities().subscribe(
      (response: any) => {
        if (response) {
          this.facilityRequired = response.result;
          // console.log(response);
          
        } else {
          this.presentToast('An error occurred while loading facility required data!', 'danger');
          // console.log(response);
        }
      }
    )
  }

  onCoachingTypeChange(event: any) {
    if (event.target.value === 'others_coaching_type') {
      this.otherCoachType = event.target.value;
      this.formData.type_of_coaching = ''; // Atur ke string kosong untuk menampilkan input "Others"
    } else {
      this.otherCoachType = event.target.value;
      this.formData.type_of_coaching = event.target.value;
    } 
  }

  onCoachingFacilityChange(event: any) {
    if (event.target.value === 'others_facility') {
      this.otherFacility = event.target.value;
      this.formData.facility_required = ''; // Atur ke string kosong untuk menampilkan input "Others"
    } else {
      this.otherFacility = event.target.value;
      this.formData.facility_required = event.target.value;
    }
  }
  onSubmitCoach(paymentReceipt: string) {
    if (!this.formData.type_of_coaching) {
      this.presentToast('Please select the Type of Coaching field.', 'danger');
      return;
    }
    // if (!this.formData.facility_required) {
    //   this.presentToast('Please select the Facility Required field.', 'danger');
    //   return;
    // }
    if (!this.formData.expected_start_date) {
      this.presentToast('Please select the Expected Start Date field.', 'danger');
      return;
    }
    if (!this.formData.duration_per_session) {
      this.presentToast('Please select the Duration per Session field.', 'danger');
      return;
    }
    // console.log(this.formData)
    this.raiseARequestService.postRegiterRequestCoach(
      this.formData.block_id,
      this.formData.unit_id,
      this.project_id,
      paymentReceipt,
      this.formData.coach_name,
      this.formData.contact_number,
      this.formData.coach_sex,
      this.formData.nationality,
      this.formData.affliated_organization,
      this.formData.coaching_reg_number,
      this.formData.type_of_coaching,
      this.formData.facility_required,
      this.formData.facility_required_other,
      this.formData.expected_start_date,
      this.formData.duration_per_session
    ).subscribe (
      (response_from_coach_registered: any) => {
        if (response_from_coach_registered) {
          // console.log(response_from_coach_registered);
          this.presentToast('Coach registration request submitted successfully!','success');
          this.OnDestroy()
          this.router.navigate(['/resident-raise-a-request']);
        } else {
          this.presentToast('An error occurred while submitting the request!', 'danger');
        }
      }
    )
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
        this.onSubmitCoach(receipt);
      }
    });
    return await modal.present();
  }

  loadCoach() {
    this.raiseARequestService.getExpectedCoachByUnit(this.formData.unit_id).subscribe (
      (response: any) => {
        if (response) {
          // console.log(response);
          this.expectedCoach = response.result.registered_coaches;
        } else {
          this.presentToast('An error occurred while loading expected coach data!', 'danger');
        }
      }
    )
  }

  onOptionChange(option: string) {
    this.extend_mb = true
    if (option === 'new_application_coach') {
      this.selectedOption = option;
      this.expectedCoach = [];
    } else if (option === 'deactive_a_coach') {
      this.selectedOption = option;
      this.loadCoach();
    }
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  public async showAlertButtons(headerName: string, className: string, coachId: number) {
    const alertButtons = await this.alertController.create({
      cssClass: className,
      header: headerName,
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.showAlertSecondButtons("This action cannot be reversed and you may need to reapply as a new application", "history-alert alert-banned", coachId);
          },  
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Alert cancel');
          },
        },
      ]
    });
    await alertButtons.present ();
  }

  public async showAlertSecondButtons(headerName: string, className: string, coachId: number) {
    const alertButtons = await this.alertController.create({
      cssClass: className,
      header: headerName,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            // // console.log(this.formData);
            this.formData.registered_coach_id = coachId
            if (this.formData.registered_coach_id) {
              this.raiseARequestService.postRegiterRequestCoach(
                this.formData.block_id,
                this.formData.unit_id,
                0,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                this.formData.registered_coach_id,
              ).subscribe(
                (response_from_coach_deactivated: any) => {
                  if (response_from_coach_deactivated) {                    
                    this.presentToast('Coach deactivation request submitted successfully!','success');
                    this.router.navigate(['/resident-raise-a-request']);
                  } else {
                    this.presentToast('An error occurred while submitting the request!', 'danger');
                  }
                }
              )
            }
          },  
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Alert cancel');
          },
        },
      ]
    });
    await alertButtons.present ();
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
