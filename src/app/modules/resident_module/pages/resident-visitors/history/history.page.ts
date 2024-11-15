import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor(private router: Router) {}

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    // this.router.navigate(['history']);
  }

  ngOnInit() {
  }

}
