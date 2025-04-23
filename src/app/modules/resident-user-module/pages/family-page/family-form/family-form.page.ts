import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.page.html',
  styleUrls: ['./family-form.page.scss'],
})
export class FamilyFormPage implements OnInit {

  selectedCode: string = '65';
  selectedDate: string = '';
  pageForWhat: string = '';
  pageName: string = '';
  minDate: string = ''; // Set tanggal minimum saat inisialisasi
  contactValue: string = '';
  countryCodes: any[] = [
    {
      country: 'SG',
      code: '65',
      digit: 8,
    },
    {
      country: 'ID',
      code: '62',
      digit: 12,
    },
    {
      country: 'MY',
      code: '60',
      digit: 9,
    },
  ]

  selectedNameProfileFamily: string = '';
  selectedNameHelperWorkPermit: string = '';
  selectedNameTenantsWorkPermit: string = '';

  formData = {
    full_name: '',
    nickname: '',
    email_address: '',
    mobile_number: '',
    image_family: '',
    reject_reason: '',
    type_of_residence: "primary_contact",
    tenancies: {
      tenancy_aggrement: '',
      end_of_tenancy_aggrement: ''
    },
    helper_work_permit: '' // Tambahkan ini
  }
  familyId: number = 0;
  end_date: string=new Date().toISOString().split('T')[0];

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
    private mainApi: MainApiResidentService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { for: any, id: number, type: string, hard_type: string, name: string, mobile: string, head_type: string, nickname: string, email: string, end_date: Date, tenant: boolean, warning: boolean, profile_image: string, reject_reason: string };
    if (state) {
      this.familyId = state.id;
      this.pageName = 'Edit Member';
      this.pageForWhat = state.for;
      this.formData.type_of_residence = state.hard_type
      this.formData.full_name= state.name
      this.formData.mobile_number= state.mobile
      this.formData.nickname= state.nickname
      this.formData.email_address= state.email
      this.formData.tenancies.end_of_tenancy_aggrement = String(state.end_date)
      this.formData.image_family = state.profile_image
      this.formData.reject_reason = state.reject_reason
      this.end_date = String(this.functionMain.convertToDDMMYYYY(new Date(state.end_date).toISOString().split('T')[0]));
      let str = state.mobile;
      let newStr = str.substring(2);
      this.contactValue = newStr;
    }
  }

  ngOnInit() {
    this.getTodayDate();
  }

  directTo() {
    this.router.navigate(['/family-page-main']);
  }

  getTodayDate() {
    const today = new Date();
    const string = today.toString;
    const final = String(today);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    this.minDate = `${yyyy}-${mm}-${dd}`; // Format yyyy-mm-dd
  }

  onValueChange(event: any, from: string) {
    if (from === 'name') {
      this.formData.full_name = event;
    } else if (from === 'nickname') {
      this.formData.nickname = event;
    } else if (from === 'email') {
      this.formData.email_address = event;
    } else if (from === 'select_type_resident') {
      if (event.target.value === 'helper') {
        this.selectedNameTenantsWorkPermit = '';
        this.formData.tenancies = {
          tenancy_aggrement: '',
          end_of_tenancy_aggrement: ''
        }
        this.formData.type_of_residence = event.target.value;
      } else if (event.target.value === 'tenants') {
        this.selectedNameHelperWorkPermit = '';
        this.formData.helper_work_permit = '';
        this.formData.type_of_residence = event.target.value;
      } else {
        this.formData.type_of_residence = event.target.value;
      }
    } else if (from === 'end_tenants_agreement') {
      const date = new Date(event);
      this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      this.formData.tenancies.end_of_tenancy_aggrement = event;
    }
  }

  get value(): string {
    return this.combinedValue;
  }
  get combinedValue(): string {
    return `${this.selectedCode}${this.contactValue}`.trim();
  }
  onChange: (value: string) => void = () => {};
  
  onKeyUp(event: KeyboardEvent): void {
    let code = this.countryCodes.filter((item: any) => item.code == this.selectedCode)[0].digit
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length > code) {
      this.contactValue = inputValue.slice(0, code)
      this.functionMain.presentToast(`Contact number must not be more than ${code} digits`, 'danger')
    } else {
      this.contactValue = inputValue;
    }
    this.formData.mobile_number = this.combinedValue;
    this.onChange(this.combinedValue);
  }

  onCountryCodeChange(event: Event): void {
    this.selectedCode = (event.target as HTMLSelectElement).value;
    this.formData.mobile_number = this.combinedValue;
    this.onChange(this.combinedValue);
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

  onUploadImageProfile(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedNameProfileFamily = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.image_family = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedNameProfileFamily = ''; // Reset if no file is selected
    }
  }

  onUploadHelperWorkPermit(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedNameHelperWorkPermit = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.helper_work_permit = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedNameHelperWorkPermit = ''; // Reset if no file is selected
    }
  }

  onUploadTenantsWorkPermit(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedNameTenantsWorkPermit = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.tenancies.tenancy_aggrement = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedNameTenantsWorkPermit = ''; // Reset if no file is selected
    }
  }

  processAddNewFamily() {
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
      this.functionMain.presentToast(errMsg, 'danger')

    } else {
      try {
        if (this.pageForWhat === 'editData') {
          this.mainApi.endpointProcess({
            unit_id: this.familyId,
            full_name: this.formData.full_name,
            nickname: this.formData.nickname,
            email_address: this.formData.email_address,
            mobile_number: this.formData.mobile_number,
            profile_image: this.formData.image_family,
            type_of_residence: this.formData.type_of_residence,
            tenancies: this.formData.tenancies,
            helper_work_permit: this.formData.helper_work_permit // Tambahkan parameter ini
          }, 'post/update_family').subscribe((response: any) => {
            console.log(response);
            this.functionMain.presentToast('Success Add Record', 'success');
            this.router.navigate(['family-page-main']);
            // if (response.result.response_code == 200) {
            // } else {
            //   this.functionMain.presentToast('Failed Add Record', 'danger');
            // }
          })
        } else {
          this.mainApi.endpointMainProcess({
            full_name: this.formData.full_name,
            nickname: this.formData.nickname,
            email_address: this.formData.email_address,
            mobile_number: this.formData.mobile_number,
            profile_image: this.formData.image_family,
            type_of_residence: this.formData.type_of_residence,
            tenancies: this.formData.tenancies,
            helper_work_permit: this.formData.helper_work_permit // Tambahkan parameter ini
          }, 'post/post_family_detail').subscribe((response: any) => {
            console.log(response);
            this.functionMain.presentToast('Success Add Record', 'success');
            this.router.navigate(['family-page-main']);
            // if (response.result.response_code == 200) {
            // } else {
            //   this.functionMain.presentToast('Failed Add Record', 'danger');
            // }
          })
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        this.functionMain.presentToast(String(error), 'danger');
      }
    }

  }

}
