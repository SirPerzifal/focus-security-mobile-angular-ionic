import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-main',
  templateUrl: './alert-main.page.html',
  styleUrls: ['./alert-main.page.scss'],
})
export class AlertMainPage implements OnInit {

  constructor(private router: Router) { }

  alertsIssues:any[] = [
    {
      name: 'Overstaying',
      type: 'overstay',
      vehicleNo: 'SMK1234A',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'CHECKED OUT',
        active:true
      },{
        name:'ISSUE WARNING',
        active:true
      }]
    },
    {
      name: 'Paid - Wheel Clamp',
      type: 'wheel_clamp',
      vehicleNo: 'SMK5848K',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'RELEASE',
        active:true
      }]
    },
    {
      name: 'Pending Payment',
      type: 'wheel_clamp',
      vehicleNo: 'SMK5848K',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'RELEASE',
        active:false
      },{
        name:'PAY NOW',
        active:true
      }]
    },
    {
      name: '1st Warning Issued',
      type: 'first_warning',
      vehicleNo: 'SMK5848K',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'ISSUE 2ND WARNING',
        active:true
      }, {
        name:'CHECKOUT VEHICLE',
        active:true
      }]
    },
    {
      name: '2nd Warning Issued',
      type: 'second_warning',
      vehicleNo: 'SMK5848K',
      dateOfViolation: '5/12/2024',
      actions:[{
        name:'CLAMP',
        active:true
      }, {
        name:'CHECKOUT VEHICLE',
        active:true
      }]
    },
    {
      name: 'Non-Registered Entry',
      type: 'unregistered',
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

  showIssues: any[] = this.alertsIssues

  onActionClick(action: string = '', alert: any){
    if (action == 'PAY NOW') {
      this.router.navigate(['/alert-paynow'], {
        state: {
          alert: alert
        }
      })
    }
  }

  main = true

  ngOnInit() {
  }

  recordsMenu = [
    {
      text: 'OVERSTAY',
      icon: 'assets/icon-vms/records_menu/Visitor_Logs.png',
      isActive: true,
      route: '/records-main',
      needSize: false,
      type: 'overstay',
      isWarning: 1,
      extraTextClass: ""
    },
    {
      text: 'UNREGISTERED',
      icon: 'assets/icon-vms/records_menu/Vehicle_Logs.png',
      isActive: true,
      route: '/records-main',
      needSize: true,
      type: 'unregistered',
      isWarning: 0,
      extraTextClass: 'text-[18px]'
    },
    {
      text: 'TICKETS',
      icon: 'assets/icon-vms/records_menu/Facility_Bookings.png',
      isActive: true,
      route: '/records-main',
      needSize: false,
      type: 'tickets',
      isWarning: 1,
      extraTextClass: ""
    },
    {
      text: 'WARNING NOTICE 1',
      icon: 'assets/icon-vms/records_menu/First_Warning.png',
      isActive: true,
      route: '/records-wheel-clamped',
      needSize: false,
      type: 'first_warning',
      isWarning: 1,
      extraTextClass: "",
    },
    {
      text: 'WARNING NOTICE 2',
      icon: 'assets/icon-vms/records_menu/Second_Warning.png',
      isActive: true,
      route: '/records-wheel-clamped',
      needSize: false,
      type: 'second_warning',
      isWarning: 0,
      extraTextClass: "",
    },
    {
      text: 'WHEEL CLAMPEDED',
      icon: 'assets/icon-vms/records_menu/Wheel_Clamped.png',
      isActive: true,
      route: '/records-wheel-clamped',
      needSize: false,
      type: 'wheel_clamp',
      isWarning: 2,
      extraTextClass: "",
    },
  ]

  record_text = ''
  active_type = ''
  selectedMenu: any[] = []

  toggleRecordsButton(records: any) {
    if (records.type == this.active_type){
      this.main = true
      this.record_text = ''
      records.isActive = true
      this.active_type = ''
    } else {
      this.main = false
      this.record_text = records.text
      this.active_type = records.type
      records.isActive = true
      this.showIssues = this.alertsIssues.filter(item => item.type === records.type)
      this.selectedMenu = this.recordsMenu.filter(item => item.type === records.type)
    }
    console.log(this.active_type, records.type)
  }

}
