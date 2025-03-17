import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Facility } from 'src/models/resident/facility.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { NewBookingService } from 'src/app/service/resident/facility-bookings/new-booking/new-booking.service';

@Component({
  selector: 'app-facility-new-booking',
  templateUrl: './facility-new-booking.page.html',
  styleUrls: ['./facility-new-booking.page.scss'],
})
export class FacilityNewBookingPage implements OnInit {
  facilities: Facility[] = [];
  placeholderImage = 'https://placehold.co/300x150';

  isLoading: boolean = true;

  constructor(
    private router: Router,
    private newBookingService: NewBookingService,
    public functionMainService: FunctionMainService,
  ) { }

  ngOnInit() {
    this.loadFacilities();
  }

  loadFacilities() {
    this.newBookingService.getFacilityServices().subscribe({
      next: (response) => {
        this.facilities = response.result || [];
        if (this.facilities) {
          this.isLoading = false;
        }
        // // console.log('Facilities:', this.facilities);
      },
      error: (error) => {
        console.error('Error loading facilities', error);
      }
    });
  }

  navigateToFacilityPlaceBooking(facilityId: number) {
    // Navigasi dengan parameter
    this.router.navigate(['/facility-place-booking'], {
      queryParams: { facilityId: facilityId }
    });
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