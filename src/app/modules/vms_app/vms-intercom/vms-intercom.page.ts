import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-vms-intercom',
  templateUrl: './vms-intercom.page.html',
  styleUrls: ['./vms-intercom.page.scss'],
})
export class VmsIntercomPage implements OnInit {

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
    private webRtc: WebRtcService,
  ) { }

  ngOnInit() {
    this.loadProjectName().then(() => { })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBack() {
    this.router.navigate(['/alert-main'], { queryParams: { unregistered: true } })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
      console.log(this.project_config)
      this.Intercom = value.config.intercom.map((item: any) => {
        return {
          'id': item.id,
          'name': item.name
        }
      })
    })
  }

  Intercom: any = []
  project_config: any = []
  project_id: any = ''

  selectedIntercom: any = ''

  openGate(is_close: boolean = false) {
    if (this.selectedIntercom) {
      console.log(this.selectedIntercom)
      if (!is_close) {
        this.webRtc.openGate('Intercom-' + String(this.selectedIntercom))
      } else {
        this.webRtc.closeGate('Intercom-' + String(this.selectedIntercom))
      }
    } else {
      this.functionMain.presentToast('Select intercom first!', 'danger')
      return
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

  onCameraChange(event: any) {
    this.selectedIntercom = event[0]
  }

}
