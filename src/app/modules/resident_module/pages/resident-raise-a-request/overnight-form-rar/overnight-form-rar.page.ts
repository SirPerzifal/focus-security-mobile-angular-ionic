import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ModalChoosePaymentMethodComponent } from 'src/app/shared/resident-components/modal-choose-payment-method/modal-choose-payment-method.component';
import { ModalPaymentManualCustomComponent } from 'src/app/shared/resident-components/modal-payment-manual-custom/modal-payment-manual-custom.component';

interface Visitor {
  id: number;
  name: string;
  contact: string | null;
  vehicle: string | null;
}

@Component({
  selector: 'app-overnight-form-rar',
  templateUrl: './overnight-form-rar.page.html',
  styleUrls: ['./overnight-form-rar.page.scss'],
})
export class OvernightFormRarPage implements OnInit {
  projectid: number = 0;
  unitId: number = 1; // Replace with actual unit ID logic
  userName: string = '';
  condoName: string = '';
  unit: number = 1; // Replace with actual unit ID
  block: number = 1; // Replace with actual block ID
  noTel: string = '';
  blokId: number = 1; // Replace with actual
  nameOfResident: string = "kingsman"
  userPhoneNumber: string = '085830122464'; // Replace with actual
  
  vehicleNumberForMyself: string = '';
  purposeParkingForMyself: string = '';
  GST: boolean = false;
  idVisitor: number = 0;
  uploadedFileBase64: string | null = null;
  selectedRentAgreement: string | null = null;
  extend_mb = false

  form: FormGroup;
  expectedVisitors: Visitor[] = [];
  selectedOption: string = ''; // Default selected option
  agreementChecked: boolean = false; // Status checkbox
  isModalAddVehicleNumberOpen: boolean = false;

  formData = {
    visitor_id: 0,
  }

  amountPayable: string = '';
  amountType = {
    amountUntaxed: '',
    amountTaxed: '',
    amountTotal: '',
    isIncludeGST: false,
    isRequirePayment: false,
  }

  constructor(private requestService: RaiseARequestService, private fb: FormBuilder, private toastController: ToastController, private router: Router, private mainApiResidentService: MainApiResidentService, private modalController: ModalController, private storage: StorageService) {
    this.form = this.fb.group({
      residentName: this.nameOfResident,
      block: this.blokId,
      unit: this.unitId,
      contactNumber: this.userPhoneNumber,
      forWhom: [''], // Default to 'myself'
      vehicleNumber: [''],
      purposeOfParking: [''],
      includeGST: [''],
      agreement: [null],
      visitorId: [null], // For selected visitor
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

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.projectid = Number(estate.project_id);
            this.unitId = Number(estate.unit_id);
            this.unit = estate.unit_id;
            this.block = estate.block_id;
            this.condoName = estate.project_name;
            this.userName = estate.family_name;
            this.userPhoneNumber = estate.family_mobile_number;
            this.fetchExpectedVisitors();
            this.loadAmount();
          }
        })
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
      project_id: this.projectid
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

  fetchExpectedVisitors() {
    // console.log(this.unitId);
    
    this.requestService.getExpectedVisitors(Number(this.unitId), Number(this.projectid)).subscribe(
      (response) => {
        if (response.result.response_code === 200) {
          // console.log(response);
          // Transform the result into an array of visitors
          this.expectedVisitors = response.result.result;
        }
      },
      (error) => {
        console.error('Error fetching expected visitors:', error);
      }
    );
  }

  onGSTChange(event: any) {
    const isChecked = event.target.checked; // Get the current checked state
    this.GST = isChecked; // Update the local variable
    this.form.patchValue({ includeGST: isChecked }); // Update the form control for 'includeGST'
  }

  onOptionChange(option: string) {
    this.extend_mb = true
    this.selectedOption = option; // Update the selected option
    this.form.patchValue({ forWhom: option }); // Update the form control for 'forWhom'
    if (option === 'myself') {
      this.form.patchValue({ visitorId: null }); // Update the form control for 'visitorId'
      this.form.patchValue({ vehicleNumber: [''] })
      this.agreementChecked = false;
    } else if (option === 'visitor') {
      this.agreementChecked = false;
      this.form.patchValue({ vehicleNumber: [''] })
      this.form.patchValue({ purposeOfParking: [''] })
      this.form.patchValue({ agreement: null }); // Update the form control
      this.form.patchValue({ includeGST: '' }); // Update the form control for 'includeGST'
    }
  }

  onFileChange(value: any): void {
    let data = value.target.files[0];
    if (data){
      this.selectedRentAgreement = data.name;
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.uploadedFileBase64 = base64.split(',')[1];
        this.form.patchValue({ agreement: this.uploadedFileBase64 }); // Update the form control
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedRentAgreement = '';
    }
  }

  onVisitorSelect(visitorId: number) {
    this.idVisitor = visitorId; // Update the local variable
    this.form.patchValue({ visitorId: visitorId }); // Update the form control for 'visitorId'
  }

  openModalVehicle(visitor: any) {
    this.isModalAddVehicleNumberOpen = true;
    // // console.log(visitor);
    // this.idVisitor = visitor.id; // Update the local variable
    this.formData.visitor_id = visitor.id;
  }

  onVehicleNumberSubmit() {
    const formData = this.form.value;
    const vehicleNumber = formData.vehicleNumber;
    if (formData && vehicleNumber) {
      this.requestService.postUpdateVehicleNumber(
        this.formData.visitor_id,
        vehicleNumber
      ).subscribe(
        (response) => {
          // console.log('Vehicle number updated successfully:', response);
          this.expectedVisitors = []
          if (this.expectedVisitors = []) {
            this.fetchExpectedVisitors();
          }
          this.isModalAddVehicleNumberOpen = false;
        },
        (error) => {
          console.error('Error updating vehicle number:', error);
        }
      )
    }
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

  requestDate = ''

  onRaiseOvernightDate(value: string): void {
    this.requestDate = value;
  }

  onSubmit(paymentReceipt: string) {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.form.valid) {
        const blockId = Number(formData.block); // Assuming block is a number
        const unitId = this.unitId; // Use the unitId from the component
        const contactNumber = formData.contactNumber; // Assuming this is a string
        const applicantType = formData.forWhom; // 'myself' or 'visitor'
        const vehicleNumber = applicantType === 'myself' ? formData.vehicleNumber : null; // Only if applying for myself
        const visitorId = applicantType === 'visitor' ? formData.visitorId : null; // Only if applying for a visitor
        const purpose = applicantType === 'myself' ? formData.purposeOfParking : null; // Only if applying for myself
        const rentalAgreement = formData.agreement; // Convert boolean to string
        const familyId = 15; // Replace with actual family ID logic if needed

        // console.log(blockId,
        //   unitId,
        //   contactNumber,
        //   paymentReceipt,
        //   this.projectid,
        //   applicantType,
        //   vehicleNumber,
        //   visitorId,
        //   purpose,
        //   rentalAgreement,
        //   familyId,
        //   this.requestDate,)

        this.requestService.postOvernightFormCar(
          blockId,
          unitId,
          contactNumber,
          paymentReceipt,
          this.projectid,
          applicantType,
          vehicleNumber,
          visitorId,
          purpose,
          rentalAgreement,
          familyId,
          this.requestDate,
        ).subscribe(
          (response) => {
            // console.log('Response from server:', response);
            if (response.result.response_code === 400) {
              // Handle error response (e.g., show an error message)
              this.presentToast(response.result.error_message, 'danger');
            } else {
              this.presentToast('Request submitted successfully!', 'success');
              this.OnDestroy();
              this.router.navigate(['/resident-raise-a-request']);
            }
          },
          (error) => {
            console.error('Error submitting form:', error);
            // Handle error response (e.g., show an error message)
          }
        );
      } else {
        // console.log('Form is invalid');
      }
    }
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
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

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
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