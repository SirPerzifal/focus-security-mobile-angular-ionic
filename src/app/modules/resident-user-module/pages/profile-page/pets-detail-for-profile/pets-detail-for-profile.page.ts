import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

interface pet {
  id: number;
  notes: string;
  pet_breed: string;
  pet_image: string;
  type_of_pet: string;
  upload_licence: string;
}

@Component({
  selector: 'app-pets-detail-for-profile',
  templateUrl: './pets-detail-for-profile.page.html',
  styleUrls: ['./pets-detail-for-profile.page.scss'],
})
export class PetsDetailForProfilePage implements OnInit {
  extend_mb = true
  
  petList: pet[] = [];

  selectedLicencName: string = ''; // New property to hold the selected file name
  selectedImageName: string = ''; // New property to hold the selected file name
  agreementChecked: boolean = false;
  
  formData = {
    pet_id: 0,
    type_of_pet: '',
    pet_breed: '',
    pet_license: '',
    pet_image: '',
    notes: '',
  }

  constructor(
    private router: Router, 
    private mainApiResident: MainApiResidentService,
    private functionMain: FunctionMainService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { pet: any};
    if (state) {
      this.petList = state.pet;
      this.formData = {
        pet_id: state.pet.id, // Update the form control for pet ID
        type_of_pet: state.pet.type_of_pet,
        pet_breed: state.pet.pet_breed,
        pet_license: state.pet.upload_license,
        pet_image: state.pet.pet_image,
        notes: state.pet.notes,
      }
    } 
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['profile-page-main'], {
      state: {
        from: 'pets-detail-for-profile'
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

  onCheck(focus: any) {
    this.extend_mb = focus
    this.agreementChecked = true;
    if (this.agreementChecked = true) {
      this.agreementChecked = false;
    }
  }

  onSubmit() {
    this.mainApiResident.endpointMainProcess({
      pet_id: this.formData.pet_id,
      type_of_pet: this.formData.type_of_pet,
      pet_breed: this.formData.pet_breed,
      pet_license: this.formData.pet_license,
      pet_image: this.formData.pet_image,
      notes: this.formData.notes,
    }, 'post/pet_registration').subscribe((response: any) => {
        // Show success toast and log the form data to the console
        // Replace the following with your own logic to handle the success message and log the data
        // For example, you might want to save the data to a database or send it to a server for further processing
        this.functionMain.presentToast(response.result.message, 'success');
        this.formData = {
          pet_id: 0,
          type_of_pet: '',
          pet_breed: '',
          pet_license: '',
          pet_image: '',
          notes: '',
        }
        // console.log('Data updated successfully:', res);
        this.router.navigate(['profile-page-main'], {
          state: {
            from: 'pets-detail-for-profile'
          }
        })
    })
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


  convertBlobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  downloadFile(href: string, filename: string) {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        // Periksa apakah parentNode tidak null sebelum menghapus
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
    }, 0);
  }

  async seeLicence() {
    try {
      const byteCharacters = atob(this.formData.pet_license);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      if (Capacitor.isNativePlatform()) {
        const base64 = await this.convertBlobToBase64(blob);
        const saveFile = await Filesystem.writeFile({
          path: `${this.formData.notes}.pdf`,
          data: base64,
          directory: Directory.Data
        });
        const path = saveFile.uri;
        await FileOpener.open({
          filePath: path,
          contentType: blob.type
        });
        // console.log('File is opened');
      } else {
        const href = window.URL.createObjectURL(blob);
        this.downloadFile(href, `${this.formData.notes}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      // Optionally, show an error message to the user
    }
  }

  async seePetImage() {
    try {
      const byteCharacters = atob(this.formData.pet_image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      if (Capacitor.isNativePlatform()) {
        const base64 = await this.convertBlobToBase64(blob);
        const saveFile = await Filesystem.writeFile({
          path: `${this.formData.notes}.pdf`,
          data: base64,
          directory: Directory.Data
        });
        const path = saveFile.uri;
        await FileOpener.open({
          filePath: path,
          contentType: blob.type
        });
        // console.log('File is opened');
      } else {
        const href = window.URL.createObjectURL(blob);
        this.downloadFile(href, `${this.formData.notes}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      // Optionally, show an error message to the user
    }
  }
}
