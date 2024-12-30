import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-records-main',
  templateUrl: './records-main.page.html',
  styleUrls: ['./records-main.page.scss'],
})
export class RecordsMainPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  recordsMenu = [
    {
      text: 'VISITOR LOGS',
      icon: 'assets/icon-vms/records_menu/Visitor_Logs.png',
      isActive: false,
      route: '/records-visitor',
      needSize: false,
      params: {
        type: 'visitor'
      }
    },
    {
      text: 'VEHICLE LOGS',
      icon: 'assets/icon-vms/records_menu/Vehicle_Logs.png',
      isActive: false,
      route: '/records-visitor',
      needSize: true,
      params: {
        type: 'vehicle'
      }
    },
    {
      text: 'FACILITY BOOKINGS',
      icon: 'assets/icon-vms/records_menu/Facility_Bookings.png',
      isActive: false,
      route: '/records-facility',
      needSize: true,
    },
    {
      text: '1ST WARNING',
      icon: 'assets/icon-vms/records_menu/First_Warning.png',
      isActive: false,
      route: '/records-wheel-clamped',
      needSize: false,
      params: {
        type: 'first_warning'
      }
    },
    {
      text: '2ND WARNING',
      icon: 'assets/icon-vms/records_menu/Second_Warning.png',
      isActive: false,
      route: '/records-wheel-clamped',
      needSize: false,
      params: {
        type: 'second_warning'
      }
    },
    {
      text: 'WHEEL CLAMPED',
      icon: 'assets/icon-vms/records_menu/Wheel_Clamped.png',
      isActive: false,
      route: '/records-wheel-clamped',
      needSize: false,
      params: {
        type: 'wheel_clamp'
      }
    },
    {
      text: 'BLACKLIST',
      icon: 'assets/icon-vms/records_menu/Blacklist.png',
      isActive: false,
      route: '/records-blacklist',
      needSize: false,
    },
  ]

  toggleRecordsButton(records: any, params: any = false) {
    this.recordsMenu.forEach(item => item.isActive = false)
    records.isActive = !records.isActive
    if (!params) {
      this.router.navigate([records.route])
    } else {
      this.router.navigate([records.route], {queryParams: params})
    }
  }
}
