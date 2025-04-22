import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

interface ActiveBooking {
  id: number;
  facilityName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  statusBooked: string;
  amountUntaxed: string,
  amount_taxed: string,
  amount_total: string,
  amount_deposit: number,
}

interface BookingResponse {
  id: number;
  facility_name: string;
  booking_date: string;
  start_datetime: string;
  stop_datettime: string;
  booked_by: string;
  booking_status: string;
  amount_untaxed: string,
  amount_taxed: string,
  amount_total: string,
  amount_deposit: string,
}

interface Facility {
  facility_id: number;
  facility_name: string;
  total_facilities: number;
  facility_banner: string;
}

@Component({
  selector: 'app-facility-booking-main',
  templateUrl: './facility-booking-main.page.html',
  styleUrls: ['./facility-booking-main.page.scss'],
})
export class FacilityBookingMainPage implements OnInit {

  isLoading: boolean = false;
  subPageName: string = 'Active Bookings';
  navButtonsMain: any[] = [
    {
      text: 'Active',
      active: true,
      action: 'click',
    },
    {
      text: 'New',
      active: false,
      action: 'click',
    },
    {
      text: 'History',
      active: false,
      action: 'click'
    },
  ];

  activeBookings: ActiveBooking[] = [];

  facilities: Facility[] = [];
  placeholderImage = 'https://placehold.co/300x150';

  startDateFilter: string = '';
  endDateFilter: string = '';
  originalBookingList: any[] = []; // Tambahkan properti untuk menyimpan daftar booking asli
  filteredBookingList: any[] = []; // Properti untuk menyimpan daftar booking yang difilter

  constructor(
    public functionMain: FunctionMainService,
    private mainApi: MainApiResidentService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { restart: boolean };
    if (state) {
      this.loadActiveBookings();
    } else {
      this.loadActiveBookings();
    }
  }

  ngOnInit() {    
  }

  onClickNav(event: any) {
    if (event[1] === 'Active') {
      this.loadActiveBookings();
    } else if (event[1] === 'New') {
      this.loadFacilities();
    } else if (event[1] === 'History') {
      this.loadHistoryBookings();
    }
    
    if (event[1] !== 'home-page') {
      this.subPageName = `${event[1]} Bookings`;

      // Reset semua tombol menjadi tidak aktif
      this.navButtonsMain.forEach(button => {
        button.active = false;
      });

      // Aktifkan tombol yang sesuai
      const selectedButton = this.navButtonsMain.find(button => button.text === event[1]);
      if (selectedButton) {
        selectedButton.active = true;
      }
    } else if (event[1] === 'home-page') {
      this.router.navigate(['resident-home-page'])
    }
  }

  loadActiveBookings() {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/facility_book').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        this.isLoading = false;
        // Map data dengan tipe yang jelas
        this.activeBookings = response.result.active_bookings.map((booking: BookingResponse) => ({
          id: booking.id,
          facilityName: booking.facility_name,
          eventDate: this.functionMain.formatDateFacility(booking.booking_date),
          startTime: this.functionMain.formatDateFacility(booking.start_datetime),
          endTime: this.functionMain.formatDateFacility(booking.stop_datettime),
          bookedBy: booking.booked_by,
          statusBooked: booking.booking_status,
          amount_untaxed: booking.amount_untaxed,
          amount_taxed: booking.amount_taxed,
          amount_total: booking.amount_total,
          amount_deposit: booking.amount_deposit,
        }));
      }
    })
  }

  cancelBooking(bookingId: number) {
    this.presentCustomAlert(
      'Cancel Booking', 
      'Cancel', 
      'Confirm',
      bookingId.toString()
    );
  }

  getBookingStatusLabel(status: string): string {
    switch(status) {
      case 'approved': return 'Booking Approved';
      case 'requested': return 'Booking Requested';
      case 'pending_approval': return 'Pending Approval';
      case 'pending_payment': return 'Pending Payment';
      case 'rejected': return 'Booking Rejected';
      case 'cancel': return 'Booking Cancelled';
      default: return status;
    }
  }

  public async presentCustomAlert(
    header: string = 'Cancel Booking', 
    cancelText: string = 'Cancel', 
    confirmText: string = 'Confirm',
    bookingId: string
  ) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: header,
      message: '1. Any booking fees, if applicable, will be refunded to the credit card originally charged.<br> 2. Any deposit associated with this booking will be returned to your deposit balance.', 
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {
            // console.log('Booking cancellation cancelled');
          }
        },
        {
          text: confirmText,
          cssClass: 'confirm-button',
          handler: () => {
            this.confirmBookingCancellation(bookingId);
          },
        },
      ]
    });
  
    await alert.present();
  }

  confirmBookingCancellation(bookingId: string) {
    this.deleteBooking(bookingId);
  }

  deleteBooking(bookingId: string) {
    this.mainApi.endpointMainProcess({
      booking_id: bookingId
    }, 'post/cancel_booking').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        // console.log('work')
        this.activeBookings = []
        this.loadActiveBookings();
      } else {
        this.functionMain.presentToast('Failed to delete booking data', 'danger');
        console.error('Error:', response);
      }
    })
  }

  addToCalendar(booking: ActiveBooking) {
    // console.log(booking);
    const eventTitle = encodeURIComponent(booking.facilityName);
    const bookedBy = encodeURIComponent(booking.bookedBy);
  
    // Ubah format tanggal dari MM/DD/YYYY ke YYYY-MM-DD
    const [day, month, year] = booking.eventDate.split('/');
    const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD
  
    const startTime = booking.startTime; // Format: HH:MM AM/PM
    const endTime = booking.endTime; // Format: HH:MM AM/PM
  
    // Gabungkan tanggal dan waktu
    const startDateTimeString = `${formattedDate} ${startTime}`;
    const endDateTimeString = `${formattedDate} ${endTime}`;
  
    // Buat objek Date
    const startDateTime = new Date(startDateTimeString);
    const endDateTime = new Date(endDateTimeString);
  
    // Periksa apakah objek Date valid
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      console.error('Invalid date or time value:', startDateTimeString, endDateTimeString);
      return; // Keluar dari fungsi jika ada nilai yang tidak valid
    }
  
    // Format ke dalam format yang sesuai untuk Google Calendar
    const startDateTimeISO = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDateTimeISO = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
    // URL untuk Google Calendar
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDateTimeISO}/${endDateTimeISO}&details=Booked%20by%3A%20${bookedBy}`;
  
    // Buka URL di jendela baru
    window.open(googleCalendarUrl, '_blank');
  }

  navigateToHistoryDetail(booking: any, from: string) {
    if (from === 'Active') {
      let start_time, end_time;
  
      // Cek apakah booking.bookingTime dapat di-split
      if (booking.bookingTime && booking.bookingTime.includes(' - ')) {
          [start_time, end_time] = booking.bookingTime.split(' - ');
      } else {
          // Jika tidak bisa di-split, gunakan nilai default
          start_time = booking.startTime || '';
          end_time = booking.endTime || '';
      }
      
      const bookingData = {
          booking_id: booking.id,
          facilityName: booking.facilityName,
          eventDate: booking.eventDate,
          bookingTime: booking.startTime ? `${booking.startTime} - ${booking.endTime}` : `${booking.bookingTime}`,
          startTime: booking.startTime ? booking.startTime : start_time,
          endTime: booking.endTime ? booking.endTime : end_time,
          bookingFee: booking.amount_total,
          bookingTax: booking.amount_taxed ? booking.amount_taxed : 0,
          deposit: booking.amount_deposit,
          bookedBy: booking.bookedBy,
          status: booking.statusBooked ? booking.statusBooked : booking.status,
          from: from,
          amountDeposit: booking.amount_deposit
      };
  
      // Gunakan NavigationExtras untuk membawa data
      this.router.navigate(['/facility-booking-see-detail'], {
        state: {
          bookingData: bookingData
        }
      });
      console.log(from, bookingData);
    } else {
      this.router.navigate(['/facility-booking-see-detail'], {
        state: {
          bookingData: booking
        }
      });
      console.log(from, booking);
    }
}

  navigateToBookingPayment(booking: ActiveBooking) {
    const bookingData = {
      booking_id: booking.id,
      facilityName:booking.facilityName,
      eventDate:booking.eventDate,
      bookingTime: `${booking.startTime} - ${booking.endTime}`,
      startTime:booking.startTime,
      endTime:booking.endTime,
      bookingFee:booking.amount_total,
      deposit: booking.amount_deposit,
      bookedBy:booking.bookedBy,
      status:booking.statusBooked,
      from: 'Active'
    }
    // console.log(bookingData);
          
    this.router.navigate(['/facility-process-to-payment'], {
      state: {
        type: 'BookingState',
        eventDate: bookingData.eventDate,
        bookingTime: bookingData.bookingTime,
        facilityName: bookingData.facilityName,
        startTimeString: bookingData.startTime,
        endTimeString: bookingData.endTime,
        bookingFee: bookingData.bookingFee,
        deposit: bookingData.deposit,
        booking_id: bookingData.booking_id
      }
    })
  }

  loadFacilities() {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/facilities').subscribe((response: any) => {
      this.facilities = response.result || [];
      if (this.facilities) {
        this.isLoading = false;
      }
    })
  }

  navigateToFacilityPlaceBooking(facilityId: number) {
    // Navigasi dengan parameter
    this.router.navigate(['/place-facility-booking'], {
      queryParams: { facilityId: facilityId }
    });
  }

  getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  formatTime(datetime: string): string {
    if (!datetime) return '';
    
    // Misalkan format datetime adalah 'YYYY-MM-DD HH:mm:ss'
    const timePart = datetime.split(' ')[1];
    
    // Potong detik jika perlu
    return timePart ? timePart.substring(0, 5) : '';
  }

  loadHistoryBookings() {
    this.mainApi.endpointMainProcess({}, 'get/booking_history').subscribe((response: any) => {
      if (response.result && response.result.booking && Array.isArray(response.result.booking)) {
        // Simpan daftar booking asli
        this.originalBookingList = response.result.booking.map((booking: any) => ({
          facilityName: booking.facility || 'Unknown Facility',
          eventDate: this.functionMain.formatDateFacility(booking.event_date || booking.start_datetime.split(' ')[0]),
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
        this.filteredBookingList = [...this.originalBookingList];
        this.isLoading = false;
        // console.log(response.result, this.isLoading);
        
      } else {
        this.originalBookingList = [];
        this.filteredBookingList = [];
      }
    })
  }

  onChangeStartDate(value: any) {
    const date = new Date(value);
    this.startDateFilter = this.functionMain.formatDate(date);
    this.applyFilters();
  }

  onChangeEndDate(value: any) {
    const date = new Date(value);
    this.endDateFilter = this.functionMain.formatDate(date);
    this.applyFilters();
  }

  applyFilters() {
    console.log(this.startDateFilter, this.endDateFilter);
    
    this.filteredBookingList = this.originalBookingList.filter(item => {
      const [ dayEvent, monthEvent, yearEvent ] = item.eventDate.split('/');
      const defValueEvent = `${yearEvent}-${monthEvent}-${dayEvent}`
      const eventDate = new Date(defValueEvent);
      eventDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for date comparison
      
      const [ dayStart, monthStart, yearStart ] = this.startDateFilter.split('/');
      const setDefaultValueDateStart = `${yearStart}-${monthStart}-${dayStart}`
      const [ dayEnd, monthEnd, yearEnd ] = this.endDateFilter.split('/');
      const setDefaultValueDateEnd = `${yearEnd}-${monthEnd}-${dayEnd}`
      
      // Convert the selected start and end dates to Date objects
      const selectedStartDate = this.startDateFilter ? new Date(setDefaultValueDateStart) : null;
      const selectedEndDate = this.endDateFilter ? new Date(setDefaultValueDateEnd) : null;
  
      // Set time to 00:00:00 for comparison
      if (selectedStartDate) {
        selectedStartDate.setHours(0, 0, 0, 0);
      }
      if (selectedEndDate) {
        selectedEndDate.setHours(0, 0, 0, 0);
      }
      const dateMatches = (!selectedStartDate || eventDate >= selectedStartDate) && (!selectedEndDate || eventDate <= selectedEndDate);
  
      return dateMatches;
    });
  }

}