import { Component, OnInit } from '@angular/core';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-ma-visitor-form',
  templateUrl: './ma-visitor-form.page.html',
  styleUrls: ['./ma-visitor-form.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class MaVisitorFormPage implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService, private mainVmsService: MainVmsService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { schedule: any};
    if (state) {
      this.record = state.schedule
      if (this.record.vehicle_number != '') {
        this.selection_type = 'drive_in'
      }
      console.log(this.record);
    } 
   }

  faUsers = faUsers
  record: any
  project_config: any

  ngOnInit() {
    this.getProjectConfig()
  }

  getProjectConfig() {
    this.project_config = this.functionMain.getProjectConfig()
  }

  onBackMove() {
    this.router.navigate(['move-home'], {
      queryParams: {type: 'ma_visitor'}
    });
  }

  is_guarded = false

  selection_type = ''
  onSubmitRecord(is_open: boolean) {
    console.log(is_open)
  }

}
