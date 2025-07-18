import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEraser, faPenFancy } from '@fortawesome/free-solid-svg-icons';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { SignaturePadComponent } from 'src/app/shared/components/signature-pad/signature-pad.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-records-facility-check-out',
  templateUrl: './records-facility-check-out.page.html',
  styleUrls: ['./records-facility-check-out.page.scss'],
})
export class RecordsFacilityCheckOutPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientMainService: ClientMainService,
    public functionMainService: FunctionMainService
    // private canvas: Canvas
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any, purpose: string };
    if (state) {
      this.record = state.record
      this.purpose = state.purpose
      if (this.record.form) {
        this.record.form.map((item: any) => {
          this.formData.push({
            description: item || '', 
            quantity: '',
            condition: '',
            remarks: '',
            attachment_name: '',
            attachment: '',
          });
        });      
      } else {
        this.formData = []
      }
      console.log(this.formData)
      if (this.purpose == 'check_in') {
        this.isResidentSigned = this.record.resident_check_in ? true : false
        this.isOfficerSigned = this.record.officer_check_in ? true : false
        this.showImageResident = `data:image/png;base64,${this.record.resident_check_in}`
        this.showImageOfficer = `data:image/png;base64,${this.record.officer_check_in}`
      } else {
        this.isResidentSigned = this.record.resident_check_out ? true : false
        this.isOfficerSigned = this.record.officer_check_out ? true : false
        this.showImageResident = `data:image/png;base64,${this.record.resident_check_out}`
        this.showImageOfficer = `data:image/png;base64,${this.record.officer_check_out}`
      }
      // this.exit_date = temp_schedule.setHours(temp_schedule.getHours() + 1);
    }
  }

  @ViewChild('residentSignContainer') residentSignComponent!: SignaturePadComponent;
  @ViewChild('officerSignContainer') officerSignComponent!: SignaturePadComponent;

  @ViewChild('facilityAttachment') fileInput!: ElementRef;
  openFileInput(id: number) {
    this.fileInput?.nativeElement.click();
    this.attachment_id = id
  }

  attachment_id = 0

  onFileSelected(event: any) {
    console.log(event.target.files)
    const file = event.target.files[0];
    if (file) {
      // this.selectedFile = file;
      this.formData[this.attachment_id].attachment_name = file.name

      // Konversi file ke base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Hapus prefix data URL jika ada
        const base64 = e.target.result.split(',')[1] || e.target.result;
        this.formData[this.attachment_id].attachment = base64;
        this.attachment_id = 0
      };
      reader.readAsDataURL(file);
    }
  }

  async editImage(id: number) {
    this.attachment_id = id
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64
      });
      console.log(image)
      this.formData[this.attachment_id].attachment = image.base64String || '';
      this.formData[this.attachment_id].attachment_name = this.formData[this.attachment_id].description + '.' + image.format;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }
  
      this.functionMainService.presentToast('Error taking photo', 'danger');
    }
  }

  ngAfterViewInit() {
    // Pastikan `SignaturePadComponent` sudah siap
    console.log(this.residentSignComponent, this.officerSignComponent);
  }

  formData: any = []

  faPenFancy = faPenFancy
  faEraser = faEraser

  record: any
  purpose: string = 'check_in'
  residentSign = ''
  officerSign = ''

  isResidentSigned = false
  isOfficerSigned = false

  showImageResident = ''
  showImageOfficer = ''

  onResidentSign(event: any) {
    this.residentSign = event
  }

  onOfficerSign(event: any) {
    this.officerSign = event
  }

  ngOnInit() {
    this.loadProjectConfig()
  }

  async loadProjectConfig() {
    await this.functionMainService.vmsPreferences().then((value) => {
      this.project_config = value.config
    })
  }
  project_config: any = {}

  onSubmit() {
    let errMsg = ''
    if (!this.residentSign) {
      errMsg += 'Resident signature is required! \n'
    }
    if (!this.officerSign) {
      errMsg += 'Officer signature is required! \n'
    }
    if (errMsg) {
      this.functionMainService.presentToast(errMsg, 'danger')
      return
    }
    let params = { 
      booking_id: this.record.id, 
      resident_check: this.residentSign ? this.residentSign.split(',')[1] : false, 
      officer_check: this.officerSign ? this.officerSign.split(',')[1] : false, 
      check_in_out_type: this.purpose }
    console.log(params)
    this.clientMainService.getApi(params, '/vms/post/check_in_out_booking').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMainService.presentToast(results.result.response_description, 'success');
          if (this.purpose == 'check_in') {
            this.record.resident_check_in = this.isResidentSigned ? this.record.resident_check_in : this.residentSign.split(',')[1]
            this.record.officer_check_in = this.isOfficerSigned ? this.record.officer_check_in : this.officerSign.split(',')[1]
          } else {
            this.record.resident_check_out = this.isResidentSigned ? this.record.resident_check_out : this.residentSign.split(',')[1]
            this.record.officer_check_out = this.isOfficerSigned ? this.record.officer_check_out : this.officerSign.split(',')[1]
          }
          this.router.navigate(['/records-facility-detail'], {
            state: {
              record: this.record
            }
          })
        } else {
          this.functionMainService.presentToast(results.result.response_description, 'danger');
        }
      },
      error: (error) => {
        this.functionMainService.presentToast(error, 'danger');
        console.error(error);
      }
    });
  }

  isLoading = false
  submitForm() {
    if (this.isLoading) return
    let errMsg = ''
    this.formData.map((item: any) => {
      if (!item.quantity) {
        errMsg += item.description + ' quantity is empty! \n'
      }
      if (!item.condition) {
        errMsg += item.description + ' condition is empty! \n'
      }
      if (item.condition == 'damaged') {
        if (!item.remarks) {
          errMsg += item.description + ' remarks is empty! \n'
        }
        if (!item.attachment) {
          errMsg += item.description + ' attachment is empty! \n'
        }
      }
    })
    if (errMsg) {
      this.functionMainService.presentToast(errMsg, 'danger')
    } else {
      this.isLoading = true
      let params = { 
        booking_id: this.record.id,
        form_type: this.purpose,
        form_data: this.formData,
      }
      console.log(params)
      this.clientMainService.getApi(params, '/vms/post/check_in_check_out_form').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.functionMainService.presentToast(results.result.message, 'success');
            if (this.purpose == 'check_in') {
              this.record.is_form_check_in = true
              console.log("CHECK IN")
            } else {
              this.record.is_form_check_out = true
              console.log("CHECK OUT")
            }
            console.log(this.record)
          } else {
            this.functionMainService.presentToast(results.result.response_description, 'danger');
          }
          this.isLoading = false
        },
        error: (error) => {
          this.functionMainService.presentToast('An error occurred while submitting the form!', 'danger');
          console.error(error);
          this.isLoading = false
        }
      });
    }
  }

  onClear(resident: boolean = true) {
    if (resident) {
      this.residentSign = ''
      this.residentSignComponent.clear();
    } else {
      this.officerSign = ''
      this.officerSignComponent.clear();
    }
  }

  onBack() {
    this.router.navigate(['records-facility-detail'], {
      state: {
        record: this.record,
      }
    });
  }


}
