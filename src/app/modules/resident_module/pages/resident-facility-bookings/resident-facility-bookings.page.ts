import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resident-facility-bookings',
  templateUrl: './resident-facility-bookings.page.html',
  styleUrls: ['./resident-facility-bookings.page.scss'],
})
export class ResidentFacilityBookingsPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  toggleShowActBk() {
    this.router.navigate(['']);
  }

  toggleShowNewBk() {
    this.router.navigate(['']);
  }

  toggleShowDep() {
    this.router.navigate(['']);
  }

  toggleShowHis() {
    this.router.navigate(['']);
  }
}
