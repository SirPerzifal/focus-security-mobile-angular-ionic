import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-records-warning-history',
  templateUrl: './records-warning-history.page.html',
  styleUrls: ['./records-warning-history.page.scss'],
})
export class RecordsWarningHistoryPage implements OnInit {

  vehicle: any = {}

  constructor(private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any};
    if (state) {
      this.vehicle = state.vehicle
      this.vehicle_number = state.vehicle.vehicle_number
    } 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
    })
  }

  params: any
  pageType = 'wheel_clamp'


  qr_code = ''

  vehicle_number='';
  first_issued = '4'
  second_issued = '4'
  wheel_clamp = '4'
  last_offence = '24/12/2024'

  onClickDetails() {
    this.router.navigate(['records-warning-detail'], {
      state: {
        vehicle: this.vehicle
      },
      queryParams: this.params
    });
  }

}
