import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { ModalController } from '@ionic/angular';

import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';

@Component({
  selector: 'app-pet-registration',
  templateUrl: './pet-registration.page.html',
  styleUrls: ['./pet-registration.page.scss'],
})
export class PetRegistrationPage implements OnInit {

  agreementChecked: boolean = false;
  selectedLicencName: string = ''; // New property to hold the selected file name
  selectedImageName: string = ''; // New property to hold the selected file name
  extend_mb = true
  formData = {
    block_id: 1,
    unit_id: 1,
    type_of_pet: '',
    pet_breed: '',
    pet_license: '',
    pet_image: '',
    notes: '',
  }
  fromWhere: boolean = false; //
  
  constructor(private modalController: ModalController, private raiseARequestService: RaiseARequestService, private toastController: ToastController, private router: Router, private getUserInfoService: GetUserInfoService, private storage: StorageService) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { from: any};
    if (state) {
      // console.log(state.from);
      this.fromWhere = true
    } 
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

  directTo() {
    if (this.fromWhere) {
      this.router.navigate(['/profile-page-main']);
    } else {
      this.router.navigate(['/resident-raise-a-request']);
    }
  }

  projectId: number = 0;

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.formData.unit_id = estate.unit_id;
            this.formData.block_id = estate.block_id;
            this.projectId = estate.project_id;
          }
        })
      }
    })
  }

  onLicenceChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedLicencName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.pet_license = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedLicencName = ''; // Reset if no file is selected
    }
  }

  onImageChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedImageName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.pet_image = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedImageName = ''; // Reset if no file is selected
    }
  }

  onSubmit() {
    console.log(this.formData)
    // Validate each field
    if (!this.formData.type_of_pet) {
        this.presentToast('Type of pet cannot be empty.', 'danger');
        return; // Stop further execution
    }
    if (!this.formData.pet_breed) {
        this.presentToast('Pet breed cannot be empty.', 'danger');
        return; // Stop further execution
    }
    if (!this.formData.pet_license) {
        this.presentToast('Pet license cannot be empty.', 'danger');
        return; // Stop further execution
    }
    if (!this.formData.pet_image) {
        this.presentToast('Pet image cannot be empty.', 'danger');
        return; // Stop further execution
    }
    if (!this.formData.notes) {
        this.presentToast('Notes cannot be empty.', 'danger');
        return; // Stop further execution
    }

    // If all validations pass
    // Submit the form data to the server
    this.raiseARequestService.postPetAPI(
      this.formData.block_id,
      this.formData.unit_id,
      this.projectId,
      this.formData.type_of_pet,
      this.formData.pet_breed,
      this.formData.pet_license,
      this.formData.pet_image,
      this.formData.notes
    ).subscribe(
      res => {
        // Show success toast and log the form data to the console
        // Replace the following with your own logic to handle the success message and log the data
        // For example, you might want to save the data to a database or send it to a server for further processing
        this.presentToast(res.result.message, 'success');
        // console.log('Data submitted successfully:', res);
        this.router.navigate(['resident-raise-a-request'])
        this.formData = {
          block_id: 1,
          unit_id: 1,
          type_of_pet: '',
          pet_breed: '',
          pet_license: '',
          pet_image: '',
          notes: '',
        }
        this.OnDestroy();
      },
      err => {
        console.error(err);
      }
    );
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
