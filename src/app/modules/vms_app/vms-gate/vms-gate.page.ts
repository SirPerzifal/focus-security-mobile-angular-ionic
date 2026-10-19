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
  gateBarrierMode: string = 'gate_only'

  selectedCamera: any = ''

  loadCamera() {
    this.clientMainService.getApi({}, '/vms/get/lpr_list').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.gateBarrierMode = results.result.gate_barrier_mode || 'gate_only'
          this.Camera = results.result.result.map((item: any) => {
            const controlTarget = item.ControlTarget || item.TargetType || 'gate'
            return {
              'id': item.SelectionId || `${item.CamSentId}:${controlTarget}`,
              'camera_id': item.CamSentId,
              'control_target': controlTarget,
              'name': item.CamID,
              'can_freeze': !!item.CanFreeze,
              'target_type': item.TargetType || controlTarget,
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

  get selectedControl(): any {
    if (!this.selectedCamera) return null;
    return this.Camera.find((item: any) => item.id == this.selectedCamera) || null;
  }

  get canFreezeCurrentGate(): boolean {
    const cam = this.selectedControl;
    return cam ? !!cam.can_freeze : false;
  }

  get isBarrierSelected(): boolean {
    const cam = this.selectedControl;
    return !!cam && (cam.control_target || cam.target_type) === 'barrier';
  }

  get openButtonLabel(): string {
    return this.isBarrierSelected ? 'OPEN BARRIER' : 'OPEN GATE';
  }

  get freezeButtonLabel(): string {
    return this.isBarrierSelected ? 'FREEZE BARRIER' : 'FREEZE GATE';
  }

  get closeButtonLabel(): string {
    return this.isBarrierSelected ? 'CLOSE BARRIER' : 'CLOSE GATE';
  }

  get chooseLabel(): string {
    if (this.Camera.length === 0) {
      return 'NO GATE FOUND';
    }
    return this.gateBarrierMode === 'both' ? 'CHOOSE GATE / BARRIER' : 'CHOOSE GATE';
  }

  openGate(is_close: boolean = false, freeze: boolean = false) {
    console.log(this.selectedCamera)
    const cam = this.selectedControl;
    if (!cam) {
      this.functionMain.presentToast('Please select the gate first!', 'danger')
      return
    }
    if (freeze && !this.canFreezeCurrentGate) {
      this.functionMain.presentToast('Freezing is not allowed for this gate!', 'danger');
      return;
    }
    const noun = this.isBarrierSelected ? 'barrier' : 'gate';
    const actionName = is_close ? 'close' : (freeze ? 'freeze open' : 'open');
    this.clientMainService.getApi({
      camera_id: cam.camera_id,
      is_close: is_close,
      freeze: freeze,
      control_target: cam.control_target || cam.target_type || '',
    }, '/vms/post/open_barrier').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMain.presentToast(`Successfully to ${actionName} the ${noun}!`, 'success');
        } else {
          this.functionMain.presentToast(results.result.error || `Failed to ${actionName} the ${noun}!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast(`An error occurred while trying to ${actionName} the ${noun}!`, 'danger');
        console.error(error);
      }
    });
  }

  freezeGate() {
    this.openGate(false, true);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadCamera()
      event.target.complete()
    }, 1000)
  }

  onCameraChange(event: any) {
    this.selectedCamera = event[0]
  }

}
