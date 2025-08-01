import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-unregistered-resident-car',
  templateUrl: './unregistered-resident-car.page.html',
  styleUrls: ['./unregistered-resident-car.page.scss'],
})
export class UnregisteredResidentCarPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService,
    private toastController: ToastController,
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
    name: '',
    contact_number: '',
    vehicle_number: '',
    block_id: '',
    unit_id: '',
    reason: '',
    project_id: 0,
    identification_number: '',
    identification_type: '',
  }

  submitLoading = false
  onSubmit(isOpenBarrier: boolean = false, camera_id: string = '') {
    let errMsg = ''
    if (!this.formData.name && !this.project_config.is_industrial) {
      errMsg += 'Name is missing! \n'
    }
    if ((!this.selectedHost) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected! \n'
    }
    if (!this.formData.contact_number && !this.project_config.is_industrial) {
      errMsg += 'Contact number is missing! \n'
    }
    if (this.formData.contact_number && !this.project_config.is_industrial) {
      if (this.formData.contact_number.length <= 2 ) {
        errMsg += 'Contact number is missing! \n'
      }
    }
    if (!this.formData.vehicle_number) {
      errMsg += 'Vehicle number is missing! \n'
    }
    // if (this.project_config.is_industrial && !this.formData.identification_type) {
    //   errMsg += 'Identification type is required! \n'
    // }
    // if (this.project_config.is_industrial && !this.formData.identification_number) {
    //   errMsg += 'Identification number is required! \n'
    // }
    if ((!this.formData.block_id || !this.formData.unit_id) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected! \n'
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
      this.clientMainService.getApi(params, '/vms/post/unregistered_resident_car').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.presentToast('Unregistered car successfully submitted!', 'success');
            this.router.navigate(['/home-vms'])
          } else if (results.result.response_code === 205) {
            if (isOpenBarrier) {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
            } else {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
            }
            this.router.navigate(['/home-vms'])
          } else if (results.result.response_code === 405) {
            this.functionMain.presentToast(results.result.status_description, 'danger');
            this.router.navigate(['/home-vms'])
          } else if (results.result.response_code === 407) {
            this.functionMain.presentToast(results.result.status_description, 'danger');
          } else if (results.result.response_code === 206) {
            this.functionMain.banAlert(results.result.status_description, this.formData.unit_id, this.selectedHost)
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

  refreshVehicle(is_click: boolean = false) {
    this.functionMain.getLprConfig(this.formData.project_id).then((value) => {
      console.log(value)
      if (value) {
        this.formData.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
        if (!is_click) {
          // this.selectedNric = {type: value.identification_type ? value.identification_type : '', number: value.identification_number ? value.identification_number : '' }
          this.contactUnit = ''
          this.contactHost = ''
          if (this.project_config.is_industrial) {
            this.contactHost = value.industrial_host_id ? value.industrial_host_id : ''
          } else {
            this.formData.contact_number = value.contact_number ? value.contact_number : ''
            this.formData.name = value.visitor_name ? value.visitor_name  : ''
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
      this.formData.name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.formData.vehicle_number = contactData.vehicle_number ? contactData.vehicle_number  : ''
      if (this.project_config.is_industrial) {
        setTimeout(() => {
          this.contactHost = contactData.industrial_host_id ? contactData.industrial_host_id : ''
        }, 300)
        this.selectedNric = {type: contactData.identification_type ? contactData.identification_type : '', number: contactData.identification_number ? contactData.identification_number : '' }
        if (contactData.identification_type && contactData. identification_number) {
          this.is_id_disabled = true
        } else {
          this.is_id_disabled = false
        }
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

  is_id_disabled = false
  setFromScan(event: any) {
    console.log(event)
    this.formData.identification_number = event.data.identification_number
    this.formData.identification_type = event.type
    if (event.data.is_server) {
      if (this.project_config.is_industrial) {
        this.contactHost = event.data.industrial_host_id ? event.data.industrial_host_id : ''
      }
      this.is_id_disabled = true
      this.formData.name = event.data.contractor_name ? event.data.contractor_name : ''
      this.formData.contact_number = event.data.contact_number ? event.data.contact_number : ''
      this.formData.vehicle_number = event.data.vehicle_number ? event.data.vehicle_number : ''
    } 
    console.log(this.formData.identification_number, this.formData.identification_type)
  }
  selectedNric: any = ''

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
