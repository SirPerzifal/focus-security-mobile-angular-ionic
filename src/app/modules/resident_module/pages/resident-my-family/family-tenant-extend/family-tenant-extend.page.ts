import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FamilyService } from 'src/app/service/resident/family/family.service';

@Component({
  selector: 'app-family-tenant-extend',
  templateUrl: './family-tenant-extend.page.html',
  styleUrls: ['./family-tenant-extend.page.scss'],
})
export class FamilyTenantExtendPage implements OnInit {

  name: string=""
  end_date: string=new Date().toISOString().split('T')[0];

  formData = {
    unit_id: 0,
    full_name: '',
    nickname: '',
    email_address: '',
    image_family: '',
    mobile_number: '',
    type_of_residence: "primary_contact",
    tenancies: {
      tenancy_aggrement: '',
      end_of_tenancy_aggrement: ''
    }
  }
  fileCheck = false

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

  dateNow = new Date().toISOString().slice(0, 10);

  onTenanciesChange(value: any): void {
    let data = value.target.files[0];
    if (data){
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.tenancies.tenancy_aggrement = base64.split(',')[1]
        this.fileCheck = true
      }).catch(error => {
        console.error('Error converting to base64', error);
        this.fileCheck = false
      });
    } else {
      this.fileCheck = false
    }
    // console.log(this.fileCheck)
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

  constructor(private router: Router, private toastController: ToastController, private familyService: FamilyService) {
    // Ambil data dari state jika tersedia
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { id: number, type: string, hard_type: string, name: string, mobile: string, head_type: string, nickname: string, email: string, end_date: string, tenant: string, warning: boolean, profile_image: string};
    if (state) {
      this.formData.unit_id = state.id,
      this.formData.type_of_residence = 'tenants'
      this.formData.full_name= state.name
      this.formData.mobile_number= state.mobile
      this.formData.nickname= state.nickname
      this.formData.email_address= state.email
      this.formData.image_family = state.profile_image
      this.formData.tenancies.end_of_tenancy_aggrement = state.end_date
      this.formData.tenancies.tenancy_aggrement = state.tenant
      this.end_date = this.convertToDDMMYYYY(new Date(state.end_date).toISOString().split('T')[0]);
    } 
  }  

  onSubmit() {

    let errMsg = ''
    if (this.formData.tenancies.tenancy_aggrement == '') {
      errMsg += "Please upload the tenancy agreement! \n"
    }
    if (this.formData.tenancies.end_of_tenancy_aggrement == '') {
      errMsg += "Please fill the tenancy end date! \n"
    }
    if (errMsg != '') {
      this.presentToast(errMsg, 'danger')
    } else {
      try {
        this.familyService.updateFamilyDetail(
          this.formData.unit_id,
          this.formData.full_name,
          this.formData.nickname,
          this.formData.email_address,
          this.formData.mobile_number,
          this.formData.type_of_residence,
          this.formData.image_family,
          this.formData.tenancies,
        ).subscribe(
          res => {
            // console.log(res);
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
  }

  onEndOfTenancyAgreementChange(value: string): void {
    this.formData.tenancies.end_of_tenancy_aggrement = value;
  }

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }
  

  ngOnInit() {
  }

}
