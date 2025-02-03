import { Component, OnInit } from '@angular/core';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bicycle-tag-application',
  templateUrl: './bicycle-tag-application.page.html',
  styleUrls: ['./bicycle-tag-application.page.scss'],
})
export class BicycleTagApplicationPage implements OnInit {

  selectedOption: string = '';
  expectedBicycle: any = [];
  agreementChecked: boolean = false;
  unitId: number = 1; // Replace with actual unit ID
  selectedFileName: string = ''; // New property to hold the selected file name
  extend_mb = false
  formData = {
    id: 0,
    block_id: 1,
    unit_id: 1,
    bicycle_brand: '',
    bicycle_colour: '',
    bicycle_image: '',
    bicycle_tag_id: '',
    amount_payable: '',
  }

  constructor(private raiseARequestService: RaiseARequestService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    console.log('tes');
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
      amount_payable: '',
    }
    this.selectedFileName = '';
    this.selectedOption = option;
    if (option === 'replacement') {
      this.loadBicycle();
      this.agreementChecked = false;
    } else if (option === 'new_application') {
      this.agreementChecked = false;
      this.expectedBicycle = [];
      console.log("tes");
    }
  }

  onFileChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedFileName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
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
        console.log('Response from server:', response);
        this.expectedBicycle = response.result.bicycle_tag_data;
      },
      (error) => {
        console.error('Error submitting form:', error);
        // Handle error response (e.g., show an error message)
      }
    );
  }

  onBicycleSelect(card: any) {
    console.log('Selected Card:', card);
    this.formData.id = card.id;
    this.formData.bicycle_colour = card.bicycle_colour;
    this.formData.bicycle_brand = card.bicycle_brand;
    this.formData.bicycle_tag_id = card.bicycle_tag;
    // Perform action based on selected card
  }

  onSubmit() {
    if (this.selectedOption === 'replacement') {
      if (this.formData.bicycle_brand && this.formData.bicycle_colour && this.formData.amount_payable) {
        console.log(this.formData);
        
        // Kirim data untuk replacement
        this.raiseARequestService.postRequestBicycle(
          this.formData.block_id,
          this.formData.unit_id,
          this.formData.bicycle_brand,
          this.formData.bicycle_colour,
          this.formData.id // Mengirim bicycle_id untuk replacement
        ).subscribe(
          (response) => {
            console.log('Response from server:', response);
            this.formData = {
              id: 0,
              block_id: 1,
              unit_id: 1,
              bicycle_brand: '',
              bicycle_colour: '',
              bicycle_image: '',
              bicycle_tag_id: '',
              amount_payable: '',
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
        console.log('Form is invalid for replacement');
        this.presentToast('Please make sure you fill all the fields', 'danger');
      }
    } else if (this.selectedOption === 'new_application') {
      if (this.formData.bicycle_brand && this.formData.bicycle_colour && this.formData.bicycle_image && this.formData.amount_payable) {
        console.log(this.formData);
        
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
            console.log('Response from server:', response);
            this.formData = {
              id: 0,
              block_id: 1,
              unit_id: 1,
              bicycle_brand: '',
              bicycle_colour: '',
              bicycle_image: '',
              bicycle_tag_id: '',
              amount_payable: '',
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
        console.log('Form is invalid');
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
