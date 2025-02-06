import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-records-blacklist-detail',
  templateUrl: './records-blacklist-detail.page.html',
  styleUrls: ['./records-blacklist-detail.page.scss'],
})
export class RecordsBlacklistDetailPage implements OnInit {

  record: any = {};
  issue_time = ''

  constructor(private router: Router, private route: ActivatedRoute, public functionMain: FunctionMainService) {
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
