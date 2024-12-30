import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FamilyService } from 'src/app/service/resident/family/family.service';

@Component({
  selector: 'app-family-add-member',
  templateUrl: './family-add-member.page.html',
  styleUrls: ['./family-add-member.page.scss'],
})
export class FamilyAddMemberPage implements OnInit {

  constructor(private familyService: FamilyService, private toastController: ToastController, private router: Router) { }
  selectedFile = new FormData()
  formData = {
    full_name: '',
    nickname: '',
    email_address: '',
    mobile_number: '',
    type_of_residence: "primary_contact",
    tenancies: {
      tenancy_aggrement: '',
      end_of_tenancy_aggrement: ''
    },
    helper_work_permit: '' // Tambahkan ini
  }
  fileCheck = false
  dateNow = new Date().toISOString().slice(0, 10);

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
    if (this.formData.type_of_residence == 'tenants') {
      if (this.formData.tenancies.tenancy_aggrement == '') {
        errMsg += "Please upload the tenancy agreement! \n"
      }
      if (this.formData.tenancies.end_of_tenancy_aggrement == '') {
        errMsg += "Please fill the tenancy end date! \n"
      }
    }
    if (this.formData.type_of_residence === 'helper' && !this.formData.helper_work_permit) {
      errMsg += "Please upload the helper work permit! \n";
    }
    if (errMsg != '') {
      this.presentToast(errMsg, 'danger')

    } else {
      try {
        this.familyService.postFamilyDetail(
          this.formData.full_name,
          this.formData.nickname,
          this.formData.email_address,
          this.formData.mobile_number,
          this.formData.type_of_residence,
          this.formData.type_of_residence === 'tenants' ? this.formData.tenancies : {},
          this.formData.type_of_residence === 'helper' ? this.formData.helper_work_permit : '' // Tambahkan ini
        ).subscribe(
          res => {
            console.log(res);
            if (res.result.response_code == 200) {
              this.presentToast('Success Add Record', 'success');
              this.router.navigate(['resident-my-family']);
            } else {
              this.presentToast('Failed Add Record', 'danger');
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

  onTenanciesChange(value: any): void {
    console.log(value)
    console.log(value.target)
    console.log(value.target.files)
    console.log(value.target.files[0])
    let data = value.target.files[0];
    if (data){
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.formData.tenancies.tenancy_aggrement = base64.split(',')[1]
        this.fileCheck = true
      }).catch(error => {
        console.error('Error converting to base64', error);
        this.fileCheck = false
      });
    } else {
      this.fileCheck = false
    }
  }

  onHelperChange(value: any): void {
    const file = value.target.files[0];
    if (file) {
      this.convertToBase64(file).then((base64: string) => {
        console.log('Base64 conversion successful');
        this.formData.helper_work_permit = base64.split(',')[1]; // Simpan base64 ke dalam formData
        this.fileCheck = true; // Menandakan bahwa file telah di-upload
      }).catch(error => {
        console.error('Error converting to base64', error);
        this.fileCheck = false; // Reset jika ada error
      });
    } else {
      this.fileCheck = false; // Reset jika tidak ada file
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


  onEndOfTenancyAgreementChange(value: string): void {
    this.formData.tenancies.end_of_tenancy_aggrement = value;
  }

  testSubmit() {

    try {
      this.familyService.testFamilyList(
        this.selectedFile
      ).subscribe(
        res => {
          console.log(res);
          if (res.result.response_code == 200) {
            this.presentToast('Success Add Record', 'success');
            this.router.navigate(['resident-my-family']);
          } else {
            this.presentToast('Failed Add Record', 'danger');
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

  ngOnInit() {
  }

}
