import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEraser, faPenFancy } from '@fortawesome/free-solid-svg-icons';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { SignaturePadComponent } from 'src/app/shared/components/signature-pad/signature-pad.component';

@Component({
  selector: 'app-records-facility-check-out',
  templateUrl: './records-facility-check-out.page.html',
  styleUrls: ['./records-facility-check-out.page.scss'],
})
export class RecordsFacilityCheckOutPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mainVmsService: MainVmsService,
    private functionMainService: FunctionMainService
    // private canvas: Canvas
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any, purpose: string };
    if (state) {
      this.record = state.record
      this.purpose = state.purpose
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

  ngAfterViewInit() {
    // Pastikan `SignaturePadComponent` sudah siap
    console.log(this.residentSignComponent, this.officerSignComponent);
  }


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
    console.log(event)
  }

  onOfficerSign(event: any) {
    this.officerSign = event
  }

  ngOnInit() {
  }

  onSubmit() {
    let params = { 
      booking_id: this.record.id, 
      resident_check: this.residentSign ? this.residentSign.split(',')[1] : false, 
      officer_check: this.officerSign ? this.officerSign.split(',')[1] : false, 
      check_in_out_type: this.purpose }
    console.log(params)
    this.mainVmsService.getApi(params, '/vms/post/check_in_out_booking').subscribe({
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
