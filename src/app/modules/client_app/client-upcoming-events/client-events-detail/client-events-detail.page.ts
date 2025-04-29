import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-events-detail',
  templateUrl: './client-events-detail.page.html',
  styleUrls: ['./client-events-detail.page.scss'],
})
export class ClientEventsDetailPage implements OnInit {

  bookingData: any = [];

  constructor(private router: Router, private alertController: AlertController, public functionMain: FunctionMainService) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      this.project_config = value.config
    })
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.bookingData = navigation.extras.state['bookingData'];
      console.log(this.bookingData)
    }
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  project_config: any = []

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
    
    const timePart = datetime.split(' ')[1];
    return timePart ? timePart.substring(0, 5) : '';
  }

  getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  backToHistoryList() {
    this.bookingData = null;
    this.router.navigate(['/client-upcoming-events']);
  }

  proceedToEmail() {
    console.log('Sending email for booking:', this.bookingData);
  }

  calculateTotal() {
    if(this.bookingData){
      return (this.bookingData.bookingFee ? this.bookingData.bookingFee : 0) + (this.bookingData.deposit ? this.bookingData.deposit : 0);
    }else{
      return 0
    }
  }

  getBookingTime(record: any) {
    console.log(record)
    let start_date = this.functionMain.convertDateExtend(record.start_date)
    let stop_date = this.functionMain.convertDateExtend(record.end_date)
    const startDate = start_date.split(' ')[0]; 
    return `${startDate} (${start_date.split(' ')[1]} - ${stop_date.split(' ')[1]})` 
  }

}
