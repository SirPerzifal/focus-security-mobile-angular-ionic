import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-facility-history',
  templateUrl: './facility-history.page.html',
  styleUrls: ['./facility-history.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class FacilityHistoryPage implements OnInit {
  showMainContent = true;
  showDetailContent = false;
  showMainContentTrans = false;
  showDetailContentTrans = false;

  bookingDetails = {
    facilityName: '',
    eventDate: '',
    eventDay: '',
    bookingTime: '',
    bookingFee: 0,
    deposit: 0
  };

  bookingList = [
    {
      facilityName: 'Tennis Court 2',
      eventDate: '26/10/2024',
      eventDay: 'Saturday',
      bookingTime: '1600 - 2200',
      bookingFee: 20.00,
      deposit: 40.00,
      bookedBy: 'Ashok',
      status: 'Approved'
    },
    {
      facilityName: 'BBQ Pit 2',
      eventDate: '26/10/2024',
      eventDay: 'Saturday',
      bookingTime: '1600 - 2200',
      bookingFee: 25.00,
      deposit: 50.00,
      bookedBy: 'Yogesh',
      status: 'Pending'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {}

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

  toDetail(booking: any) {
    if (!this.showDetailContent) {
      this.bookingDetails = { ...booking };
      this.showMainContentTrans = true;
      this.showMainContent = false;
      setTimeout(() => {
        this.showDetailContent = true;
      }, 300);
    }
  }

  backToMainContent() {
    if (!this.showMainContent) {
      this.showDetailContentTrans = true;
      this.showDetailContent = false;
      setTimeout(() => {
        this.showMainContent = true;
      }, 300);
    }
  }

  calculateTotal(): number {
    return this.bookingDetails.bookingFee + this.bookingDetails.deposit;
  }

  proceedToEmail() {
    // Logika untuk mengirim email
    console.log('Sending email for booking:', this.bookingDetails);
  }
}