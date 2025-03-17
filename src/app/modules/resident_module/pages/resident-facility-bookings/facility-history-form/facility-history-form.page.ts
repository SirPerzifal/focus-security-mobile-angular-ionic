import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyVehicleDetailService } from 'src/app/service/resident/my-vehicle/my-vehicle-detail/my-vehicle-detail.service';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

interface BookingData {
  facilityName: string;
  eventDate: string;
  eventDay: string;
  bookingTime: string;
  bookingFee: number;
  deposit: number;
  bookedBy: string;
  status: string;
  from: string;
}

@Component({
  selector: 'app-facility-history-form',
  templateUrl: './facility-history-form.page.html',
  styleUrls: ['./facility-history-form.page.scss'],
})
export class FacilityHistoryFormPage implements OnInit, OnDestroy {

  bookingData: BookingData | null = null;

  constructor(private router: Router, private alertController: AlertController,) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bookingData: any};
    if (state) {
      this.bookingData = state.bookingData;
      // console.log(this.bookingData)
    } 
  }

  ngOnInit() {
    // Ambil data yang dikirim dari halaman sebelumnya
    // // console.log('ngOnInitngOnInitngOnInitngOnInitngOnInit');
    
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation?.extras.state) {
    //   this.bookingData = navigation.extras.state['bookingData'] as BookingData;
    //   // console.log(this.bookingData)
    // }

    // // Jika tidak ada data, kembalikan ke halaman sebelumnya
    // if (!this.bookingData) {
    //   this.router.navigate(['/facility-history']);
    // }
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

  backToHistoryList() {
    this.router.navigate(['/facility-history']);
    if (this.bookingData?.from) {
      this.router.navigate(['/resident-facility-bookings']);
    }
  }

  proceedToEmail() {
    // Logika untuk mengirim email
    // console.log('Sending email for booking:', this.bookingData);
  }

  calculateTotal(): number {
    if(this.bookingData){
      return this.bookingData.bookingFee + this.bookingData.deposit;
    }else{
      return 0
    }
  }

  // reformatDay(booking:any){
  //   return this.getDayName(new Date(booking.booking_date || booking.start_datetime))
  // }


  // reformatDate(booking:any){
  //   // console.log(booking);
  //   // console.log('bookingbookingbookingbooking');
    
  //   return this.formatDate(booking.event_date || booking.start_datetime.split(' ')[0])
  // }

  // reformatTime(booking:any){
  //   return `${this.formatTime(booking.start_datetime)} - ${this.formatTime(booking.stop_datetime)}`
  // }


  // Method untuk mendapatkan label status
  // getStatusLabel(): { text: string, color: string } {
  //   switch (this.bookingData?.status.toLowerCase()) {
  //     case 'approved':
  //       return { text: 'Approved', color: 'text-green-500' };
  //     case 'pending_approval':
  //       return { text: 'Pending Approval', color: 'text-blue-500' };
  //     case 'pending_payment':
  //       return { text: 'Pending Payment', color: 'text-blue-500' };
  //     default:
  //       return { text: 'Unknown', color: 'text-gray-500' };
  //   }
  // }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
