import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-records-visitor-detail',
  templateUrl: './records-visitor-detail.page.html',
  styleUrls: ['./records-visitor-detail.page.scss'],
})
export class RecordsVisitorDetailPage implements OnInit {

  record: any = {};
  issue_time = ''

  constructor(private router: Router, private route: ActivatedRoute, public functionMain: FunctionMainService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { logs: any[]};
    if (state) {
      this.record = state.logs
      console.log(this.record)
    } 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
    })
  }

  returnNone(params: string){
    return params ? params : '-'
  }

  params: any
  pageType = 'visitor'

}
