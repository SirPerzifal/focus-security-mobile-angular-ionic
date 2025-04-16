import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-in-contractor',
  templateUrl: './history-in-contractor.page.html',
  styleUrls: ['./history-in-contractor.page.scss'],
})
export class HistoryInContractorPage implements OnInit {

  navButtonsMain: any[] = [
    {
      text: 'Daily Invite',
      active: false,
      action: 'route',
      routeTo: '/contractor-commercial-main'
    },
    {
      text: 'History',
      active: true,
      action: 'route',
      routeTo: '/history-in-contractor'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
