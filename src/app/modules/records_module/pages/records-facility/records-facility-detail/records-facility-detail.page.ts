import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-records-facility-detail',
  templateUrl: './records-facility-detail.page.html',
  styleUrls: ['./records-facility-detail.page.scss'],
})
export class RecordsFacilityDetailPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any };
    if (state) {
      this.record = state.record
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
    let [year, month, day] = record.start_datetime.split(' ')[0].split('-'); 
    const startDate = `${day}/${month}/${year}`; 
    return `${startDate} (${record.start_datetime.split(' ')[1]} - ${record.stop_datettime.split(' ')[1]})` 
  }

}
