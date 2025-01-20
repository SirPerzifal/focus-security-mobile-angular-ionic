import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-records-residents-detail',
  templateUrl: './records-residents-detail.page.html',
  styleUrls: ['./records-residents-detail.page.scss'],
})
export class RecordsResidentsDetailPage implements OnInit {

  record: any = {};

  constructor(private router: Router, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { logs: any[]};
    if (state) {
      this.record = state.logs
      console.log(this.record)
    } 
   }

  ngOnInit() {
  }

}
