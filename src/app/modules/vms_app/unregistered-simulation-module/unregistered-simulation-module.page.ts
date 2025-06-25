import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

@Component({
  selector: 'app-unregistered-simulation-module',
  templateUrl: './unregistered-simulation-module.page.html',
  styleUrls: ['./unregistered-simulation-module.page.scss'],
})
export class UnregisteredSimulationModulePage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService,
    private clientMainService: ClientMainService,
    private router: Router,
    private functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    this.loadProjectName().then(() => {
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
      this.refreshVehicle()
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.formData.project_id = value.project_id
      this.project_config = value.config
      console.log(this.project_config)
      this.Camera = value.config.lpr
    })
  }

  Camera: any = []
  project_config: any = []
  formData = {
    vehicle_number: '',
    block_id: '',
    unit_id: '',
    project_id: 0,
  }

  onSubmit(isOpenBarrier: boolean = false, camera_id: string = '') {
    let errMsg = ''
    if (!this.formData.vehicle_number) {
      errMsg += 'Vehicle number is missing! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger');
    } else {
      if (isOpenBarrier){
        console.log("OPEN BARRIER");
      } else {
        console.log("BARRIER NOT OPENED");
      }
      let params = {...this.formData, camera_id: camera_id, host: this.selectedHost}
      console.log(params)
      this.clientMainService.getApi(params, '/vms/post/unregistered_vehicle_simulation').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.functionMain.presentToast('Unregistered vehicle successfully submitted!', 'success');
            this.router.navigate(['/home-vms'])
          } else {
            this.functionMain.presentToast('An error occurred while submitting unregistered vehicle!', 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while submitting unregistered vehicle!', 'danger');
          console.error(error);
        }
      });
    }
  }

  block = ''
  unit = ''

  Block: any
  Unit: any
  Coach: any

  onBlockChange(event: any) {
    this.formData.block_id = event.target.value;
    this.formData.unit_id = ''
    console.log(this.formData.block_id)
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.formData.unit_id = event[0]
  }

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading vehicle data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  isLoadingUnit = false
  async loadUnit() {
    this.formData.unit_id = ''
    this.isLoadingUnit = true
    this.blockUnitService.getUnit(this.formData.block_id).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}))
          this.isLoadingUnit = false
        } else {
          console.error('Error:', response.result);
          this.isLoadingUnit = false
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
        this.isLoadingUnit = false
      }
    });
  }

  refreshVehicle(is_click: boolean = false) {
    this.functionMain.getLprConfig(this.formData.project_id).then((value) => {
      console.log(value)
      if (value) {
        this.formData.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
        if (!is_click) {
          this.contactUnit = ''
          this.contactHost = ''
          if (this.project_config.is_industrial) {
            this.contactHost = value.industrial_host_id ? value.industrial_host_id : ''
          } else {
            if (value.block_id) {
              this.formData.block_id = value.block_id
              this.loadUnit().then(() => {
                setTimeout(() => {
                  this.contactUnit = value.unit_id
                }, 300)
              })
            }
          }
        }
      }
    })
  }

  contactUnit = ''
  getContactInfo(contactData: any){
    this.contactUnit = ''
    this.contactHost = ''
    if (contactData) {
      this.formData.vehicle_number = contactData.vehicle_number ? contactData.vehicle_number  : ''
      if (this.project_config.is_industrial) {
        this.contactHost = contactData.industrial_host_id ? contactData.industrial_host_id : ''
      } else {
        if (contactData.block_id) {
          this.formData.block_id = contactData.block_id
          this.loadUnit().then(() => {
            setTimeout(() => {
              this.contactUnit = contactData.unit_id
            }, 300)
          })
        }
      }
    }
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  loadHost() {
    this.clientMainService.getApi({ project_id: this.formData.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
  }

  handleRefresh(event: any) {
    if (this.project_config.is_industrial) {
      this.loadHost()
    } else {
      this.loadBlock()
    }
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

}
