import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-records-blacklist-detail',
  templateUrl: './records-blacklist-detail.page.html',
  styleUrls: ['./records-blacklist-detail.page.scss'],
})
export class RecordsBlacklistDetailPage implements OnInit {

  record: any = {};
  issue_time = ''

  constructor(private router: Router, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any[]};
    if (state) {
      this.record = state.record
    } 
   }

  ngOnInit() {
  }

  params: any
  pageType = 'wheel_clamp'

}
