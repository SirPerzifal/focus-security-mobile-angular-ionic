import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facility-deposits',
  templateUrl: './facility-deposits.page.html',
  styleUrls: ['./facility-deposits.page.scss'],
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
export class FacilityDepositsPage implements OnInit {
  // Variabel untuk mengontrol tampilan
  showMainContent = true;
  showDepositHistory = false;
  showMainContentTrans = false;
  showDepositHistoryTrans = false;

  constructor(private router: Router) { }

  ngOnInit() {
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