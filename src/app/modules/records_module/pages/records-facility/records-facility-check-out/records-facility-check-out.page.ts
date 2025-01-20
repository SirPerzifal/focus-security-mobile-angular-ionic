import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPenFancy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-records-facility-check-out',
  templateUrl: './records-facility-check-out.page.html',
  styleUrls: ['./records-facility-check-out.page.scss'],
})
export class RecordsFacilityCheckOutPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any, purpose: string };
    if (state) {
      this.record = state.record
      this.purpose = state.purpose
      // this.exit_date = temp_schedule.setHours(temp_schedule.getHours() + 1);
    }
  }

  faPenFancy = faPenFancy

  record: any
  purpose: string = 'check_in'

  ngOnInit() {
  }

}
