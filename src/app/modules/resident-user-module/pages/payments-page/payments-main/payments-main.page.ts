import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments-main',
  templateUrl: './payments-main.page.html',
  styleUrls: ['./payments-main.page.scss'],
})
export class PaymentsMainPage implements OnInit {

  longButtondata: any[] = [
    {
      id: 1,
      name: 'My Bills & Fees',
      src: 'assets/icon/resident-icon/payment-bills.png',
      routeLinkTo: '/bills-and-fines-page',
    },
    {
      id: 2,
      name: 'My Deposit',
      src: 'assets/icon/resident-icon/payment-manage.png',
      routeLinkTo: '/deposits-page',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
