import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-upcoming-event',
  templateUrl: './history-upcoming-event.page.html',
  styleUrls: ['./history-upcoming-event.page.scss'],
})
export class HistoryUpcomingEventPage implements OnInit {

  constructor(private router:Router,) { }

  toggleDirecttoActiveEvent() {
    // Logic to toggle to active events
    this.router.navigate(['resident-upcoming-event']);
  }

  toggleDirecttoHis() {
    // Logic to toggle to history
    this.router.navigate(['history-upcoming-event']);
  }

  ngOnInit() {
  }

}
