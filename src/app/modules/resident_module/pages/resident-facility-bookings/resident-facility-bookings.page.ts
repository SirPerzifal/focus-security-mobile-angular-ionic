import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';

import { ActiveBooking, BookingResponse } from 'src/models/resident/facility.model';
import { FacilityBookingsService } from 'src/app/service/resident/facility-bookings/facility-bookings.service';

@Component({
  selector: 'app-resident-facility-bookings',
  templateUrl: './resident-facility-bookings.page.html',
  styleUrls: ['./resident-facility-bookings.page.scss'],
})
export class ResidentFacilityBookingsPage implements OnInit {
  activeBookings: ActiveBooking[] = [];
  unit_id: number = 0;
  bookingId = '';
  isLoading: boolean = true;

  constructor(
    private router:Router, 
    private alertController: AlertController,
    private activeRoute: ActivatedRoute,
    private toastController: ToastController,
    private facilityBookingsService: FacilityBookingsService,
  ) { }
  
  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unit_id = Number(parseValue.unit_id);
        this.loadActiveBookings();
      }
    })

    this.activeRoute.queryParams.subscribe(params => {
      if (params['restart']) {
        Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
          if (value?.value) {
            const parseValue = JSON.parse(value.value);
            this.unit_id = Number(parseValue.unit_id);
            this.loadActiveBookings();
          }
        })
      }
    });
  }

  ionViewWillEnter() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unit_id = Number(parseValue.unit_id);
        this.loadActiveBookings();
      }
    })
  }

  loadActiveBookings() {
    this.facilityBookingsService.getActiveFacilityBookingsServices(this.unit_id.toString())
      .subscribe({next: (response: any) => {
        if (response.result.response_code === 200) {
          this.isLoading = false;
          // Map data dengan tipe yang jelas
          this.activeBookings = response.result.active_bookings.map((booking: BookingResponse) => ({
            id: booking.id,
            facilityName: booking.facility_name,
            eventDate: this.formatDate(booking.booking_date),
            startTime: this.formatTime(booking.start_datetime),
            endTime: this.formatTime(booking.stop_datettime),
            bookedBy: booking.booked_by,
            statusBooked: booking.booking_status,
            amount_untaxed: booking.amount_untaxed,
            amount_taxed: booking.amount_taxed,
            amount_total: booking.amount_total,
            amount_deposit: booking.amount_deposit,
          }));
        }
      },
      error: (error) => {
        // this.presentToast('Error loading active booking data', 'danger');
        console.error('Error:', error);
      }
    });
  }
  
  // Update format methods untuk menangani variasi format tanggal
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
  
  formatTime(datetime: string): string {
    if (!datetime) return '';
    
    // Misalkan format datetime adalah 'YYYY-MM-DD HH:mm:ss'
    const timePart = datetime.split(' ')[1];
    
    // Potong detik jika perlu
    return timePart ? timePart.substring(0, 5) : '';
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

  cancelBooking(bookingId: number) {
    this.bookingId = bookingId.toString(); // Set bookingId
    this.presentCustomAlert(
      'Cancel Booking', 
      'Cancel', 
      'Confirm'
    );
  }

  getBookingStatusIcon(status: string): string {
    switch(status) {
      case 'approved': return 'checkmark';
      case 'requested': return 'alert';
      case 'pending_approval':
      case 'pending_payment': return 'alert';
      case 'rejected':
      case 'cancel': return 'close-outline';
      default: return 'help-outline';
    }
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
    confirmText: string = 'Confirm'
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
            this.confirmBookingCancellation();
          },
        },
      ]
    });
  
    await alert.present();
  }

  confirmBookingCancellation() {
    this.deleteBooking();
  }

  deleteBooking() {
    this.facilityBookingsService.deleteBooking(this.bookingId)
      .subscribe({next: (response: any) => {
        if (response.result.response_code === 200) {
          // console.log('work')
          this.activeBookings = []
          this.loadActiveBookings();
        } else {
          this.presentToast('Failed to delete booking data', 'danger');
          console.error('Error:', response);
        }
      },
      error: (error) => {
        this.presentToast('Error deleting active booking data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      if (color === 'success') {
        pingSound.play().catch((err) => console.error('Error playing sound:', err));
      } else {
        errorSound.play().catch((err) => console.error('Error playing sound:', err));
      }
    });
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

  navigateToHistoryDetail(booking: ActiveBooking) {
    const bookingData = {
      booking_id: booking.id,
      facilityName:booking.facilityName,
      eventDate:booking.eventDate,
      bookingTime: `${booking.startTime} - ${booking.endTime}`,
      startTime:booking.startTime,
      endTime:booking.endTime,
      bookingFee:booking.amount_total,
      bookingTax:booking.amount_taxed,
      deposit: booking.amount_deposit,
      bookedBy:booking.bookedBy,
      status:booking.statusBooked,
      from: 'Active',
      amountDeposit: booking.amount_deposit
    }
    // Gunakan NavigationExtras untuk membawa data
    this.router.navigate(['/facility-history-form'], {
      state: {
        bookingData: bookingData
      }
    });
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
    
    this.router.navigate(['/facility-booking-payment'], {
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
}
