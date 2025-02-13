import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FacilityBookingsService } from 'src/app/service/resident/facility-bookings/facility-bookings.service';

interface ActiveBooking {
  id: number;
  facilityName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  statusBooked: string;
}

// Tambahkan interface ini di bagian atas file TypeScript Anda
interface BookingResponse {
  id: number;
  facility_name: string;
  booking_date: string;
  start_datetime: string;
  stop_datettime: string;
  booked_by: string;
  booking_status: string;
}

@Component({
  selector: 'app-resident-facility-bookings',
  templateUrl: './resident-facility-bookings.page.html',
  styleUrls: ['./resident-facility-bookings.page.scss'],
})
export class ResidentFacilityBookingsPage implements OnInit {
  activeBookings: ActiveBooking[] = [];
  unit_id: number = 1;
  bookingId = '';
  
  constructor(
    private router:Router, 
    private alertController: AlertController,
    private toastController: ToastController,
    private facilityBookingsService: FacilityBookingsService
  ) { }
  
  
  ngOnInit() {
    this.loadActiveBookings();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/resident-facility-bookings'){
          this.activeBookings = []
          this.loadActiveBookings();
        }
         // Panggil fungsi lagi saat halaman dibuka
      }
    });
  }

  loadActiveBookings() {
    this.facilityBookingsService.getActiveFacilityBookingsServices(this.unit_id.toString())
      .subscribe({next: (response: any) => {
        if (response.result.response_code === 200) {
          // Map data dengan tipe yang jelas
          this.activeBookings = response.result.active_bookings.map((booking: BookingResponse) => ({
            id: booking.id,
            facilityName: booking.facility_name,
            eventDate: this.formatDate(booking.booking_date),
            startTime: this.formatTime(booking.start_datetime),
            endTime: this.formatTime(booking.stop_datettime),
            bookedBy: booking.booked_by,
            statusBooked: booking.booking_status,
          }));
          console.log('Mapped Active Bookings:', this.activeBookings);
          console.log('Mapped Active Bookings:', response);
        } else {
          this.presentToast('Failed to load booking data', 'danger');
          console.error('Error:', response);
        }
      },
      error: (error) => {
        this.presentToast('Error loading active booking data', 'danger');
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
  
  formatTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return dateTimeString;
    }
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
      case 'requested': return 'alert-circle-outline';
      case 'pending_approval':
      case 'pending_payment': return 'alert-circle-outline';
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

  // cancelBooking(bookingId: number) {
  //   // Implementasi logika pembatalan booking
  //   this.bookingService.cancelBooking(bookingId).subscribe({
  //     next: (response) => {
  //       // Refresh daftar booking atau hapus booking dari list
  //       this.loadActiveBookings();
  //     },
  //     error: (error) => {
  //       // Tangani error
  //       console.error('Gagal membatalkan booking', error);
  //     }
  //   });
  // }

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
            console.log('Booking cancellation cancelled');
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
    // Logika untuk membatalkan booking
    console.log('Booking cancelled');
    this.deleteBooking();
    // Reload the page
    // window.location.reload();
    // Contoh: Tampilkan toast atau navigasi
    // this.presentToast('Booking successfully cancelled');
    // this.router.navigate(['/booking-list']);
  }

  deleteBooking() {
    this.facilityBookingsService.deleteBooking(this.bookingId)
      .subscribe({next: (response: any) => {
        if (response.result.response_code === 200) {
          console.log('work')
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

  // Opsional: Tambahkan metode presentToast jika diperlukan
  // async presentToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000,
  //     position: 'bottom'
  //   });
  //   
  // toast.present(0)
  // }
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
    console.log(booking);
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
}
