import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

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
  unitId: number = 1; // Replace with actual unit ID logic
  blokId: number = 1; // Replace with actual
  nameOfResident: string = "kingsman"
  userPhoneNumber: string = '085830122464'; // Replace with actual
  
  vehicleNumberForMyself: string = '';
  purposeParkingForMyself: string = '';
  GST: boolean = false;
  idVisitor: number = 0;
  uploadedFileBase64: string | null = null;

  form: FormGroup;
  expectedVisitors: Visitor[] = [];
  selectedOption: string = ''; // Default selected option
  agreementChecked: boolean = false; // Status checkbox

  @ViewChild('vehicleNumberInput') vehicleNumberInput!: TextInputComponent;

  constructor(private requestService: RaiseARequestService, private fb: FormBuilder, private toastController: ToastController, private router: Router) {
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

  ngOnInit() {
    this.fetchExpectedVisitors();
  }

  fetchExpectedVisitors() {
    this.requestService.getExpectedVisitors(this.unitId).subscribe(
      (response) => {
        if (response.result.response_code === 200) {
          console.log(response);
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
    this.selectedOption = option; // Update the selected option
    this.form.patchValue({ forWhom: option }); // Update the form control for 'forWhom'
    if (option === 'myself') {
      this.form.patchValue({ visitorId: null }); // Update the form control for 'visitorId'
    } else if (option === 'visitor') {
      this.form.patchValue({ vehicleNumber: [''] })
      this.form.patchValue({ purposeOfParking: [''] })
      this.form.patchValue({ agreement: null }); // Update the form control
      this.form.patchValue({ includeGST: '' }); // Update the form control for 'includeGST'
    }
  }

  onFileChange(value: any): void {
    let data = value.target.files[0];
    if (data){
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.uploadedFileBase64 = base64.split(',')[1];
        this.form.patchValue({ agreement: this.uploadedFileBase64 }); // Update the form control
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
    }
    
  }

  onVisitorSelect(visitorId: number) {
    this.idVisitor = visitorId; // Update the local variable
    this.form.patchValue({ visitorId: visitorId }); // Update the form control for 'visitorId'
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      // Send formData to your endpoint
      console.log('Form Data:', formData);
      if (this.form.valid) {
        const formData = this.form.value;
    
        const blockId = Number(formData.block); // Assuming block is a number
        const unitId = this.unitId; // Use the unitId from the component
        const contactNumber = formData.contactNumber; // Assuming this is a string
        const applicantType = formData.forWhom; // 'myself' or 'visitor'
        const vehicleNumber = applicantType === 'myself' ? formData.vehicleNumber : null; // Only if applying for myself
        const visitorId = applicantType === 'visitor' ? formData.visitorId : null; // Only if applying for a visitor
        const purpose = applicantType === 'myself' ? formData.purposeOfParking : null; // Only if applying for myself
        const rentalAgreement = formData.agreement; // Convert boolean to string
        const familyId = 1; // Replace with actual family ID logic if needed
    
        this.requestService.postOvernightFormCar(
          blockId,
          unitId,
          contactNumber,
          applicantType,
          vehicleNumber,
          visitorId,
          purpose,
          rentalAgreement,
          familyId
        ).subscribe(
          (response) => {
            console.log('Response from server:', response);
            // Handle success response (e.g., show a success message)
            this.presentToast('Request submitted successfully!', 'success');
            this.router.navigate(['resident-raise-a-request'])
          },
          (error) => {
            console.error('Error submitting form:', error);
            // Handle error response (e.g., show an error message)
          }
        );
      } else {
        console.log('Form is invalid');
      }
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
}