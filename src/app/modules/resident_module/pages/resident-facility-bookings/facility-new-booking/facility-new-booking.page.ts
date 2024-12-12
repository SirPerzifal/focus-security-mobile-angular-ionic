import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewBookingService } from 'src/app/service/resident/facility-bookings/new-booking/new-booking.service';

interface Facility {
  facility_id: number;
  facility_name: string;
  total_facilities: number;
}

@Component({
  selector: 'app-facility-new-booking',
  templateUrl: './facility-new-booking.page.html',
  styleUrls: ['./facility-new-booking.page.scss'],
})
export class FacilityNewBookingPage implements OnInit {
  facilities: Facility[] = [];
  placeholderImage = 'https://placehold.co/300x150';

  constructor(
    private router: Router,
    private newBookingService: NewBookingService
  ) { }

  ngOnInit() {
    this.loadFacilities();
  }

  loadFacilities() {
    this.newBookingService.getFacilityServices().subscribe({
      next: (response) => {
        this.facilities = response.result || [];
        console.log('Facilities:', this.facilities);
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

  // Fungsi untuk mendapatkan gambar placeholder berdasarkan nama fasilitas
  getFacilityImage(facilityName: string): string {
    const facilityImages: { [key: string]: string } = {
      'Tennis Court': 'https://placehold.co/300x150?text=Tennis+Court',
      'Function Room': 'https://placehold.co/300x150?text=Function+Room',
      'BBQ Pit': 'https://placehold.co/300x150?text=BBQ+Pit'
    };
    return facilityImages[facilityName] || this.placeholderImage;
  }
}