import { Component, OnInit } from '@angular/core';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

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

  constructor(private router: Router, public functionMain: FunctionMainService, private clientMainService: ClientMainService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { schedule: any};
    if (state) {
      this.record = state.schedule
      if (this.record.vehicle_number != '') {
        this.selection_type = 'drive_in'
      }
      this.loadGetProjectConfig()
    } 
   }

  faUsers = faUsers
  record: any
  project_config: any = []
  showForm = true

  ngOnInit() {
    
  }

  async loadGetProjectConfig() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
      this.Camera = value.config.lpr
      console.log(this.project_config);
    })
  }

  project_id = 0
  Camera: any = []

  onBackMove() {
    this.router.navigate(['move-home'], {
      queryParams: {type: 'ma_visitor'}
    });
  }

  is_guarded = false

  selection_type = ''
  onSubmitRecord(is_open: boolean = false, camera_id: string = '') {
    let errMsg = ''
    if (!this.record.name) {
      errMsg += 'Visitor name is required!\n';
    }
    if (!this.record.contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (this.record.contact_no) {
      if (this.record.contact_no.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (!this.record.vehicle_number && this.record.selection_type == 'drive_in') {
      errMsg += 'Vehicle number is required!\n';
    }
    let params = {...this.record, camera_id: camera_id}
    console.log(params)
    this.clientMainService.getApi(params, '/client/post/update_ma_visitor').subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.status_code === 200) {
          this.functionMain.presentToast('Successfully update this visitor' + (is_open ? ' and open the barrier!' : '!'), 'success');
          this.onBackMove()
        } else if (results.result.status_code === 205) {
          if (is_open) {
            this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
          } else {
            this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
          }
          this.router.navigate(['/home-vms'])
        } else if (results.result.status_code === 405) {
          this.functionMain.presentToast('An error occurred while trying to create offence for this alerted visitor!', 'danger');
          this.router.navigate(['/home-vms'])
        } else {
          this.functionMain.presentToast('An error occurred while updating visitor data!', 'danger');
        }

        // this.isLoading = false;
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while updating visitor data!', 'danger');
        console.error(error);
        // this.isLoading = false;
      }
    });
  }

  refreshVehicle() {
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    // this.record.vehicle_number = randomVhc
    // console.log("Vehicle Refresh", randomVhc)
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.record.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
    })
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }
  
}
