import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-client-door-access',
  templateUrl: './client-door-access.page.html',
  styleUrls: ['./client-door-access.page.scss'],
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
export class ClientDoorAccessPage implements OnInit {

  constructor(
      private clientMainService: ClientMainService,
      public functionMain: FunctionMainService,
      private router: Router,
      private webRtc: WebRtcService,
    ) { }
  
  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.loadIntercom()
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  project_id = 0

  faArrow = faArrowRight

  Intercom: any = []
  intercomDetail: any = {}
  isLoading = false
  async loadIntercom() {
    this.Intercom = []
    this.isLoading = true
    this.clientMainService.getApi({project_id: this.project_id}, '/client/get/intercom_door_access').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          if (results.result.result.length > 0){
            this.Intercom = results.result.result
          }
        } else {
          this.functionMain.presentToast(`An error occurred while trying to fetch delivery data!`, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to fetch delivery data!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  textSecond = ''

  isMain = true
  isDetail = false

  onBack() {
    if (this.isMain) {
      this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
    } else {
      this.isDetail = false
      setTimeout(() => {
        this.isMain = true
      }, 300)
    }
  }

  
  viewDetail(delivery: any) {
    console.log(delivery)
    this.intercomDetail = delivery
    this.isMain = false
    setTimeout(() => {
      this.isDetail = true
      this.textSecond = ''
    }, 300)
  }

  openGate(intercom_id: any, is_open: boolean = true) {
    if (intercom_id) {
      console.log(intercom_id)
      if (is_open) {
        this.webRtc.openGate('Intercom-' + String(intercom_id))
      } else {
        this.webRtc.closeGate('Intercom-' + String(intercom_id))
      }
    } else {
      this.functionMain.presentToast('Select intercom first!', 'danger')
      return
    }
  }

  handleRefresh(event: any) {
    this.loadIntercom().then(() => event.target.complete())
  }

}
