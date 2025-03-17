import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-records-warning-detail',
  templateUrl: './records-warning-detail.page.html',
  styleUrls: ['./records-warning-detail.page.scss'],
})
export class RecordsWarningDetailPage implements OnInit {

  vehicle: any = {}
  offence_detail: any = []

  constructor(private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any, offence_detail: any};
    if (state) {
      this.vehicle = state.vehicle
      this.offence_detail = state.offence_detail
      this.vehicle_number = state.vehicle.vehicle_number
      console.log(this.offence_detail)
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

  vehicle_number = ''
  // Properties
  first_issued = '4';
  second_issued = '4';
  wheel_clamp = '4';

// Array of objects
first_issued_array = [
  {
    serial_number: 'SN001',
    issued_date: '24/12/2024',
    issued_time: '07:39',
    issued_by: 'Mr. John Doe',
  },
  {
    serial_number: 'SN002',
    issued_date: '25/12/2024',
    issued_time: '08:15',
    issued_by: 'Mrs. Jane Smith',
  },
  {
    serial_number: 'SN003',
    issued_date: '26/12/2024',
    issued_time: '09:00',
    issued_by: 'Mr. Alex Brown',
  },
  {
    serial_number: 'SN004',
    issued_date: '27/12/2024',
    issued_time: '10:45',
    issued_by: 'Ms. Emily Davis',
  },
];

second_issued_array = [
  {
    serial_number: 'SN101',
    issued_date: '20/12/2024',
    issued_time: '06:30',
    issued_by: 'Mr. Michael Lee',
  },
  {
    serial_number: 'SN102',
    issued_date: '21/12/2024',
    issued_time: '07:00',
    issued_by: 'Ms. Laura Wilson',
  },
  {
    serial_number: 'SN103',
    issued_date: '22/12/2024',
    issued_time: '07:30',
    issued_by: 'Mr. Kevin Johnson',
  },
  {
    serial_number: 'SN104',
    issued_date: '23/12/2024',
    issued_time: '08:00',
    issued_by: 'Mrs. Sophia Miller',
  },
];

wheel_clamp_array = [
  {
    serial_number: 'WC201',
    clamp_date: '19/12/2024',
    clamp_time: '05:45',
    clamped_by: 'Officer Harry White',
  },
  {
    serial_number: 'WC202',
    clamp_date: '20/12/2024',
    clamp_time: '06:15',
    clamped_by: 'Officer Rachel Green',
  },
  {
    serial_number: 'WC203',
    clamp_date: '21/12/2024',
    clamp_time: '06:45',
    clamped_by: 'Officer Ryan Black',
  },
  {
    serial_number: 'WC204',
    clamp_date: '22/12/2024',
    clamp_time: '07:15',
    clamped_by: 'Officer Olivia Gray',
  },
];


  last_offence = '24/12/2024'
}
