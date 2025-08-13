import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-form-and-history-appeal-parking-fines',
  templateUrl: './form-and-history-appeal-parking-fines.page.html',
  styleUrls: ['./form-and-history-appeal-parking-fines.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class FormAndHistoryAppealParkingFinesPage implements OnInit {

  subPageName: string = 'Appeal Parking Fines';
  isLoading: boolean = true;
  appealData: any = [];
  appealNowFromData = {
    id : '',
    name : '',
    contact_number : '',
    offender_name : '',
    vehicle_number : '',
    block_id : '',
    block_name : '',
    unit_id : '',
    unit_name : '',
    issue_time : '',
    appeal_status : '',
    reason_for_appeal: ''
  }

  constructor(private mainApi: MainApiResidentService, public functionMain: FunctionMainService, private router: Router) { }

  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.loadOffence();
      event.target.complete();
    }, 1000)
  }

  ngOnInit() {
    this.loadOffence();
  }

  ambil_tanggal(datetime_str: any) {
    const tanggal = datetime_str.split(" ")[0]
    return tanggal
  }

  backButtonClickFunc() {
    if (this.subPageName === 'Appeal Form') {
      this.subPageName = 'Appeal Parking Fines';
    } else {
      this.router.navigate(['raise-a-request-page'])
    }
  }

  loadOffence() {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/offenses').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        // console.log(response);
        this.appealData = response.result.response_result.map((appeal_data: any) => {
          return {
            'id' : appeal_data.id,
            'name' : appeal_data.name,
            'contact_number' : appeal_data.contact_number,
            'offender_name' : appeal_data.offender_name,
            'vehicle_number' : appeal_data.vehicle_number,
            'block_id' : appeal_data.block_id,
            'block_name' : appeal_data.block_name,
            'unit_id' : appeal_data.unit_id,
            'unit_name' : appeal_data.unit_name,
            'issue_time' : this.ambil_tanggal(appeal_data.issue_time),
            'appeal_status' : appeal_data.appeal_status
          }
        })
        console.log(this.appealData);
        
        if (this.appealData) {
          this.isLoading = false;
        }
      } 
    });
  }

  appealNow(appealData: any) {
    this.subPageName = 'Appeal Form';
    this.appealNowFromData = {
      id : appealData.id,
      name : appealData.name,
      contact_number : appealData.contact_number,
      offender_name : appealData.offender_name,
      vehicle_number : appealData.vehicle_number,
      block_id : appealData.block_id,
      block_name : appealData.block_name,
      unit_id : appealData.unit_id,
      unit_name : appealData.unit_name,
      issue_time : appealData.issue_time,
      appeal_status : appealData.appeal_status,
      reason_for_appeal: ''
    };
  }

  onSubmitNext() {
    this.mainApi.endpointMainProcess({
      offence_id: this.appealNowFromData.id,
      reason_for_appeal: this.appealNowFromData.reason_for_appeal,
    }, 'post/offenses_appeal').subscribe((Response: any) => {
      // console.log(Response);
      if (Response.result.response_code === 200) {
        this.functionMain.presentToast('Appeal data has been successfully saved!', 'success');
      this.subPageName = 'Appeal Parking Fines';
      } else {
        this.functionMain.presentToast('Failed to save appeal data!', 'danger');
      }
    })
  }

}
