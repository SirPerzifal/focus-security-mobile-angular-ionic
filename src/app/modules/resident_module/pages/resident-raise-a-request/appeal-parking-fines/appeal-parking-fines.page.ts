import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appeal-parking-fines',
  templateUrl: './appeal-parking-fines.page.html',
  styleUrls: ['./appeal-parking-fines.page.scss'],
})
export class AppealParkingFinesPage implements OnInit {

  appealData: any = [
    {
      ReportNo: 1,
      VehicleNo: 'RC 1665',
      OffenceDate: '01-01-2025',
      Status: 'Approved'
    },
    {
      ReportNo: 2,
      VehicleNo: 'PB 7661',
      OffenceDate: '02-01-2025',
      Status: 'Approved'
    },
    {
      ReportNo: 3,
      VehicleNo: 'TC 6652',
      OffenceDate: '03-01-2025',
      Status: 'Approved'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('tes')
  }

  navigateToAppealForm(appealData: any) {
    this.router.navigate(['/appeal-form'], {
      state: {
        appealData: appealData
      }
    });
  }

}
