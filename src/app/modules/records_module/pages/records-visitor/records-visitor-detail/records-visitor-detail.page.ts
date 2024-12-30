import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-records-visitor-detail',
  templateUrl: './records-visitor-detail.page.html',
  styleUrls: ['./records-visitor-detail.page.scss'],
})
export class RecordsVisitorDetailPage implements OnInit {

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
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
    })
  }

  params: any
  pageType = 'visitor'

}
