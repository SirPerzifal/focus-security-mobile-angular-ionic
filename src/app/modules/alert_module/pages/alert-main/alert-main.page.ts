import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-main',
  templateUrl: './alert-main.page.html',
  styleUrls: ['./alert-main.page.scss'],
})
export class AlertMainPage implements OnInit {

  constructor() { }

  alertsIssues:any[] = [
    {
      name: 'Overstaying',
      vehicleNo: 'SMK1234A',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'Checked Out',
        active:true
      },{
        name:'Issue Warning',
        active:true
      }]
    },
    {
      name: 'Paid - Wheel Clamp',
      vehicleNo: 'SMK5848K',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'Release',
        active:true
      }]
    },
    {
      name: 'Pending Payment',
      vehicleNo: 'SMK5848K',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'Release',
        active:false
      },{
        name:'Paynow',
        active:true
      }]
    },
    {
      name: '1st Warning Issued',
      vehicleNo: 'SMK5848K',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'Issue 2nd Warning',
        active:true
      }]
    },
    {
      name: 'Non-Registered Entry',
      vehicleNo: 'ABC1234D',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'Clamp Vehicle',
        active:true
      },{
        name:'Register',
        active:true
      }]
    },
    // Tambahkan data lain jika diperlukan
  ];

  ngOnInit() {
  }

}
