import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
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
    private clientMainService: ClientMainService,
  ) { }

  ngOnInit() {
    this.loadProjectName().then(() => {
      this.loadCamera()
    })
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
    })
  }

  Camera: any = []
  project_config: any = []
  project_id: any = ''

  selectedCamera: any = ''

  loadCamera() {
    this.clientMainService.getApi({}, '/vms/get/lpr_list').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.Camera = results.result.result.map((item: any) => {
            return {
              'id': item.CamSentId,
              'name': item.CamID,
              'can_freeze': !!item.CanFreeze
            }
          })
        } else {
          this.functionMain.presentToast('An error occurred while trying to get LPR list!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to get LPR list!', 'danger');
        console.error(error);
      }
    });
  }

  get canFreezeCurrentGate(): boolean {
    if (!this.selectedCamera) return false;
    const cam = this.Camera.find((item: any) => item.id == this.selectedCamera);
    return cam ? !!cam.can_freeze : false;
  }

  openGate(is_close: boolean = false, freeze: boolean = false) {
    console.log(this.selectedCamera)
    if (!this.selectedCamera) {
      this.functionMain.presentToast('Please select the gate first!', 'danger')
      return
    }
    if (freeze && !this.canFreezeCurrentGate) {
      this.functionMain.presentToast('Freezing is not allowed for this gate!', 'danger');
      return;
    }
    const actionName = is_close ? 'close' : (freeze ? 'freeze open' : 'open');
    this.clientMainService.getApi({camera_id: this.selectedCamera, is_close: is_close, freeze: freeze}, '/vms/post/open_barrier').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMain.presentToast(`Successfully to ${actionName} the barrier!`, 'success');
        } else {
          this.functionMain.presentToast(`Failed to ${actionName} the barrier!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast(`An error occurred while trying to ${actionName} the barrier!`, 'danger');
        console.error(error);
      }
    });
  }

  freezeGate() {
    this.openGate(false, true);
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
