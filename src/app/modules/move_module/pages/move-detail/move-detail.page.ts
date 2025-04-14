import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoveHomePage } from '../move-home/move-home.page';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-move-detail',
  templateUrl: './move-detail.page.html',
  styleUrls: ['./move-detail.page.scss'],
})
export class MoveDetailPage implements OnInit {

  constructor(private router: Router, private moveHome: MoveHomePage, private route: ActivatedRoute, public functionMain: FunctionMainService, private webrtc: WebRtcService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any};
    if (state) {
      this.record = state.record
      console.log(this.record.schedule_date)
      console.log(this.record)
      // this.exit_date = temp_schedule.setHours(temp_schedule.getHours() + 1);
    } 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.loadProjectName()
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_name = value.project_name.toUpperCase()
      this.project_config = value.config
    })
  }
  project_name = ''
  project_config: any = []

  pageType = 'move_in'
  record: any

  id = 0
  contractor_name ='JACK';
  company_name = 'JACK CORP';
  vehicle_number = 'SBS 8128 X'
  contact_no = '+65 8192 022'
  contractor_pass_no = '+65 8192 022'
  entry_date = ''
  exit_date = ''
  accompanied_by = '5'
  applied_by = ''
  resident_contact_no = '+65 8192 022'

  onAccompanyDetail() {
    this.main = !this.main
  }

  callResident(){
    this.webrtc.createOffer(this.record);
  }

  main = true
}
