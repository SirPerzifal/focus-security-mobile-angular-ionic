import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { FamilyService } from 'src/app/service/resident/family/family.service';

@Component({
  selector: 'app-family-edit-member',
  templateUrl: './family-edit-member.page.html',
  styleUrls: ['./family-edit-member.page.scss'],
})
export class FamilyEditMemberPage implements OnInit {

  formData = {
    unit_id: 0,
    full_name: '',
    nickname: '',
    email_address: '',
    mobile_number: '',
    type_of_residence: "primary_contact",
    tenancies: {
      tenancies: '',
      end_of_tenancy_aggrement: new Date()
    }
  }

  end_of_tenancy = ''

  constructor(private router: Router, private familyService: FamilyService, private alertController: AlertController, private toastController: ToastController) {
    // Ambil data dari state jika tersedia
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { id: number, type: string, hard_type: string, name: string, mobile: string, head_type: string, nickname: string, email: string, end_date: Date, tenant: boolean, warning: boolean,  };
    if (state) {
      this.formData.unit_id = state.id,
      this.formData.type_of_residence = state.hard_type
      this.formData.full_name= state.name
      this.formData.mobile_number= state.mobile
      this.formData.nickname= state.nickname
      this.formData.email_address= state.email
      this.formData.tenancies.end_of_tenancy_aggrement = state.end_date
    } 
    console.log(this.formData)
  }

  

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      
      
    });;
  }

  onSubmit() {
    let errMsg = ''
    if (this.formData.full_name == '') {
      errMsg += "Please fill member's full name! \n"
    }
    if (this.formData.nickname == '') {
      errMsg += "Please fill member's nickname! \n"
    }
    if (this.formData.mobile_number == '') {
      errMsg += "Please fill member's mobile number! \n"
    }
    if (this.formData.type_of_residence == '') {
      errMsg += "Please choose member's residence type! \n"
    }
    if (errMsg != '') {
      this.presentToast(errMsg, 'danger')
      return
    }
    console.log('Submitting Invitees');
    console.log(
      this.formData.unit_id,
      this.formData.full_name,
      this.formData.nickname,
      this.formData.email_address,
      this.formData.mobile_number,
      this.formData.type_of_residence,
      this.formData.type_of_residence == 'tenants' ? this.formData.tenancies : {})
    try {
      this.familyService.updateFamilyDetail(
        this.formData.unit_id,
        this.formData.full_name,
        this.formData.nickname,
        this.formData.email_address,
        this.formData.mobile_number,
        this.formData.type_of_residence,
        this.formData.type_of_residence == 'tenants' ? this.formData.tenancies : {},
      ).subscribe(
        res => {
          console.log(res);
          if (res.result.response_code == 200) {
            this.presentToast('Success Edit Record', 'success');
            this.router.navigate(['resident-my-family']);
          } else {
            this.presentToast('Failed Edit Record', 'danger');
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast(String(error), 'danger');
    }
  }

  public async presentCustomAlert(
    header: string = 'Delete User', 
    confirmText: string = 'Delete',
    cancelText: string = 'Cancel', 
    unitFormData?: any  // Jadikan optional
  ) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-family-edit-page',
      header: header,
      message: '', 
      buttons: [
        {
          text: confirmText,
          cssClass: 'confirm-button',
          handler: () => {
            console.log('Confirmed');
            // Logika konfirmasi
            this.onDelete();
            // if (invite) {
            // }
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Canceled');
            // Logika pembatalan
          }
        },
      ]
    });
  
    await alert.present(); // Tambahkan baris ini
  }

  async onDelete() {
    console.log(this.formData.unit_id)
    const alertButtons = await this.alertController.create({
      cssClass: 'manage-payment-alert',
      header: `Are you sure you want to delete ${this.formData.full_name}?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            try {
              this.familyService.deleteFamilyList(
                this.formData.unit_id,
              ).subscribe(
                res => {
                  console.log(res);
                  if (res.result.response_code == 200) {
                    this.presentToast('Successfully delete this member.', 'success');
                    this.router.navigate(['resident-my-family']);
                  } else {
                    this.presentToast('Error occured while deleting this member.', 'danger');
                  }
                },
                error => {
                  console.error('Error:', error);
                }
              );
            } catch (error) {
              console.error('Unexpected error:', error);
              this.presentToast(String(error), 'danger');
            }
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
      ]
    })
    await alertButtons.present();
  }

  onFullNameChange(value: string): void {
    this.formData.full_name = value
  }

  onNicknameChange(value: string): void {
    this.formData.nickname = value;
  }
  
  onEmailAddressChange(value: string): void {
    this.formData.email_address = value;
  }
  
  onMobileNumberChange(value: string): void {
    this.formData.mobile_number = value;
  }
  
  onTenanciesChange(value: string): void {
    this.formData.tenancies.tenancies = value;
  }
  
  onEndOfTenancyAgreementChange(value: string): void {
    this.end_of_tenancy = value;
  }  

  openExtend() {
    this.router.navigate(['/family-tenant-extend'], {
      state: {
        id: this.formData.unit_id,
        type: this.formData.type_of_residence,
        name: this.formData.full_name,
        mobile: this.formData.mobile_number,
        nickname: this.formData.nickname,
        email: this.formData.email_address,
        end_date: this.formData.tenancies.end_of_tenancy_aggrement,
        tenant: this.formData.tenancies.tenancies,
      }
    });
  }

  ngOnInit() {
  }

}
