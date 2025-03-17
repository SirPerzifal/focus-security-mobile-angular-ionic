import { Component, OnInit } from '@angular/core';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { ModalController } from '@ionic/angular';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';

@Component({
  selector: 'app-bicycle-tag-application',
  templateUrl: './bicycle-tag-application.page.html',
  styleUrls: ['./bicycle-tag-application.page.scss'],
})
export class BicycleTagApplicationPage implements OnInit {

  selectedOption: string = '';
  expectedBicycle: any = [];
  agreementChecked: boolean = false;
  userName: string = '';
  condoName: string = '';
  unit: number = 1; // Replace with actual unit ID
  unitId: number = 1; // Replace with actual unit ID
  block: number = 1; // Replace with actual block ID
  noTel: string = '';
  selectedFileName: string = ''; // New property to hold the selected file name
  extend_mb = false
  formData = {
    id: 0,
    block_id: 0,
    unit_id: 0,
    bicycle_brand: '',
    bicycle_colour: '',
    bicycle_image: '',
    bicycle_tag_id: '',
  }

  constructor(private modalController: ModalController, private raiseARequestService: RaiseARequestService, private toastController: ToastController, private router: Router, private getUserInfoService: GetUserInfoService, private authService:AuthService) { }

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
    // Ambil data unit yang sedang aktif
    this.getUserInfoService.getPreferenceStorage(
      [ 
        'user',
        'unit',
        'block_name',
        'unit_name',
        'block',
        'project_name'
      ]
    ).then((value) => {
      const parse_user = this.authService.parseJWTParams(value.user);
      // // console.log(value);
      this.block = value.block_name;
      this.formData.block_id = Number(value.block);
      this.unitId = Number(value.unit);
      this.formData.unit_id = Number(value.unit)
      this.unit = value.unit_name;
      this.condoName = value.project_name;
      this.userName = parse_user.name
      // // console.log('unit', this.unitId);
    })
  }

  onOptionChange(option: string) {
    this.extend_mb = true
    this.selectedOption = '';
    this.formData = {
      id: 0,
      block_id: 1,
      unit_id: 1,
      bicycle_brand: '',
      bicycle_colour: '',
      bicycle_image: '',
      bicycle_tag_id: '',
    }
    this.selectedFileName = '';
    this.selectedOption = option;
    if (option === 'replacement') {
      this.loadBicycle();
      this.agreementChecked = false;
    } else if (option === 'new_application') {
      this.agreementChecked = false;
      this.expectedBicycle = [];
      // console.log("tes");
    }
  }

  onFileChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedFileName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.bicycle_image = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedFileName = ''; // Reset if no file is selected
    }
  }

  loadBicycle() {
    this.raiseARequestService.getBicycletag(this.unitId).subscribe(
      (response) => {
        // console.log('Response from server:', response);
        this.expectedBicycle = response.result.bicycle_tag_data;
      },
      (error) => {
        console.error('Error submitting form:', error);
        // Handle error response (e.g., show an error message)
      }
    );
  }

  onBicycleSelect(card: any) {
    // console.log('Selected Card:', card);
    this.formData.id = card.id;
    this.formData.bicycle_colour = card.bicycle_colour;
    this.formData.bicycle_brand = card.bicycle_brand;
    this.formData.bicycle_tag_id = card.bicycle_tag;
    // Perform action based on selected card
  }

  onSubmit() {
    if (this.selectedOption === 'replacement') {
      if (this.formData.bicycle_brand && this.formData.bicycle_colour) {
        // console.log(this.formData);
        
        // Kirim data untuk replacement
        this.raiseARequestService.postRequestBicycle(
          this.formData.block_id,
          this.formData.unit_id,
          this.formData.bicycle_brand,
          this.formData.bicycle_colour,
          this.formData.id // Mengirim bicycle_id untuk replacement
        ).subscribe(
          (response) => {
            // console.log('Response from server:', response);
            this.formData = {
              id: 0,
              block_id: 1,
              unit_id: 1,
              bicycle_brand: '',
              bicycle_colour: '',
              bicycle_image: '',
              bicycle_tag_id: '',
            }
            this.presentToast('Form submitted successfully','success');
            this.router.navigate(['resident-raise-a-request'])
            this.OnDestroy();
            // Handle successful submission
          },
          (error) => {
            console.error('Error submitting form:', error);
            // Handle error response (e.g., show an error message)
          }
        );
      } else {
        // console.log('Form is invalid for replacement');
        this.presentToast('Please make sure you fill all the fields', 'danger');
      }
    } else if (this.selectedOption === 'new_application') {
      if (this.formData.bicycle_brand && this.formData.bicycle_colour && this.formData.bicycle_image) {
        // console.log(this.formData);
        
        // Kirim data untuk new application
        this.raiseARequestService.postRequestBicycle(
          this.formData.block_id,
          this.formData.unit_id,
          this.formData.bicycle_brand,
          this.formData.bicycle_colour,
          0,
          this.formData.bicycle_image // Mengirim bicycle_image untuk new application
        ).subscribe(
          (response) => {
            // console.log('Response from server:', response);
            this.formData = {
              id: 0,
              block_id: 1,
              unit_id: 1,
              bicycle_brand: '',
              bicycle_colour: '',
              bicycle_image: '',
              bicycle_tag_id: '',
            }
            this.presentToast('Form submitted successfully','success');
            this.router.navigate(['resident-raise-a-request'])
            this.OnDestroy();
            // Handle successful submission
          },
          (error) => {
            console.error('Error submitting form:', error);
            // Handle error response (e.g., show an error message)
          }
        );
      } else {
        // console.log('Form is invalid');
        this.presentToast('Please make sure you fill all the fields', 'danger');
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

  private routerSubscription!: Subscription;
  OnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
