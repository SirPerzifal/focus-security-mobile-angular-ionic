import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FamilyService } from 'src/app/service/resident/family/family.service';

@Component({
  selector: 'app-family-edit-member',
  templateUrl: './family-edit-member.page.html',
  styleUrls: ['./family-edit-member.page.scss'],
})
export class FamilyEditMemberPage implements OnInit {

  isModalFamilyEditOpen: boolean = false; // Status modal
  isModalAddFamilyMessageOpen: boolean = false; // Status modal

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

  mobile_temp = ''

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
    let errMsg = '';
    if (this.formData.full_name == '') {
      errMsg += "Please fill member's full name! \n";
    }
    if (this.formData.nickname == '') {
      errMsg += "Please fill member's nickname! \n";
    }
    if (this.mobile_temp == '') {
      errMsg += "Please fill member's mobile number! \n";
    }
    if (this.formData.type_of_residence == '') {
      errMsg += "Please choose member's residence type! \n";
    }
    if (errMsg != '') {
      this.presentToast(errMsg, 'danger');
      return;
    }
  
    // Pengecekan untuk primary_contact dan secondary_contact
    if (this.formData.type_of_residence === 'primary_contact' || this.formData.type_of_residence === 'secondary_contact') {
      this.presentEditCustomAlert(
        `Are you sure you want to make this family member as a ${this.formData.type_of_residence === 'primary_contact' ? 'Primary' : 'Secondary'} Contact?`,
        'Confirm',
        'Cancel'
      ).then((confirmed) => {
        if (confirmed) {
          this.performUpdate();
        }
      });
    } else {
      // Jika bukan primary atau secondary, langsung lakukan update
      this.performUpdate();
    }
  }
  
  private async presentEditCustomAlert(message: string, confirmText: string, cancelText: string): Promise<boolean> {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-family-edit-page',
      header: 'Confirm Action',
      message: message,
      buttons: [
        {
          text: confirmText,
          cssClass: 'confirm-button',
          handler: () => {
            this.performUpdate();
            return true; // Mengembalikan true jika dikonfirmasi
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
            return true; // Mengembalikan false jika dibatalkan
          }
        }
      ]
    });
  
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm'; // Mengembalikan true jika tombol konfirmasi ditekan
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

  private performUpdate() {
    console.log('Submitting Invitees');
    console.log(
      this.formData.unit_id,
      this.formData.full_name,
      this.formData.nickname,
      this.formData.email_address,
      this.formData.mobile_number,
      this.formData.type_of_residence,
      this.formData.type_of_residence == 'tenants' ? this.formData.tenancies : {}
    );
  
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

  familyEditData = [
    { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date() }
  ];

  getFamilyList() {
    this.familyEditData.pop()
    this.familyService.getFamilyList().subscribe(
      res => {
        const result = res.result['response_result'];
        console.log(result);
        
        // Filter data sesuai dengan kriteria yang diinginkan
        const filteredData = result.filter((item: any) => 
          item['member_hard_type'] !== 'primary_contact' && item['member_hard_type'] !== 'secondary_contact' // Ganti dengan kriteria yang sesuai
        );
  
        // Push data yang sudah difilter ke familyEditData
        filteredData.forEach((item: any) => {
          this.familyEditData.push({
            id: item['family_id'], 
            type: item['member_type'], 
            hard_type: item['member_hard_type'], 
            name: item['family_full_name'], 
            mobile: item['family_mobile_number'], 
            nickname: item['family_nickname'], 
            email: item['family_email'], 
            head_type: item['member_hard_type'] == 'tenants' ? 'Tenants' : 'Family',
            end_date: item['end_of_tenancy_aggrement'],
            status: item['states'],
            tenancy_agreement: item['tenancy_aggrement']
          });
        });

        // Perform validation after the data is loaded
      if (this.familyEditData.length > 0) {
        // Open modal if there's data
        this.isModalFamilyEditOpen = true;
        console.log('Opening modal with family data:', this.familyEditData);
      } else {
        this.isModalAddFamilyMessageOpen = true;
        // Handle case when there's no data
        console.log('No family data available to show in the modal.');
      }
      },
      error => {
        console.log(error)
      }
    )
    console.log("tes", this.familyEditData)
  }

  selectedFamilyMemberId: number | undefined = 0; // Menyimpan ID anggota keluarga yang dipilih
  
  async onDelete() {
    this.isModalFamilyEditOpen = false;
    this.familyEditData = [
      { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date() }
    ];
    console.log(this.formData.unit_id)
    const alertButtons = await this.alertController.create({
      cssClass: 'manage-payment-alert',
      header: `Are you sure you want to delete ${this.formData.full_name}?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            // Pengecekan untuk primary_contact dan secondary_contact
            if (this.formData.type_of_residence === 'primary_contact' || this.formData.type_of_residence === 'secondary_contact') {
              this.getFamilyList();
            } else {
              // Jika bukan primary atau secondary, langsung lakukan update
              this.deleteProcess();
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
    await alertButtons.present();456
  }

  deleteProcess(family_member_choose_id?: number, type_of_residence?: string) {
    this.isModalFamilyEditOpen = false; // Menutup modal
    try {
      this.familyService.deleteFamilyList(
        this.formData.unit_id,
        family_member_choose_id,
        type_of_residence
      ).subscribe(
        res => {
          console.log(res);
              if (res.result.response_code == 200) {
                this.presentToast('Successfully deleted this member.', 'success');
                this.router.navigate(['resident-my-family']); // Navigasi setelah modal ditutup
                this.isModalFamilyEditOpen = false; // Menutup modal
              } else {
                this.presentToast('Error occurred while deleting this member.', 'danger');
              }
            },
            error => {
                console.error('Error:', error);
                this.presentToast('An error occurred while deleting.', 'danger');
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        this.presentToast(String(error), 'danger');
    }
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

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.isModalFamilyEditOpen = false;
    }
  }

}
