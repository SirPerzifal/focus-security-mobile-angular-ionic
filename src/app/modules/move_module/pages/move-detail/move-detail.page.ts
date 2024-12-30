import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoveHomePage } from '../move-home/move-home.page';

@Component({
  selector: 'app-move-detail',
  templateUrl: './move-detail.page.html',
  styleUrls: ['./move-detail.page.scss'],
})
export class MoveDetailPage implements OnInit {

  constructor(private router: Router, private moveHome: MoveHomePage, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { id: number, schedule_date: string};
    if (state) {
      this.id = state.id
      this.entry_date = state.schedule_date ? moveHome.convertToDDMMYYYY(state.schedule_date.split(' ')[0]) : ''
      let temp_schedule = new Date(state.schedule_date)
      // this.exit_date = temp_schedule.setHours(temp_schedule.getHours() + 1);
    } 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
    })
  }

  pageType = 'move_in'

  id = 0
  contractor_name ='JACK';
  company_name = 'JACK CORP';
  vehicle_number = 'SBS 8128 X'
  contact_no = '+65 8192 022'
  contractor_pass_no = '+65 8192 022'
  entry_date = ''
  exit_date = ''
  accompanied_by = '5'
  applied_by = 'WILSON'
  resident_contact_no = '+65 8192 022'

  onAccompanyDetail() {
    this.main = !this.main
  }

  number_of_pax = 5
  main = true

  pax_array = [
    {
      serial_number: 'SN001',
      identity: 'SXXXX789A',
      name: 'Mr. John Doe',
    },
    {
      serial_number: 'SN002',
      identity: 'SXXXX723A',
      name: 'Mrs. Jane Smith',
    },
    {
      serial_number: 'SN003',
      identity: 'SXXXX902A',
      name: 'Mr. Alex Brown',
    },
    {
      serial_number: 'SN004',
      identity: 'SXXXX019B',
      name: 'Ms. Emily Davis',
    },
    {
      serial_number: 'SN004',
      identity: 'SXXXX019B',
      name: 'Ms. Emily Davis',
    },
  ];
}
