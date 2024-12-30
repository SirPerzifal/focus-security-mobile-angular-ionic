import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-records-wheel-clamped-payment',
  templateUrl: './records-wheel-clamped-payment.page.html',
  styleUrls: ['./records-wheel-clamped-payment.page.scss'],
})
export class RecordsWheelClampedPaymentPage implements OnInit {

  vehicle: any = {}

  constructor(private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any};
    if (state) {
      this.vehicle = state.vehicle
      this.qr_code = `data:image/png;base64,${state.vehicle.payment_qr_code}`
    } 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
    })
  }

  params: any
  pageType = 'wheel_clamp'


  qr_code = ''

  vehicle_number='';
  offence_no = ''
  charges = 'S$120.00'
  gst = 'S$9.60'
  total = 'S$129.60'

}
