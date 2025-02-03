import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-access-card-application',
  templateUrl: './access-card-application.page.html',
  styleUrls: ['./access-card-application.page.scss'],
})
export class AccessCardApplicationPage implements OnInit {
  selectedOption: string = '';
  expectedCards: any = [];
  agreementChecked: boolean = false;
  unitId: number = 1; // Replace with actual unit ID
  extend_mb = false

  formData = {
    card_id: 0,
    block_id: 1,
    unit_id: 1,
    card_number: '',
    card_holder_name: '',
    card_type: '',
    card_expiry_date: '',
    card_cvv: '',
    family_id: 1,
    amount_payable: '',
    reason: '',
  }

  constructor(private router: Router, private raiseARequestService: RaiseARequestService, private toastController: ToastController) { }

  ngOnInit() {
    console.log('tes');
    this.loadCards();
  }

  onOptionChange(option: string) {
    this.extend_mb = true
    this.selectedOption = option;
    if (option === 'replacement') {
      this.formData.amount_payable = '';
      this.loadCards();
      this.agreementChecked = false;
    } else if (option === 'new_application') {
      this.formData.amount_payable = '';
      this.agreementChecked = false;
      this.expectedCards = [];
    }
  }

  loadCards() {
    this.raiseARequestService.getCardFamilyMember(this.unitId).subscribe(
      (response) => {
        if (response) {
          
          // Flatten the access cards from family members
          this.expectedCards = response.result.family_data.flatMap((member: any) => 
            member.access_cards.map((card: any) => ({
              access_card_id: card.id,
              access_card_number: card.access_card_number,
              access_card_status: card.access_card_status,
              assigned_resident_name: member.full_name // Assuming you want to show the member's name
            }))
          );
          this.formData.family_id = response.result.family_data[0].id;
        } else {
          this.presentToast('Failed to load card data', 'danger');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onCardSelect(card: any) {
    
    if (this.formData.card_id !== 0) { // Periksa jika card_id tidak kosong
        if (this.formData.card_id === card.access_card_id) { // Gunakan === untuk perbandingan
            this.formData.card_id = 0; // Kosongkan jika sama
            // console.log("tes1", this.formData.card_id);
        } else {
            this.formData.card_id = card.access_card_id; // Isi dengan access_card_id jika tidak sama
            // console.log("tes2", this.formData.card_id);
        }
        // console.log("tes3", this.formData.card_id);
    } else {
        this.formData.card_id = card.access_card_id; // Isi jika kosong
    }
    // Lakukan aksi berdasarkan kartu yang dipilih
}

  onNewCardSelect(type: any) {
    console.log('New Card Type:', type);
    // Perform action based on selected card type
  }

  onSubmit() {
    if (this.selectedOption === 'replacement' && this.agreementChecked) {
      this.raiseARequestService.postRequestCard(
        this.formData.family_id,
        this.formData.card_id,
        this.formData.reason
      ).subscribe(
        (response) => {
          console.log(response);
          if (response.result.status === 'success') {
            this.presentToast('Access card data has been successfully saved!', 'success');
            this.router.navigate(['resident-raise-a-request'])
            this.ngOnDestroy();
          } else {
            this.presentToast('Failed to save access card data', 'danger');
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else if (this.selectedOption === 'new_application' && this.agreementChecked) {
      this.raiseARequestService.postRequestCard(this.formData.family_id).subscribe(
        (response) => {
          console.log(response);
          if (response.result.status === 'success') {
            this.presentToast('Access card data has been successfully saved!', 'success');
            this.router.navigate(['resident-raise-a-request'])
            this.ngOnDestroy();
          } else {
            this.presentToast('Failed to save access card data', 'danger');
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      this.presentToast('Please fill all field and agree to the terms and conditions before submitting', 'danger');
    }
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
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onCheck(focus: any) {
    this.extend_mb = focus
    this.agreementChecked = true;
    if (this.agreementChecked = true) {
      this.agreementChecked = false;
    }
  }
}
