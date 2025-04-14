import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-records-residents-detail',
  templateUrl: './records-residents-detail.page.html',
  styleUrls: ['./records-residents-detail.page.scss'],
})
export class RecordsResidentsDetailPage implements OnInit {

  record: any = {};

  constructor(private router: Router, private route: ActivatedRoute, public functionMain: FunctionMainService, private webRtcService: WebRtcService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { logs: any[]};
    if (state) {
      this.record = state.logs
      console.log(this.record)
    } 
   }

  callResident(){
    // console.log("record here =========", this.record);
    let recordCopy = this.record;
    recordCopy.requestor_contact_number = this.record.contact;
    this.webRtcService.createOffer(recordCopy);
  }

  project_config: any = []

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      this.project_config = value.config
    })
  }

}
