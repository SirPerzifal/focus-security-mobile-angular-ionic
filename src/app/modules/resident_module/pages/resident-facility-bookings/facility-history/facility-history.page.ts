import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { trigger, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';

import { BookingData } from 'src/models/resident/facility.model';
import { FacilityBookingsService } from 'src/app/service/resident/facility-bookings/facility-bookings.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

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
export class FacilityHistoryPage implements OnInit, OnDestroy {
  isLoading: boolean = true;
  unit_id: string = '1';
  showMainContent = true;
  showDetailContent = false;
  showMainContentTrans = false;
  showDetailContentTrans = false;
  originalBookingList: any[] = []; // Tambahkan properti untuk menyimpan daftar booking asli
  filteredBookingList: any[] = []; // Properti untuk menyimpan daftar booking yang difilter

  bookingDetails = {
    facilityName: '',
    eventDate: '',
    eventDay: '',
    bookingTime: '',
    bookingFee: 0,
    deposit: 0
  };

  startDate: string = '';
  endDate: string = '';
  bookingList: any[] = [];

  constructor(private router: Router, private facilityBookingService: FacilityBookingsService, private getUserInfoService: GetUserInfoService) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unit_id = parseValue.unit_id;
        this.loadHistoryBookings();
      }
    })
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }

  onStartDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.startDate = input.value;
    this.applyDateFilter();
  }

  onEndDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.endDate = input.value;
    this.applyDateFilter();
  }
  
  applyDateFilter() {
    // Pastikan kita menggunakan daftar booking asli untuk filtering
    if (!this.originalBookingList || this.originalBookingList.length === 0) return;

    // Filter booking berdasarkan rentang tanggal
    this.bookingList = this.originalBookingList.filter(booking => {
      const bookingDate = booking.rawDate;
      
      // Konversi startDate dan endDate ke Date object jika ada
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;

      // Cek kondisi filtering
      const isAfterStartDate = !startDate || bookingDate >= startDate;
      const isBeforeEndDate = !endDate || bookingDate <= endDate;

      return isAfterStartDate && isBeforeEndDate;
    });
  }

  // Tambahkan method reset filter jika diperlukan
  resetFilter() {
    this.startDate = '';
    this.endDate = '';
    this.bookingList = [...this.originalBookingList];
  }

  loadHistoryBookings() {
    if (this.unit_id) {
      this.facilityBookingService.getHistoryBookingsServices(this.unit_id).subscribe({
        next: (response: any) => {
          console.log(response);
          
          if (response.result && response.result.booking && Array.isArray(response.result.booking)) {
            // Simpan daftar booking asli
            this.originalBookingList = response.result.booking.map((booking: any) => ({
              facilityName: booking.facility || 'Unknown Facility',
              eventDate: this.formatDate(booking.event_date || booking.start_datetime.split(' ')[0]),
              eventDay: this.getDayName(new Date(booking.booking_date || booking.start_datetime)),
              bookingTime: `${this.formatTime(booking.start_datetime)} - ${this.formatTime(booking.stop_datettime)}`,
              bookingFee: booking.booking_fee || 0,
              deposit: booking.deposit || 0,
              bookedBy: booking.booked_by || 'Unknown',
              status: booking.state || booking.booking_status,
              id: booking.id,
              rawDate: new Date(booking.event_date || booking.start_datetime) // Tambahkan raw date untuk filtering
            }));

            // Set booking list awal
            this.bookingList = [...this.originalBookingList];
            this.filteredBookingList = [...this.originalBookingList];
            this.isLoading = false;
            // console.log(response.result, this.isLoading);
            
          } else {
            this.originalBookingList = [];
            this.bookingList = [];
            this.filteredBookingList = [];
          }
        },
        error: (error) => {
          console.error('Error fetching history bookings', error);
          this.originalBookingList = [];
          this.bookingList = [];
          this.filteredBookingList = [];
        }
      });
    }
  }

  navigateToHistoryDetail(booking: BookingData) {
    // Gunakan NavigationExtras untuk membawa data
    this.router.navigate(['/facility-history-form'], {
      state: {
        bookingData: booking
      }
    });
  }
  
  // Utility method untuk memformat waktu
  formatTime(datetime: string): string {
    if (!datetime) return '';
    
    // Misalkan format datetime adalah 'YYYY-MM-DD HH:mm:ss'
    const timePart = datetime.split(' ')[1];
    
    // Potong detik jika perlu
    return timePart ? timePart.substring(0, 5) : '';
  }

  getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
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
    // console.log('Sending email for booking:', this.bookingDetails);
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}