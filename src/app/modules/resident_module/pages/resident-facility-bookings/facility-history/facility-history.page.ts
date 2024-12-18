import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { FacilityBookingsService } from 'src/app/service/resident/facility-bookings/facility-bookings.service';

interface BookingData {
  facility_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  booking_fee: number;
  deposit: number;
  booked_by: string;
  status: string;
}

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
  unit_id: string = '1';
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

  bookingList: any[] = [];

  constructor(private router: Router, private facilityBookingService: FacilityBookingsService,) { }

  loadHistoryBookings() {
    if (this.unit_id) {
      this.facilityBookingService.getHistoryBookingsServices(this.unit_id).subscribe({
        next: (response: any) => {
          // Log full response untuk debugging
          console.log('Full Response:', response);
  
          // Pastikan response memiliki active_bookings
          if (response.result && response.result.booking && Array.isArray(response.result.booking)) {
            this.bookingList = response.result.booking.map((booking: any) => ({
              facilityName: booking.facility || 'Unknown Facility',
              eventDate: booking.event_date || booking.start_datetime.split(' ')[0],
              eventDay: this.getDayName(new Date(booking.booking_date || booking.start_datetime)),
              bookingTime: `${this.formatTime(booking.start_datetime)} - ${this.formatTime(booking.stop_datetime)}`,
              bookingFee: booking.booking_fee || 0,
              deposit: booking.deposit || 0,
              bookedBy: booking.booked_by || 'Unknown',
              status: booking.state || booking.booking_status,
              id: booking.id // Tambahkan ID untuk referensi unik
            }));
  
            console.log("Mapped Booking List:", this.bookingList);
          } else {
            console.warn('No booking data found');
            this.bookingList = [];
            console.log("Mapped Booking List:", this.bookingList);
          }
        },
        error: (error) => {
          console.error('Error fetching history bookings', error);
          this.bookingList = [];
        }
      });
    }
  }
  
  // Utility method untuk memformat waktu
  formatTime(datetime: string): string {
    if (!datetime) return '';
    
    // Misalkan format datetime adalah 'YYYY-MM-DD HH:mm:ss'
    const timePart = datetime.split(' ')[1];
    
    // Potong detik jika perlu
    return timePart ? timePart.substring(0, 5) : '';
  }
  
  // Utility method untuk mapping status
  // mapStatus(status: string): string {
  //   const statusMap: { [key: string]: string } = {
  //     'draft': 'Pending',
  //     'confirmed': 'Approved',
  //     'cancelled': 'Rejected',
  //     // Tambahkan mapping status lain sesuai kebutuhan
  //   };
    
  //   return statusMap[status.toLowerCase()] || status;
  // }
  
  // Utility method untuk mengonversi tanggal ke nama hari
  getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  ngOnInit() {
    console.log('tes')
    this.loadHistoryBookings();
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