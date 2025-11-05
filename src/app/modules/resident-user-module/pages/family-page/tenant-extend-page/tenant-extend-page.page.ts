import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-tenant-extend-page',
  templateUrl: './tenant-extend-page.page.html',
  styleUrls: ['./tenant-extend-page.page.scss'],
})
export class TenantExtendPagePage implements OnInit {

  fromWhere: string = '';
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

  selectedNameFileOfAgreement: string = '';
  selectedDate: string = '';
  end_date: string=new Date().toISOString().split('T')[0];
  minDate: string = ''; // Set tanggal minimum saat inisialisasi

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
    private mainApi: MainApiResidentService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { from: string, id: number, type: string, hard_type: string, name: string, mobile: string, head_type: string, nickname: string, email: string, end_date: string, tenant: string, warning: boolean, profile_image: string, from_where: string};
    if (state) {
      this.fromWhere = state.from
      this.formData.unit_id = state.id,
      this.formData.type_of_residence = 'tenants'
      this.formData.full_name= state.name
      this.formData.mobile_number= state.mobile
      this.formData.nickname= state.nickname
      this.formData.email_address= state.email
      this.formData.image_family = state.profile_image
      this.formData.tenancies.end_of_tenancy_aggrement = state.end_date
      this.formData.tenancies.tenancy_aggrement = state.tenant
      this.end_date = String(this.functionMain.convertToDDMMYYYY(new Date(state.end_date).toISOString().split('T')[0]));
    } 
  }

  ngOnInit() {
    this.getTodayDate();
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

  backToWhere() {
    if (this.fromWhere === 'family-main') {
      this.router.navigate(['/family-page-main'])
    } else if (this.fromWhere === 'family-form') {
      this.router.navigate(['/family-form'])
    }
  }

  onTenanciesChange(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.selectedNameFileOfAgreement = data.name; // Store the selected file name
      this.functionMain.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.tenancies.tenancy_aggrement = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedNameFileOfAgreement = ''; // Reset if no file is selected
    }
  }

  onDateChange(value: string): void {
    const date = new Date(value);
    this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
    this.formData.tenancies.end_of_tenancy_aggrement = value;
  }

  onSubmit() {

    console.log(this.formData);
    
    // let errMsg = ''
    // if (this.formData.tenancies.tenancy_aggrement == '') {
    //   errMsg += "Please upload the tenancy agreement! \n"
    // }
    // if (this.formData.tenancies.end_of_tenancy_aggrement == '') {
    //   errMsg += "Please fill the tenancy end date! \n"
    // }
    // if (errMsg != '') {
    //   this.functionMain.presentToast(errMsg, 'danger')
    // } else {
    //   try {
    //     this.mainApi.endpointMainProcess({
    //       family_id_for_update: this.formData.unit_id,
    //       full_name: this.formData.full_name,
    //       nickname: this.formData.nickname,
    //       email_address: this.formData.nickname,
    //       mobile_number: this.formData.mobile_number,
    //       type_of_residence: this.formData.type_of_residence,
    //       profile_image: this.formData.image_family,
    //       tenancies: this.formData.tenancies,
    //     }, 'post/update_family').subscribe((response: any) => {
    //       // console.log(res);
    //       if (response.result.response_code == 200) {
    //         this.functionMain.presentToast('Success Edit Record', 'success');
    //         this.router.navigate(['resident-my-family']);
    //       } else {
    //         this.functionMain.presentToast('Failed Edit Record', 'danger');
    //       }
    //     })
    //   } catch (error) {
    //     console.error('Unexpected error:', error);
    //     this.functionMain.presentToast(String(error), 'danger');
    //   }
    // }
  }

}
