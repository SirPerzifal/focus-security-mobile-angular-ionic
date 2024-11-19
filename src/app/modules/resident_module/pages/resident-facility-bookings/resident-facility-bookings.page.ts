import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface ActiveBooking {
  facilityName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
}

@Component({
  selector: 'app-resident-facility-bookings',
  templateUrl: './resident-facility-bookings.page.html',
  styleUrls: ['./resident-facility-bookings.page.scss'],
})
export class ResidentFacilityBookingsPage implements OnInit {
  activeBookings: ActiveBooking[] = [];

  constructor(private router:Router, private alertController: AlertController) { }

  ngOnInit() {
    this.loadActiveBookings();
  }

  loadActiveBookings() {
    // Simulasi pengambilan data booking aktif
    this.activeBookings = [
      {
        facilityName: 'Tennis Court 2',
        eventDate: '26/10/2024',
        startTime: '06:00pm',
        endTime: '07:00pm',
        bookedBy: 'Ashok'
      }
    ];
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

  cancelBooking() {
    this.presentCustomAlert(
      'Cancel Booking', 
      'No', 
      'Yes'
    );
  }

  public async presentCustomAlert(
    header: string = 'Cancel Booking', 
    cancelText: string = 'No', 
    confirmText: string = 'Yes'
  ) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: header,
      message: '', 
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
          }
        }
      ]
    });
  
    await alert.present();
  }

  confirmBookingCancellation() {
    // Logika untuk membatalkan booking
    console.log('Booking cancelled');
    
    // Contoh: Tampilkan toast atau navigasi
    // this.presentToast('Booking successfully cancelled');
    // this.router.navigate(['/booking-list']);
  }

  // Opsional: Tambahkan metode presentToast jika diperlukan
  // async presentToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000,
  //     position: 'bottom'
  //   });
  //   toast.present();
  // }
}
