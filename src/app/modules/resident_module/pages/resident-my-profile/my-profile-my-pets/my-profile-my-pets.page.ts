import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { Subscription } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';

interface pet {
  id: number;
  notes: string;
  pet_breed: string;
  pet_image: string;
  type_of_pet: string;
  upload_license: string;
}

@Component({
  selector: 'app-my-profile-my-pets',
  templateUrl: './my-profile-my-pets.page.html',
  styleUrls: ['./my-profile-my-pets.page.scss'],
})
export class MyProfileMyPetsPage implements OnInit {
  blokId: number = 1;
  unitId: number = 1;
  petList: pet[] = [];

  constructor(private router: Router, private petService: RaiseARequestService, private toastController: ToastController, private alertController: AlertController) {}

  ngOnInit() {
    this.loadPet();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/my-profile-my-pets'){
          this.petList = []
          this.loadPet();
        }
         // Panggil fungsi lagi saat halaman dibuka
      }
    });
  }

  loadPet() {
    this.petService.getPets(
      this.unitId,
      this.blokId,
    ).subscribe(
      (response) => {
        if (response) {
          if (response.result.status === "success") {
            this.petList = response.result.data.map((pet: pet) => ({
              id: pet.id,
              notes: pet.notes,
              pet_breed: pet.pet_breed,
              pet_image: pet.pet_image,
              type_of_pet: pet.type_of_pet,
              upload_license: pet.upload_license,
            }));
          } else {
            this.presentToast('Maybe you dont have a registered pet or not approved yet.', 'danger');
          }
          console.log(response);
        } else {
          this.presentToast('Failed to load pet data', 'danger');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  async deletePets(petID: number) {
    const alert = await this.alertController.create({
      cssClass: 'manage-payment-alert',
      header: 'Delete Pet',
      message: 'Are you sure you want to delete this pet?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass:'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah', blah);
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.deletePetsProses(petID);
          }
        }
      ]
    });
    await alert.present();
  }

  deletePetsProses(petId: number) {
    this.petService.deletePet(
      petId
    ).subscribe(
      (response) => {
        if (response) {
          if (response.result.status === "success") {
            this.petList = [];
            this.loadPet();
          } else {
            this.presentToast('Failed to delete pet data', 'danger');
          }
          console.log(response);
        } else {
          this.presentToast('Failed to load pet data', 'danger');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  navigateToDetailpets(pet: any) {
    this.router.navigate(['my-pets-detail'], {
      state: {
        pet: pet
      }
    })
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

}
