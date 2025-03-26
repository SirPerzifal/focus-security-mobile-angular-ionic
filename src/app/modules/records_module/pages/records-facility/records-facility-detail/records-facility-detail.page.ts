import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-records-facility-detail',
  templateUrl: './records-facility-detail.page.html',
  styleUrls: ['./records-facility-detail.page.scss'],
})
export class RecordsFacilityDetailPage implements OnInit {

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private webrtcservice: WebRtcService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any };
    if (state) {
      this.record = state.record
      console.log(this.record)
      // this.exit_date = temp_schedule.setHours(temp_schedule.getHours() + 1);
    }
  }

  ngOnInit() {
  }

  record: any

  visitor_name = 'Jack';
  contact_no = '+65 8192 022'
  resident_name = 'Rivertree Residences'
  resident_contact_no = ''
  block_name = 'Block 1'
  unit_name = 'Unit 01'
  vehicle_number = '';

  booked_by = 'RIVERTREE RESIDENT'

  onCheckOut(record: any, purpose: string = 'check_in') {
    // Navigasi ke halaman form dengan parameter
    this.router.navigate(['records-facility-check-out'], {
      state: {
        record: record,
        purpose: purpose
      }
    });
  }

  getBookingTime(record: any) {
    let start_date = this.functionMain.convertNewDateTZ(record.start_datetime)
    let stop_date = this.functionMain.convertNewDateTZ(record.stop_datettime)
    const startDate = start_date.split(' ')[0]; 
    return `${startDate} (${start_date.split(' ')[1]} - ${stop_date.split(' ')[1]})` 
  }

  callResident(record:any){
    console.log("record facility details ================", record);
    // this.webrtcservice.createOffer(record);

  }

  returnStatus(record: any) {
    return (record.resident_check_in && record.officer_check_in) ? ((record.resident_check_out && record.officer_check_out) ? '(CHECKED OUT)' : '(CHECKED IN)') : ''
  }

}
