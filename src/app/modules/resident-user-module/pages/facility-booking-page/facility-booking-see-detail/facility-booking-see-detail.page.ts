import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyVehicleDetailService } from 'src/app/service/resident/my-vehicle/my-vehicle-detail/my-vehicle-detail.service';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

interface BookingData {
  bookingId: number;
  facilityName: string;
  eventDate: string;
  eventDay: string;
  bookingTime: string;
  bookingFee: number;
  bookingTax: number;
  deposit: number;
  bookedBy: string;
  status: string;
  from: string;
  amountDeposit: number;
  reasonForRejection: string;
}

@Component({
  selector: 'app-facility-booking-see-detail',
  templateUrl: './facility-booking-see-detail.page.html',
  styleUrls: ['./facility-booking-see-detail.page.scss'],
})
export class FacilityBookingSeeDetailPage implements OnInit {

  bookingData: BookingData | null = null;

  bookingId: number = 0;

  constructor(private router: Router, private alertController: AlertController, private mainApi: MainApiResidentService, private functionMain: FunctionMainService) {
    this.onChangeTypeOfUser = this.onChangeTypeOfUser.bind(this);
    this.onChangeUserType = this.onChangeUserType.bind(this);
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bookingData: any};
    if (state) {
      // if (state.bookingData.)
      this.bookingData = state.bookingData;
      console.log('Booking Data:', this.bookingData);
      this.bookingId = state.bookingData.booking_id ? state.bookingData.booking_id : state.bookingData.id;
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

  typeOfUser: string = ''
  onChangeTypeOfUser(event: any) {
    this.typeOfUser = event;
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
    this.router.navigate(['/facility-booking-main'], {
      queryParams :  {
        reload: true
      }
    });
    // if (this.bookingData?.from) {
    //   this.router.navigate(['/facility-booking-main'], {
    //     queryParams :  {
    //       reload: false
    //     }
    //   });
    // }
  }

  proceedToEmail() {
    // Logika untuk mengirim email
    console.log('Sending email for booking:', this.bookingId);
    this.mainApi.endpointMainProcess({
      booking_id: this.bookingId,
    }, 'post/facility_send_email').subscribe((response: any) => {
      console.log(response);
      this.functionMain.presentToast("Receipt has been sent to your email.", "success")
    })
  }

  navigateToProcessPayment(bookingData: any) {
    this.router.navigate(['/facility-process-to-payment'], {
      state: {
        bookingId: bookingData.booking_id,
        type: "FromHistoryForm",
        facilityName: bookingData.facilityName,
        eventDate: bookingData.eventDate,
        bookingTime: bookingData.bookingTime,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        bookingFee: bookingData.bookingFee,
        bookingTax: bookingData.bookingTax,
        deposit: bookingData.deposit,
        bookedBy: bookingData.bookedBy,
        status: bookingData.status,
        from: 'Active',
        amountDeposit: bookingData.amountDeposit
      }
    })
  }

  calculateTotal(): number {
    if(this.bookingData){
      const amountTotal = this.bookingData.bookingFee ? this.bookingData.bookingFee : 0;
      const amountDeposit = this.bookingData.amountDeposit ? this.bookingData.amountDeposit : this.bookingData.deposit ? this.bookingData.deposit : 0;
      return amountTotal + amountDeposit;
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

  userType = 'industrial'
  onChangeUserType(event: any) {
    this.userType = event;
  }
}
