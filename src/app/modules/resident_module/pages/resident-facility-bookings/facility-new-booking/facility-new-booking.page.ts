import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facility-new-booking',
  templateUrl: './facility-new-booking.page.html',
  styleUrls: ['./facility-new-booking.page.scss'],
})
export class FacilityNewBookingPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  toggleShowActBk() {
    this.router.navigate(['resident-facility-bookings']);
  }

  toggleShowNewBk() {
    this.router.navigate(['facility-new-booking']);
  }

  toggleShowDep() {
    this.router.navigate(['facility-deposits']);
  }

  toggleShowHis() {
    this.router.navigate(['facility-history']);
  }
}
