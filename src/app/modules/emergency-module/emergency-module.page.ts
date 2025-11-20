import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emergency-module',
  templateUrl: './emergency-module.page.html',
  styleUrls: ['./emergency-module.page.scss'],
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
export class EmergencyModulePage implements OnInit {

  constructor(
    private functionMain: FunctionMainService, 
    private blockUnitService: BlockUnitService, 
    private clientMainService: ClientMainService, 
    private router: Router,
  ) { }

  showAmbulance = false;
  showPolice = false;
  showSCDF = false;
  showOthers = false;
  showAmbulanceTrans = false;
  showPoliceTrans = false;
  showSCDFTrans = false;
  showOthersTrans = false;

  toggleShowSCDF() {
    if (!this.showPoliceTrans && !this.showAmbulanceTrans && !this.showOthersTrans){
      if (!this.showSCDF) {
        this.resetForm()
      }
      this.showSCDFTrans = true
      this.showPolice = false;
      this.showAmbulance = false;
      this.showOthers = false
      this.formData.vehicle_type = 'scdf'
      this.formData.officer_name = ''
      this.formData.govtAgency = ''
      setTimeout(()=>{
        this.showSCDF = true
        this.showSCDFTrans = false
      }, 300)
    }
  }

  toggleShowAmbulance() {
    if (!this.showSCDFTrans && !this.showPoliceTrans && !this.showOthersTrans){
      if (!this.showAmbulance) {
        this.resetForm()
      }
      this.showAmbulanceTrans = true
      this.showPolice = false;
      this.showSCDF = false;
      this.showOthers = false
      this.formData.vehicle_type = 'ambulance'
      this.formData.officer_name = ''
      this.formData.govtAgency = ''
      setTimeout(()=>{
        this.showAmbulance = true
        this.showAmbulanceTrans = false;
      }, 300)
    }
  }

  toggleShowPolice() {
    if (!this.showSCDFTrans && !this.showAmbulanceTrans && !this.showOthersTrans){
      if (!this.showPolice) {
        this.resetForm()
      }
      this.showPoliceTrans = true
      this.showAmbulance = false;
      this.showSCDF = false;
      this.showOthers = false
      this.formData.vehicle_type = 'police'
      this.formData.govtAgency = ''
      setTimeout(()=>{
        this.showPolice = true
        this.showPoliceTrans = false;
      }, 300)
    }
  }

  toggleShowOthers() {
    if (!this.showSCDFTrans && !this.showAmbulanceTrans && !this.showPoliceTrans){
      if (!this.showOthers) {
        this.resetForm()
      }
      this.showOthersTrans = true
      this.showPolice = false
      this.showAmbulance = false;
      this.showSCDF = false;
      this.formData.vehicle_type = 'other'
      setTimeout(()=>{
        this.showOthers = true
        this.showOthersTrans = false;
      }, 300)
    }
  }

  formData = {
    vehicle_number: '',
    block_id: '',
    unit_id: '',
    officer_name: '',
    station_devision: '',
    purpose: '',
    contact_number: '',
    govtAgency: '',
    vehicle_type: '',
    project_id: 0,
  }
  
  resetForm() {
    this.Unit = []
    this.formData = {
      vehicle_number: '',
      block_id: '',
      unit_id: '',
      officer_name: '',
      station_devision: '',
      purpose: '',
      contact_number: '',
      govtAgency: '',
      vehicle_type: '',
      project_id: this.project_id
    }
    this.contactUnit = ''
    this.contactHost = ''
    this.selectedHost = ''
    this.pass_number = ''
    this.refreshVehicle()
  }

  refreshVehicle(is_click: boolean = false) {
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      if (value) {
        this.formData.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
        if (!is_click) {
          // this.formData.contact_number = value.contact_number ? value.contact_number : ''
          this.formData.officer_name = value.visitor_name ? value.visitor_name  : ''
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

  module_field = 'emergency_vehicle'
  module_config: any = {}
  ngOnInit() {
    this.loadProjectName().then(() => {
      this.functionMain.getModuleField(this.project_id, this.module_field).then((result) => {
        console.log(result)
        this.module_config = result
      })
      if (this.project_config.is_industrial) {
        // this.loadHost()
      } else {
        this.loadBlock()
      }
      this.formData.project_id = this.project_id
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
      this.Camera = value.config.lpr
    })
  }

  project_id = 0
  project_config: any = []
  Camera: any = []

  contactUnit = ''
  getContactInfo(contactData: any){
    this.contactUnit = ''
    this.contactHost = ''
    if (contactData) {
      this.formData.officer_name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.formData.vehicle_number = contactData.vehicle_number ? contactData.vehicle_number  : ''
      if (this.project_config.is_industrial) {
        setTimeout(() => {
          this.contactHost = contactData.industrial_host_id ? contactData.industrial_host_id : ''
        }, 300)
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

  Block: any
  Unit: any

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

  onBlockChange(event: any) {
    this.formData.block_id = event.target.value;
    this.formData.unit_id = ''
    console.log(this.formData.block_id)
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.formData.unit_id = event[0]
  }

  async loadUnit() {
    this.formData.unit_id = ''
    this.blockUnitService.getUnit(this.formData.block_id).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}))
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }
  
  onSubmit(isOpenBarrier: boolean = false, camera_id: string = '', bypass_ban: boolean = false){
    let errMsg = ''
    console.log(this.formData)
    if ((!this.formData.officer_name && this.module_config.rank_name) && (this.showPolice)) {
      errMsg += "Rank and name is required! \n"
    }
    if ((!this.formData.officer_name && this.module_config.rank_name) && (this.showOthers)) {
      errMsg += "Name is required! \n"
    }
    // if (!this.formData.contact_number && (this.showOthers || this.showPolice)) {
    //   errMsg += "Contact number is required! \n"
    // }
    // if (this.formData.contact_number && (this.showOthers || this.showPolice)) {
    //   if (this.formData.contact_number.length <= 2) {
    //     errMsg += "Contact number is required! \n"
    //   }
    // }
    if ((!this.formData.station_devision && this.module_config.station_division) && (this.showPolice || this.showSCDF || this.showAmbulance)) {
      errMsg += "Station & division is required! \n"
    }
    if ((!this.formData.station_devision && this.module_config.govt_agency_name) && (this.showOthers)) {
      errMsg += "Govt agency name is required! \n"
    }
    if (!this.formData.vehicle_number && this.module_config.vehicle_number) {
      errMsg += "Vehicle number is required! \n"
    }
    if (((!this.formData.block_id && this.module_config.block) || (!this.formData.unit_id && this.module_config.unit)) && !this.project_config.is_industrial) {
      errMsg += "Block and unit is required! \n"
    }
    // if ((!this.selectedHost) && this.project_config.is_industrial) {
    //   errMsg += "Host is required! \n"
    // }
    if ((!this.pass_number && this.module_config.pass_number) && this.project_config.is_industrial && this.showOthers) {
      errMsg += 'Pass number is required! \n'
    }
    if (!this.formData.purpose && this.module_config.purpose) {
      errMsg += "Purpose is required! \n"
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    let params = { ...this.formData, camera_id: camera_id, host: this.selectedHost, pass_number: this.pass_number, bypass_ban: bypass_ban, };
    console.log(params)
    this.clientMainService.getApi(params, '/vms/post/emergency_vehicle').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          if (isOpenBarrier){
            this.functionMain.presentToast('Emergency vehicle data has been successfully saved, and the barrier is now open!', 'success');
            
          } else {
            this.functionMain.presentToast('Emergency vehicle data has been successfully saved!', 'success');
          }
          this.router.navigate(['/home-vms'])

        } else if (results.result.response_code === 205) {
          if (isOpenBarrier) {
            this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
          } else {
            this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
          }
          this.router.navigate(['home-vms'])
        } else if (results.result.response_code === 405) {
          this.functionMain.presentToast(results.result.status_description, 'danger');
          this.router.navigate(['home-vms'])
        } else if (results.result.response_code === 206) {
          this.functionMain.banAlert(results.result.status_description, this.formData.unit_id, this.selectedHost).then((value: any) => {
            if (value) {
              this.onSubmit(isOpenBarrier, camera_id, true)
            }
          })
        } else if (results.result.response_code === 407) {
            this.functionMain.presentToast(results.result.status_description, 'danger');
        } else {
          this.functionMain.presentToast('An error occurred while attempting to save emergecny vehicle data!', 'danger');
        }

      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while attempting to save emergecny vehicle data!', 'danger');
        console.error(error);
      }
    });
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  loadHost() {
    this.contactHost = ''
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
      if (this.selectedHost) {
        this.contactHost = this.selectedHost
      }
    })
  }

  // onHostChange(event: any) {
  //   this.selectedHost = event[0]
  // }

  pass_number = ''
  
  handleRefresh(event: any) {
    this.functionMain.getModuleField(this.project_id, this.module_field).then((result) => {
      console.log(result)
      this.module_config = result
    })
    if (this.project_config.is_industrial) {
      // this.loadHost()
    } else {
      this.loadBlock()
    }
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

}
