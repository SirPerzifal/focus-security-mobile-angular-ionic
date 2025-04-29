import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-facility-booking-detail',
  templateUrl: './client-facility-booking-detail.page.html',
  styleUrls: ['./client-facility-booking-detail.page.scss'],
})
export class ClientFacilityBookingDetailPage implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      this.project_config = value.config
    })
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { booking: any };
    if (state) {
      this.bookingData = state.booking
    } 
  }

  project_config: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBack() {
    this.router.navigate(['/client-facility'])
  }

  bookingData: any = []

  onSubmit() {
    console.log(this.bookingData)
  }

  calculateTotal(): number {
    return this.bookingData.bookingFee || 0 + this.bookingData.deposit || 0;
  }

}
