import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

interface pet {
  id: number;
  notes: string;
  pet_breed: string;
  pet_image: string;
  type_of_pet: string;
  upload_licence: string;
}

@Component({
  selector: 'app-my-pets-detail',
  templateUrl: './my-pets-detail.page.html',
  styleUrls: ['./my-pets-detail.page.scss'],
})
export class MyPetsDetailPage implements OnInit {
  petList: pet[] = [];
  agreementChecked: boolean = false;
  selectedLicencName: string = ''; // New property to hold the selected file name
  selectedImageName: string = ''; // New property to hold the selected file name
  extend_mb = true
  formData = {
    block_id: 1,
    unit_id: 1,
    pet_id: 0,
    type_of_pet: '',
    pet_breed: '',
    pet_license: '',
    pet_image: '',
    notes: '',
  }

  constructor(private raiseARequestService: RaiseARequestService, private router: Router, private toastController: ToastController) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { pet: any};
    if (state) {
      this.petList = state.pet;
      console.log(this.petList);
      this.formData = {
        block_id: 1,
        unit_id: 1,
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
    console.log("tes");
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

  onLicenceChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedLicencName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
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
        console.log('Base64 successed');
        this.formData.pet_image = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedImageName = ''; // Reset if no file is selected
    }
  }

  onSubmit() {    
    // Submit the form data to the server
    this.raiseARequestService.updatePet(
      this.formData.pet_id,
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
        console.log('Data updated successfully:', res);
        this.router.navigate(['my-profile-my-pets'])
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

  onCheck(focus: any) {
    this.extend_mb = focus
    this.agreementChecked = true;
    if (this.agreementChecked = true) {
      this.agreementChecked = false;
    }
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
        console.log('File is opened');
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
