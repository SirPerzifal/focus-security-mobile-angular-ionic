import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { AlertController, ModalController } from '@ionic/angular';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ModalComponent } from 'src/app/shared/resident-components/choose-payment-methode/modal/modal.component';
import { ModalPaymentCustomComponent } from 'src/app/shared/resident-components/modal-payment-custom/modal-payment-custom.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-form-for-coach-registration',
  templateUrl: './form-for-coach-registration.page.html',
  styleUrls: ['./form-for-coach-registration.page.scss'],
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
export class FormForCoachRegistrationPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private functionMain: FunctionMainService,
    private mainApi: MainApiResidentService,
    private alertController: AlertController,
    private storage: StorageService,
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
            this.projectId = estate.project_id;
          }
        })
      }
    })
    
    this.mainApi.endpointCustomProcess({}, '/fs-get-country-code').subscribe((value: any) => {
      console.log(value)
      if (value && value.result.country_code_data.length > 0) {
        this.countryCodes = value.result.country_code_data.map((value: any) => {
          return {
            country: value.country,
            code: value.code,
            minDigit: value.min_digit,
            maxDigit: value.max_digit,
          }
        }).sort((a: any, b: any) => {
          if (a.country === 'SG') return -1;
          if (b.country === 'SG') return 1;
          return a.country.localeCompare(b.country); // urutan alfabetis untuk yang lain
        });
        console.log(JSON.stringify(this.countryCodes));
      }
    })
  }

  amountPayable: string = '';
  amountType = {
    amountUntaxed: 0,
    amountTaxed: 0,
    amountTotal: 0,
    isIncludeGST: false,
    isRequirePayment: false,
  }

  pageName: string = 'Form New Coach';
  agreementChecked: boolean = false;
  navButtonsSub: any[] = [
    {
      text: 'Form New Coach',
      active: true,
      action: 'click'
    },
    {
      text: 'Deactive Coach',
      active: false,
      action: 'click'
    }
  ]
  countryCodes: any[] = []
  coachingType: any = [];
  facilityRequired: any = [];

  expectedCoach: any = [];

  formStatus = {
    first: true,
    second: false,
  }
  nationalityDisplay: string = '';
  nationality = {
    singaporean: true,
    other: false
  }
  typeOfCoachingDisplay: string = '';
  typeOfCoaching = {
    typeFromBack: true,
    other: false
  }
  facilityDisplay: string = '';
  facility = {
    facilityFromBack: true,
    other: false
  }
  selectedDate: string = '';
  minDate: string = '';
  contactNumberDefault: string = 'null';
  countryCode: number = 65;
  formSent = {
    nameCoach: '',
    contactNumberCoach: '',
    vehicleNumber: '',
    sex: '',
    nationality: '',
    organizationAffiliateWith: '',
    coachingRegNumber: '',
    expectedStartDate: new Date(),
    durationPerSession: '',
    typeOfCoaching: '',
    facilityRequired: '',
    paymentReceipt: ''
  }

  getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    this.minDate = `${yyyy}-${mm}-${dd}`;
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

  onClickNavButton(event: any) {
    console.log(event);
    
    this.pageName = `${event[1]}`;

    if (this.pageName === 'Deactive Coach') {
      this.loadCoach();
    }

    // Reset semua tombol menjadi tidak aktif
    this.navButtonsSub.forEach(button => {
      button.active = false;
    });

    // Aktifkan tombol yang sesuai
    const selectedButton = this.navButtonsSub.find(button => button.text === event[1]);
    if (selectedButton) {
      selectedButton.active = true;
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

  async payNow(paymentId: number) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'choose-pay-modal',
      componentProps: {
        paymentId: paymentId
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.processPayment(result.data);
      } else {
        return;
      }
    });
    return await modal.present();
  }

  processPayment(result: any) {
    if (result[1] === 'electronic') {
      this.electricPay(result[0]);
    } else {
      this.manualPay(result[2]);
    }
  }

  projectId: number | null = null;
  electricPay(stripe: any) {
    this.mainApi.endpointCustomProcess({
      project_id: this.projectId,
      model: 'fs.residential.registered.coaches',
      from: 'raise-a-request-page'
    }, '/create-payment-intent'
    ).subscribe((response: any) => {
      const clientSecret = response.result.Intent.client_secret;
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
        // Handle payment success
        this.formSent.paymentReceipt = result.data[1];
        this.submitCoachRegistration(this.stripeId);
      } else {
        return;
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
        this.submitCoachRegistration();
      } else {
        return;
      }
    });

    return await modal.present();
  }

  // Helper method untuk prepare facility data
  private prepareFacilityData(): { facility_required: number | null, facility_required_other: string } {
    // Jika facilityRequired adalah "other", return null untuk facility_required dan string untuk facility_required_other  
    if (this.formSent.facilityRequired === 'other' || this.facility.other) {
      return {
        facility_required: null,
        facility_required_other: this.formSent.facilityRequired
      };
    }
    
    // Jika bukan "other", cek apakah nilai ada di facilityRequired array
    const facilityId = parseInt(this.formSent.facilityRequired);
    const facilityExists = this.facilityRequired.find((facility: any) => facility.facility_id === facilityId);
    
    if (facilityExists) {
      return {
        facility_required: facilityId,
        facility_required_other: ''
      };
    } else {
      // Jika facility ID tidak ditemukan, treat as "other"
      return {
        facility_required: null,
        facility_required_other: this.formSent.facilityRequired
      };
    }
  }

  // Method terpisah untuk submit coach registration
  private submitCoachRegistration(stripeId?: string) {
    const facilityData = this.prepareFacilityData();
    
    const payload = {
      coach_name: this.formSent.nameCoach,
      contact_number: this.formSent.contactNumberCoach,
      vehicle_number: this.formSent.vehicleNumber,
      coach_sex: this.formSent.sex,
      nationality: this.formSent.nationality,
      affliated_organization: this.formSent.organizationAffiliateWith,
      coaching_reg_number: this.formSent.coachingRegNumber,
      type_of_coaching: this.formSent.typeOfCoaching,
      facility_required: facilityData.facility_required,
      facility_required_other: facilityData.facility_required_other,
      expected_start_date: this.formSent.expectedStartDate,
      duration_per_session: this.formSent.durationPerSession,
      payment_receipt: this.formSent.paymentReceipt,
      stripe_id: ''
    };

    if (stripeId) {
      payload['stripe_id'] = stripeId;
    }

    this.mainApi.endpointMainProcess(payload, 'post/request_register_coach').subscribe(
      (response: any) => {
        this.functionMain.presentToast('Successfully added coach.', 'success');
        this.router.navigate(['/raise-a-request-page']);
      },
      (error: any) => {
        console.error('Error submitting coach registration:', error);
        this.functionMain.presentToast('Failed to register coach. Please try again.', 'danger');
      }
    );
  }

  onClick(type: string) {
    console.log(this.formSent)
    if (type === 'submit') {
      // Validate required fields
      let errMsg = this.validateForm();
      if (errMsg !== '') {
        this.functionMain.presentToast(errMsg, 'danger');
        return;
      }

      if (this.amountType.isRequirePayment) {
        this.payNow(0);
      } else {
        this.submitCoachRegistration();
      }
    } else if (type === 'next') {
      console.log(this.formSent);

      let errMsg = '';
      if (this.formSent.nameCoach === "") {
        errMsg += 'Please provide the name of coach.\n';
      }
      if (this.formSent.contactNumberCoach === "") {
        errMsg += 'Please provide the contact number of coach.\n';
      }
      if (this.formSent.vehicleNumber === "") {
        errMsg += 'Please provide the vehicle number of coach.\n';
      }
      if (this.formSent.coachingRegNumber === "") {
        errMsg += 'Please provide the reg number of coach.\n';
      }
      if (!this.formSent.nationality) {
        errMsg += 'Please select or type the nationality.\n';
      }

      if (errMsg === '') {
        this.formStatus = {
          first: false,
          second: true
        };
        this.loadFacilityRequired();
        this.loadTypeCoach();
      } else {
        this.functionMain.presentToast(errMsg, 'danger');
      }
    } else if (type === 'back') {
      this.formStatus = {
        first: true,
        second: false
      };
    }
  }

  // Validation method
  private validateForm(): string {
    let errMsg = '';
    
    if (!this.formSent.nameCoach) {
      errMsg += 'Please provide the name of coach.\n';
    }
    if (!this.formSent.contactNumberCoach) {
      errMsg += 'Please provide the contact number of coach.\n';
    }
    if (!this.formSent.vehicleNumber) {
      errMsg += 'Please provide the vehicle number of coach.\n';
    }
    if (!this.formSent.sex) {
      errMsg += 'Please select the sex of coach.\n';
    }
    if (!this.formSent.nationality) {
      errMsg += 'Please select the nationality.\n';
    }
    if (!this.formSent.coachingRegNumber) {
      errMsg += 'Please provide the coaching registration number.\n';
    }
    if (!this.formSent.typeOfCoaching) {
      errMsg += 'Please select the type of coaching.\n';
    }
    if (!this.formSent.facilityRequired) {
      errMsg += 'Please select the facility required.\n';
    }
    if (!this.formSent.durationPerSession) {
      errMsg += 'Please provide the duration per session.\n';
    }
    if (!this.agreementChecked) {
      errMsg += 'Please agree to the terms and conditions.\n';
    }
    
    return errMsg;
  }

  loadTypeCoach() {
    this.mainApi.endpointMainProcess({}, 'get/get_coach_type').subscribe(
      (response: any) => {
        if (response.result.response_code === 200) {
          this.coachingType = response.result.coaches_type;
        } else {
          this.functionMain.presentToast('An error occurred while loading coaching type data!', 'danger');
        }
      },
      (error) => {
        console.error('Error loading coach types:', error);
        this.functionMain.presentToast('An error occurred while loading coaching type data!', 'danger');
      }
    );
  }

  loadFacilityRequired() {
    this.mainApi.endpointMainProcess({}, 'get/facilities').subscribe(
      (response: any) => {
        if (response) {
          this.facilityRequired = response.result;
        } else {
          this.functionMain.presentToast('An error occurred while loading facility required data!', 'danger');
        }
      },
      (error) => {
        console.error('Error loading facilities:', error);
        this.functionMain.presentToast('An error occurred while loading facility required data!', 'danger');
      }
    );
  }

  onValueChange(event: any, type: string) {
    if (type === 'nationality') {
      this.formSent.nationality = event.target.value;
      if (this.formSent.nationality === 'other') {
        this.formSent.nationality = '';
        this.nationalityDisplay = 'other';
        this.nationality = {
          singaporean: false,
          other: true
        };
      } else {
        this.nationalityDisplay = event.target.value;
        this.nationality = {
          singaporean: true,
          other: false
        };
      }
    } else if (type === 'nationality_other') {
      this.formSent.nationality = event;
    } else if (type === 'sex_of_coach') {
      this.formSent.sex = event.target.value;
    } else if (type === 'name') {
      this.formSent.nameCoach = event;
    } else if (type === 'contact_number') {
      console.log(this.countryCode);
      
      const proceedSelectedCountryCode = this.countryCode;
      this.contactNumberDefault = event.target.value;

      // Find the selected country code object from the countryCodes array
      const selectedCountry = this.countryCodes.find(country => country.code === String(proceedSelectedCountryCode));

      if (selectedCountry) {
        const min = selectedCountry.minDigit;
        const max = selectedCountry.maxDigit;

        if (this.contactNumberDefault.length < min) {
          this.functionMain.presentToast('Phone is not minimum character', 'danger');
          return;
        } else if (this.contactNumberDefault.length > max) {
          this.functionMain.presentToast('Phone is reach maximum character', 'danger');
          return;
        }
      } else {
        this.functionMain.presentToast('Invalid country code selected', 'danger');
        return;
      }
      if (this.countryCode && this.contactNumberDefault !== null) {
        const countryData = this.countryCodes.find((code: any) => code.code === this.countryCode);
        const minMaxValue = countryData ? countryData.digit : 8;
        
        if (this.contactNumberDefault.length <= minMaxValue) {
          this.formSent.contactNumberCoach = `${this.countryCode}${this.contactNumberDefault}`;
        } else {
          this.functionMain.presentToast(`Number cannot be more than ${minMaxValue} digits`, 'danger');
        }
      }
    } else if (type === 'vehicle_number') {
      this.formSent.vehicleNumber = event;
    } else if (type === 'organization_affiliate_with') {
      this.formSent.organizationAffiliateWith = event;
    } else if (type === 'coaching_reg_number') {
      this.formSent.coachingRegNumber = event;
    } else if (type === 'country_codes') {
      this.countryCode = Number(event.target.value);
      const countryData = this.countryCodes.find((code: any) => code.code === this.countryCode);
      const minMaxValue = countryData ? countryData.digit : 8;
      
      if (this.contactNumberDefault !== null && this.contactNumberDefault.length > minMaxValue) {
        this.functionMain.presentToast(`Number cannot be more than ${minMaxValue} digits`, 'danger');
      } else if (this.contactNumberDefault !== null) {
        this.formSent.contactNumberCoach = `${this.countryCode}${this.contactNumberDefault}`;
      }
    } else if (type === 'expected_start_date') {
      const date = new Date(event);
      this.selectedDate = this.functionMain.formatDate(date);
      this.formSent.expectedStartDate = date;
    } else if (type === 'duration_per_session') {
      this.formSent.durationPerSession = event;
    } else if (type === 'type_of_coaching') {
      this.formSent.typeOfCoaching = event.target.value;
      if (this.formSent.typeOfCoaching === 'other') {
        this.formSent.typeOfCoaching = '';
        this.typeOfCoachingDisplay = 'other';
        this.typeOfCoaching = {
          typeFromBack: false,
          other: true
        };
      } else {
        this.typeOfCoachingDisplay = event.target.value;
        this.typeOfCoaching = {
          typeFromBack: true,
          other: false
        };
      }
    } else if (type === 'facility_require') {
      this.formSent.facilityRequired = event.target.value;
      if (this.formSent.facilityRequired === 'other') {
        this.formSent.facilityRequired = '';
        this.facilityDisplay = 'other';
        this.facility = {
          facilityFromBack: false,
          other: true
        };
      } else {
        this.facilityDisplay = event.target.value;
        this.facility = {
          facilityFromBack: true,
          other: false
        };
      }
    } else if (type === 'type_of_coaching_other') {
      this.formSent.typeOfCoaching = event;
    } else if (type === 'facility_other') {
      this.formSent.facilityRequired = event;
    }
  }

  loadCoach() {
    this.mainApi.endpointMainProcess({}, 'get/registered_coaches_based_on_unit').subscribe(
      (response: any) => {
        if (response.result.response_result === 'No coach found') {
          this.expectedCoach = [];
        } else {
          this.expectedCoach = response.result.response_result;
        }
      },
      (error) => {
        console.error('Error loading coaches:', error);
        this.expectedCoach = [];
      }
    );
  }

  async viewDetail(coach: any) {
    const alert = await this.alertController.create({
      header: 'Coach Details',
      message: `
        <strong>Coach Name:</strong> ${coach.name}<br>
        <strong>Contact Number:</strong> ${coach.contact_number ? coach.contact_number : '-'}<br>
        <strong>Vehicle Number:</strong> ${coach.vehicle_number ? coach.vehicle_number : '-'}<br>
        <strong>Facility Name:</strong> ${coach.facility_name_other ? coach.facility_name_other : coach.facility_name}<br>
        <strong>Duration Per Session:</strong> ${coach.duration_per_session} (Minute)<br>
      `,
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        },
      ]
    });

    await alert.present();
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
            // User cancelled
          },
        },
      ]
    });
    await alertButtons.present();
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
            this.mainApi.endpointMainProcess({
              registered_coach_id: coachId
            }, 'post/deactivate_coach').subscribe((response: any) => {
              this.functionMain.presentToast('Coach deactivated successfully.', 'success');
              this.onClickNavButton([true, 'Deactive Coach']);
            });
          },  
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // User cancelled
          },
        },
      ]
    });
    await alertButtons.present();
  }
}