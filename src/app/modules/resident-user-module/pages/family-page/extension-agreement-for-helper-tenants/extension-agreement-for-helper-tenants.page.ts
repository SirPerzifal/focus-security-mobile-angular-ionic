import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-extension-agreement-for-helper-tenants',
  templateUrl: './extension-agreement-for-helper-tenants.page.html',
  styleUrls: ['./extension-agreement-for-helper-tenants.page.scss'],
})
export class ExtensionAgreementForHelperTenantsPage implements OnInit {

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
    },
    helper_work_permit: '', // Tambahkan ini
    helper_work_permit_expiry_date: '',
  }
  headType: string = '';

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
    const state = navigation?.extras.state as { 
      from: string, 
      id: number, 
      family_name: string,
      type: string, 
      hard_type: string,
      head_type: string, 
      from_where: string,
      end_date: string,
      doc: string
    };
    if (state) {
      this.fromWhere = state.from;
      this.formData.full_name = state.family_name
      this.formData.unit_id = state.id;
      this.headType = state.type;
      this.formData.type_of_residence = state.hard_type;
      if (state.hard_type === 'tenants') {
        this.formData.tenancies.end_of_tenancy_aggrement = state.end_date,
        this.formData.tenancies.tenancy_aggrement = state.doc
      } else {
        this.formData.helper_work_permit = state.doc,
        this.formData.helper_work_permit_expiry_date = state.end_date
      }
      console.log(state, this.formData, this.end_date);
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
    if (this.headType === 'Helper') {
      this.formData.helper_work_permit_expiry_date = value;
    } else if (this.headType === 'Tenants') {
      this.formData.tenancies.end_of_tenancy_aggrement = value;
    }
  }

  downloadFile(type: string) {
    this.functionMain.downloadAttachment(this.formData.unit_id, type)
  }
  onSubmit() {
    let errMsg = ''
    if (this.headType === 'Helper') {
      if (this.formData.helper_work_permit == '') {
        errMsg += "Please upload the work permit! \n"
      }
      if (this.formData.helper_work_permit_expiry_date == '') {
        errMsg += "Please fill the wor permit end date! \n"
      }
    } else if (this.headType === 'Tenants') {
      if (this.formData.tenancies.tenancy_aggrement == '') {
        errMsg += "Please upload the tenancy agreement! \n"
      }
      if (this.formData.tenancies.end_of_tenancy_aggrement == '') {
        errMsg += "Please fill the tenancy end date! \n"
      }
    }
    if (errMsg != '') {
      this.functionMain.presentToast(errMsg, 'danger')
    } else {
      try {
        this.mainApi.endpointMainProcess({
          family_id_for_update: this.formData.unit_id,
          helper_work_permit_expiry_date: this.formData.helper_work_permit_expiry_date,
          helper_work_permit: this.formData.helper_work_permit,
          tenancies: this.formData.tenancies,
          type_update: this.formData.type_of_residence
        }, 'post/extension_agreement').subscribe((response: any) => {
          // console.log(res);
          if (response.result.response_code == 200) {
            this.functionMain.presentToast('Success request extension!', 'success');
            this.router.navigate(['family-page-main']);
          } else {
            this.functionMain.presentToast('Failed request extension!', 'danger');
          }
        })
      } catch (error) {
        console.error('Unexpected error:', error);
        this.functionMain.presentToast(String(error), 'danger');
      }
    }
  }

}
