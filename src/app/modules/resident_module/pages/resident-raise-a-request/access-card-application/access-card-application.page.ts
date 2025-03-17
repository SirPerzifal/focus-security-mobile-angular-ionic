import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { Subscription } from 'rxjs';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { ModalController } from '@ionic/angular';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';

@Component({
  selector: 'app-access-card-application',
  templateUrl: './access-card-application.page.html',
  styleUrls: ['./access-card-application.page.scss'],
})
export class AccessCardApplicationPage implements OnInit {
  selectedOption: string = '';
  expectedCards: any = [];
  expectedFamily: any = [];
  agreementChecked: boolean = false;
  userName: string = '';
  condoName: string = '';
  unit: number = 0; // Replace with actual unit ID
  unitId: number = 0; // Replace with actual unit ID
  block: number = 0; // Replace with actual block ID
  noTel: string = '';
  extend_mb = false

  formData = {
    card_id: 0,
    block_id: 1,
    unit_id: 1,
    card_number: '',
    card_holder_name: '',
    card_holder_type: '',
    card_type: '',
    card_expiry_date: '',
    card_cvv: '',
    family_id: 36,
    reason: '',
  }

  constructor(private modalController: ModalController, private router: Router, private raiseARequestService: RaiseARequestService, private toastController: ToastController, private getUserInfoService: GetUserInfoService, private authService:AuthService) { }

  ngOnInit() {
    // Ambil data unit yang sedang aktif
    this.getUserInfoService.getPreferenceStorage(
      [ 
        'user',
        'unit',
        'block_name',
        'unit_name',
        'project_name'
      ]
    ).then((value) => {
      const parse_user = this.authService.parseJWTParams(value.user);

      // // console.log(value);
      this.block = value.block_name;
      this.unitId = value.unit;
      this.unit = value.unit_name;
      this.condoName = value.project_name;
      this.userName = parse_user.name
      // // console.log('unit', this.unitId);
    })
    // console.log('tes');
  }

  onOptionChange(option: string) {
    this.extend_mb = true
    this.selectedOption = option;
    if (option === 'replacement') {
      this.loadCards();
      this.agreementChecked = false;
    } else if (option === 'new_application') {
      this.loadCards();
      this.agreementChecked = false;
      this.expectedCards = [];
    }
  }

  loadCards() {
    // // console.log(this.unit);
    
    this.raiseARequestService.getCardFamilyMember(Number(this.unitId)).subscribe(
      (response) => {
        if (response) {
          // console.log(response);
          if (response.result.family_data_with_no_ac) {
            this.expectedFamily = response.result.family_data_with_no_ac.map((family_with_no_ac: any) => {
              return {
                family_id: family_with_no_ac.id,
                family_name: family_with_no_ac.full_name,
                member_type: family_with_no_ac.member_type
              }
            })
          }
          // Flatten the access cards from family members
          this.expectedCards = response.result.family_data.flatMap((member: any) => 
            member.access_cards.map((card: any) => ({
              access_card_id: card.id,
              access_card_number: card.access_card_number,
              access_card_status: card.access_card_status,
              assigned_resident_name: member.full_name // Assuming you want to show the member's name
            }))
          );
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
            // // console.log("tes1", this.formData.card_id);
        } else {
            this.formData.card_id = card.access_card_id; // Isi dengan access_card_id jika tidak sama
            // // console.log("tes2", this.formData.card_id);
        }
        // // console.log("tes3", this.formData.card_id);
    } else {
        this.formData.card_id = card.access_card_id; // Isi jika kosong
    }
    // Lakukan aksi berdasarkan kartu yang dipilih
}

  onNewCardSelect(type: any) {
    // console.log('New Card Type:', type);
    this.formData.family_id = type;
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
          // console.log(response);
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
          // console.log(response);
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

  termsAndCOndition: string = '';

  async presentModalAgreement() {
    
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
