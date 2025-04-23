import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-unregistered-resident-car',
  templateUrl: './unregistered-resident-car.page.html',
  styleUrls: ['./unregistered-resident-car.page.scss'],
})
export class UnregisteredResidentCarPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService,
    private toastController: ToastController,
    private mainVmsService: MainVmsService,
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
      this.Camera = value.config.lpr
    })
  }

  Camera: any = []
  project_config: any = []
  formData = {
    name: '',
    contact_number: '',
    vehicle_number: '',
    block_id: '',
    unit_id: '',
    reason: '',
    project_id: 0
  }

  submitLoading = false
  onSubmit(isOpenBarrier: boolean = false, camera_id: string = '') {
    let errMsg = ''
    if (!this.formData.name) {
      errMsg += 'Name is missing! \n'
    }
    if (!this.formData.contact_number) {
      errMsg += 'Contact number is missing! \n'
    }
    if (this.formData.contact_number) {
      if (this.formData.contact_number.length <= 2 ) {
        errMsg += 'Contact number is missing! \n'
      }
    }
    if (!this.formData.vehicle_number) {
      errMsg += 'Vehicle number is missing! \n'
    }
    if ((!this.formData.block_id || !this.formData.unit_id) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if ((!this.selectedHost) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected! \n'
    }
    if (!this.formData.reason) {
      errMsg += 'Reason must be filled! \n'
    }
    if (errMsg) {
      this.presentToast(errMsg, 'danger');
    } else {
      if (isOpenBarrier){
        console.log("OPEN BARRIER");
      } else {
        console.log("BARRIER NOT OPENED");
      }
      let params = {...this.formData, camera_id: camera_id, host: this.selectedHost}
      console.log(params)
      this.submitLoading = true
      this.mainVmsService.getApi(params, '/vms/post/unregistered_resident_car').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.presentToast('Unregistered car successfully submitted!', 'success');
            this.router.navigate(['/home-vms'])
          } else {
            this.presentToast('An error occurred while submitting unregistered car!', 'danger');
          }
          this.submitLoading = false
        },
        error: (error) => {
          this.presentToast('An error occurred while submitting unregistered car!', 'danger');
          console.error(error);
          this.submitLoading = false
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
        this.presentToast('Error loading vehicle data', 'danger');
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
        this.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
        this.isLoadingUnit = false
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  refreshVehicle() {
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    // this.formData.vehicle_number = randomVhc
    // console.log("Vehicle Refresh", randomVhc)
    this.functionMain.getLprConfig(this.formData.project_id).then((value) => {
      console.log(value)
      this.formData.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
    })
  }

  contactUnit = ''
  getContactInfo(contactData: any){
    this.contactUnit = ''
    this.contactHost = ''
    if (contactData) {
      this.formData.name = contactData.visitor_name ? contactData.visitor_name  : ''
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
    this.mainVmsService.getApi({ project_id: this.formData.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
  }

}
