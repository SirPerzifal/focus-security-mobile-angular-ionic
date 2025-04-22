import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vms-checkout',
  templateUrl: './vms-checkout.page.html',
  styleUrls: ['./vms-checkout.page.scss'],
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
export class VmsCheckoutPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  isMain = true
  isSearch = false

  onBack() {
    if (!this.isMain) {
      this.isMain = true
    } else {
      this.router.navigate(['/home-vms'])
    }
  }

  checkoutForm = {
    identification_type: '',
    identification_number: '',
    contact_number: '',
    pass: '',
  }

  resetForm() {
    this.checkoutForm = {
      identification_type: '',
      identification_number: '',
      contact_number: '',
      pass: '',
    }
  }

  setFromScan(event: any) {
    console.log(event)
    this.checkoutForm.identification_number = event.data.identification_number
    this.checkoutForm.identification_type = event.type
    console.log(this.checkoutForm.identification_type, this.checkoutForm.identification_number)
  }

  selectedNric = ''

  searchData() {
    console.log(this.checkoutForm)
  }
}
