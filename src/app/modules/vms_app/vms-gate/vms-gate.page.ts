import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-vms-gate',
  templateUrl: './vms-gate.page.html',
  styleUrls: ['./vms-gate.page.scss'],
})
export class VmsGatePage implements OnInit {

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
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
      this.Camera = value.config.lpr.map((item: any) => {
        return {
          'id': item.CamSentId,
          'name': item.CamID
        }
      })
    })
  }

  Camera: any = []
  project_config: any = []
  project_id: any = ''

  selectedCamera: any = ''

  openGate(is_close: boolean = false) {
    console.log(this.selectedCamera)
    if (!this.selectedCamera) {
      this.functionMain.presentToast('Please select the gate first!', 'danger')
      return
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

  onCameraChange(event: any) {
    this.selectedCamera = event[0]
  }

}
