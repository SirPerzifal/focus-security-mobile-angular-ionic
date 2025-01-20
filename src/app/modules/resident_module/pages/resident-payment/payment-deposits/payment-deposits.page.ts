import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-deposits',
  templateUrl: './payment-deposits.page.html',
  styleUrls: ['./payment-deposits.page.scss'],
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
export class PaymentDepositsPage implements OnInit {

  showMainContent = true;
  showDepositHistory = false;
  showMainContentTrans = false;
  showDepositHistoryTrans = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // Metode untuk menampilkan halaman deposit history
  showDepositHistoryPage() {
    if (!this.showDepositHistory) {
      this.showMainContentTrans = true;
      this.showMainContent = false;
      setTimeout(() => {
        this.showDepositHistory = true;
      }, 300);
    }
  }

  // Metode untuk kembali ke halaman utama deposits
  backToMainDeposits() {
    if (!this.showMainContent) {
      this.showDepositHistoryTrans = true;
      this.showDepositHistory = false;
      setTimeout(() => {
        this.showMainContent = true;
      }, 300);
    }
  }
}
