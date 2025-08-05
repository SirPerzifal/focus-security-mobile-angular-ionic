import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.page.html',
  styleUrls: ['./family-form.page.scss'],
})
export class FamilyFormPage implements OnInit {

  buttonNameEdit: string = 'Click To Edit'
  selectedCode: string = '65';
  selectedDate: string = '';
  pageForWhat: string = '';
  pageName: string = '';
  disableForm: boolean = false;
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
    helper_work_permit: '', // Tambahkan ini
    helper_work_permit_expiry_date: ''
  }
  fromWhere: string = '';
  familyId: number = 0;
  end_date: string=new Date().toISOString().split('T')[0];

  isModalFamilyEditOpen: boolean = false; // Status modal
  isModalAddFamilyMessageOpen: boolean = false; // Status modal
  selectedFamilyMemberId: number | undefined = 0; // Menyimpan ID anggota keluarga yang dipilih
  familyEditData = [
    { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date(), helper_work_permit_expiry_date: new Date() }
  ];

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
    private mainApi: MainApiResidentService,
    private alertController: AlertController,
    private platform: Platform
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { for: any, from: string, id: number, type: string, hard_type: string, name: string, mobile: string, head_type: string, nickname: string, email: string, end_date: Date, tenant: boolean, warning: boolean, profile_image: string, reject_reason: string, helper_work_permit_expiry_date: Date };
    if (state) {
      console.log(state);
      
      this.familyId = state.id;
      this.pageName = 'Edit Member';
      this.pageForWhat = state.for;
      this.disableForm = true;
      this.formData.type_of_residence = state.hard_type
      this.formData.full_name= state.name
      this.formData.mobile_number= state.mobile
      this.formData.nickname= state.nickname
      this.formData.email_address= state.email
      this.formData.tenancies.end_of_tenancy_aggrement = String(state.end_date)
      this.formData.helper_work_permit_expiry_date = String(state.helper_work_permit_expiry_date)
      this.formData.image_family = state.profile_image
      this.formData.reject_reason = state.reject_reason
      this.selectedDate = String(this.functionMain.convertToDDMMYYYY(new Date(state.helper_work_permit_expiry_date).toISOString().split('T')[0]));
      this.end_date = String(this.functionMain.convertToDDMMYYYY(new Date(state.end_date).toISOString().split('T')[0]));
      let str = state.mobile;
      let newStr = str.substring(2);
      this.contactValue = newStr;
      if (state.from) {
        this.fromWhere = state.from;
      }
    }
  }

  ngOnInit() {
    this.getTodayDate();
  }

  directTo() {
    if (this.fromWhere === 'raise-a-request') {
      this.router.navigate(['/form-for-request-move-in-out-permit']);
    } else {
      this.router.navigate(['/family-page-main']);
    }
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
        this.formData.helper_work_permit_expiry_date = '';
        this.formData.type_of_residence = event.target.value;
      } else {
        this.formData.type_of_residence = event.target.value;
      }
    } else if (from === 'end_tenants_agreement') {
      const date = new Date(event);
      this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      this.formData.tenancies.end_of_tenancy_aggrement = event;
    } else if (from === 'helper_work_permit_expiry_date') {
      const date = new Date(event);
      this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      this.formData.helper_work_permit_expiry_date = event;
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

  isModalChooseUpload: boolean = false;
  chooseWhereToChoose() {
    console.log("tes");
    this.isModalChooseUpload = !this.isModalChooseUpload;
  }

  onUploadImageProfile(event: any) {
    let data = event.target.files[0];
    if (data) {
      this.isModalChooseUpload = !this.isModalChooseUpload;
      this.selectedNameProfileFamily = data.name;
      this.convertToBase64(data).then((base64: string) => {
        this.isModalChooseUpload = !this.isModalChooseUpload;
        this.formData.image_family = base64.split(',')[1];
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedNameProfileFamily = '';
    }
  }

  // New function to handle camera capture
  async openCamera() {
    try {
      // Request camera permissions
      const permissionStatus = await Camera.checkPermissions();
      if (permissionStatus.camera !== 'granted') {
        await Camera.requestPermissions();
      }
      
      const image = await Camera.getPhoto({
        quality: 90,
        // allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        promptLabelHeader: 'Take a photo',
        promptLabelCancel: 'Cancel',
        promptLabelPhoto: 'Take Photo',
      });
      
      if (image && image.base64String) {
        this.isModalChooseUpload = !this.isModalChooseUpload;
        // Update the form data with the base64 image
        this.formData.image_family = image.base64String;
        
        // Update display name to show a camera capture was made
        const timestamp = new Date().toISOString().split('T')[0];
        this.selectedNameProfileFamily = `Camera_Photo_${timestamp}`;
        
        // Display success message
        this.functionMain.presentToast('Photo captured successfully', 'success');
      }
    } catch (error) {
      console.error('Camera error:', error);
      this.functionMain.presentToast(String(error), 'danger');
    }
  }

  deletePhoto() {
    this.formData.image_family = '';
    this.selectedNameProfileFamily = '';
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

  ableChangeInput() {
    this.disableForm = !this.disableForm;
    if (this.disableForm === true) {
      this.functionMain.presentToast('You can not change your profile data', 'danger');
      this.buttonNameEdit = 'Click To Edit';
      return;
    }
    this.buttonNameEdit = 'Save Edit Change';
    this.functionMain.presentToast('You can change your profile data now', 'success');
  }

  processAddNewFamily(edit?: string) {
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
    if (this.formData.type_of_residence === 'helper' && !this.formData.helper_work_permit_expiry_date) {
      errMsg += "Please fill the helper work permit end date! \n";
    }
    if (errMsg != '') {
      this.functionMain.presentToast(errMsg, 'danger')

    } else {
      try {
        if (this.pageForWhat === 'editData') {
          this.mainApi.endpointProcess({
            family_id_for_update: this.familyId,
            full_name: this.formData.full_name,
            nickname: this.formData.nickname,
            email_address: this.formData.email_address,
            mobile_number: this.formData.mobile_number,
            profile_image: this.formData.image_family,
            type_of_residence: this.formData.type_of_residence,
            tenancies: this.formData.tenancies,
            helper_work_permit: this.formData.helper_work_permit, // Tambahkan parameter ini
            helper_work_permit_expiry_date: this.formData.helper_work_permit_expiry_date
          }, 'post/update_family').subscribe((response: any) => {
            console.log(response);
            if (edit) {
              this.functionMain.presentToast('Success edit data', 'success');
            } else {
              this.functionMain.presentToast('Success Add Record', 'success');
            }
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
            helper_work_permit: this.formData.helper_work_permit, // Tambahkan parameter ini
            helper_work_permit_expiry_date: this.formData.helper_work_permit_expiry_date
          }, 'post/post_family_detail').subscribe((response: any) => {
            console.log(response);
            if (response.result.response_code == 200) {
              this.functionMain.presentToast('Success Add Record', 'success');
              this.router.navigate(['family-page-main']);
            } else {
              const message = response.result.response_description ? response.result.response_description : 'Failed Add Record';
              this.functionMain.presentToast(message, 'danger');
            }
          })
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        this.functionMain.presentToast(String(error), 'danger');
      }
    }
  }

  changePassDirect() {
    this.router.navigate(['/settings-main'], { state: { formData: this.formData, familyId: this.familyId } });
  }

  getFamilyList() {
    this.familyEditData.pop()
    this.mainApi.endpointMainProcess({}, 'get/get_family').subscribe((response: any) => {
      const result = response.result['response_result'];
      // console.log(result);
      
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
          tenancy_agreement: item['tenancy_aggrement'],
          helper_work_permit_expiry_date: item['helper_work_permit_expiry_date']
        });
      });

      // Perform validation after the data is loaded
    if (this.familyEditData.length > 0) {
      // Open modal if there's data
      this.isModalFamilyEditOpen = true;
      // console.log('Opening modal with family data:', this.familyEditData);
    } else {
      this.isModalAddFamilyMessageOpen = true;
      // Handle case when there's no data
      // console.log('No family data available to show in the modal.');
    }
    })
  }
  
  async onDelete() {
    this.isModalFamilyEditOpen = false;
    this.familyEditData = [
      { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date(), helper_work_permit_expiry_date: new Date() }
    ];
    // console.log(this.formData.unit_id)
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
      this.mainApi.endpointMainProcess({
        family_id_to_change: this.familyId,
        targeted_family_id: family_member_choose_id, 
        type_of_residence: type_of_residence
      }, 'post/delete_family').subscribe((response: any) => {
        // console.log(res);
        if (response.result.response_code == 200) {
          this.functionMain.presentToast('Successfully deleted this member.', 'success');
          this.router.navigate(['resident-my-family']); // Navigasi setelah modal ditutup
          this.isModalFamilyEditOpen = false; // Menutup modal
        } else {
          this.functionMain.presentToast('Error occurred while deleting this member.', 'danger');
        }
      })
    } catch (error) {
        console.error('Unexpected error:', error);
        this.functionMain.presentToast(String(error), 'danger');
    }
  }

  resubmitForApproval() {
    this.mainApi.endpointMainProcess({
      full_name: this.formData.full_name,
      nickname: this.formData.nickname,
      email_address: this.formData.email_address,
      mobile_number: this.formData.mobile_number,
      type_of_residence: this.formData.type_of_residence,
      tenancies: this.formData.tenancies,
      helper_work_permit: this.formData.helper_work_permit, // Tambahkan parameter ini
      helper_work_permit_expiry_date: this.formData.helper_work_permit_expiry_date,
      resubmit_id: this.familyId
    }, 'post/post_family_detail').subscribe((response: any) => {
      if (response.result.response_code == 200) {
        this.router.navigate(['family-page-main']);
        this.functionMain.presentToast('Successfully to resubmit data.', 'success');
      } else {
        this.processEdit('resubmit');
        const message = response.result.response_description ? response.result.response_description : 'Failed to resubmit data';
        this.functionMain.presentToast(message, 'danger');
      }
    })
  }

  openExtend() {
    this.router.navigate(['/tenant-extend-page'], {
      state: {
        from: 'family-form',
        id: this.familyId,
        type: this.formData.type_of_residence,
        name: this.formData.full_name,
        mobile: this.formData.mobile_number,
        nickname: this.formData.nickname,
        email: this.formData.email_address,
        profile_image: this.formData.image_family,
        end_date: this.formData.tenancies.end_of_tenancy_aggrement,
        tenant: this.formData.tenancies,
      }
    });
  }

  processEdit(resubmit?: string) {
    this.disableForm = !this.disableForm;
    if (this.disableForm === true) {
      if (resubmit) {
        this.resubmitForApproval();
        return;
      } else {
        this.processAddNewFamily('edit');
        return;
      }
    } else if (resubmit && this.disableForm) {
      this.resubmitForApproval();
      return;
    } else if (resubmit) {
      this.buttonNameEdit = 'Resubmit For Approval';
      this.functionMain.presentToast('You can change your profile data now to resubmit', 'success');
      return;
    }
    this.buttonNameEdit = 'Save Edit Change';
    this.functionMain.presentToast('You can change your profile data now', 'success');
  }

}
