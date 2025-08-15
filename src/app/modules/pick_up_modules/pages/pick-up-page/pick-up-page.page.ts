import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { faBarcode, faL, faMotorcycle, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/vms/user/user.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-pick-up-page',
  templateUrl: './pick-up-page.page.html',
  styleUrls: ['./pick-up-page.page.scss'],
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
export class PickUpPagePage implements OnInit {

  constructor(
    private userApi: UserService,
    private router: Router,
    private blockUnitService: BlockUnitService,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
  ) { }

  module_field = 'pickup_dropoff'
  module_config: any = {}
  ngOnInit() {
    this.loadProjectId().then(() => {
      this.functionMain.getModuleField(this.project_id, this.module_field).then((result) => {
        console.log(result)
        this.module_config = result
      })
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
  }

  @ViewChild('vehicleNumberInput') vehicleNumberInput!: TextInputComponent;
  @ViewChild('locationInput') locationInput!: TextInputComponent;

  faTaxi = faTaxi
  faMotorcycle = faMotorcycle

  response: any;
  // data: Observable<any>

  async testAPI() {
    this.userApi.getMoveData().subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.error('Error:', error);
      }
    );
  
  }

  async loadProjectId() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
      this.Camera = value.config.lpr
      console.log(this.Camera)
    })
  }

  project_id = 0
  Camera: any = []
  project_config: any = []

  Block: any[] = [];

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  onBlockChange(event: any) {
    this.blkLocation = event.target.value;
    console.log(this.blkLocation)
  }
  
  showPick = false;
  showDrop = false
  showForm = false

  valPhv = false
  valCar = false
  valTaxi = false
  valBike = false

  selectedVehicleType = '';
  entryType = '';
  industrial_location = ''

  toggleShowPick() {
    if(this.showDrop){
      this.resetForm()
    }
    this.showForm = true;
    this.showDrop = false;
    this.showPick = true;
    this.entryType = 'pick_up';
    this.refreshVehicle()
  }

  resetForm() {
    this.selectedVehicleType = ''
    this.valPhv = false
    this.valCar = false
    this.valTaxi = false
    this.valBike = false
    this.vehicleNumber = ''
    this.blkLocation = ''
    this.selectedNric = ''
    this.pass_number = ''
    this.contactHost = ''
    this.industrial_location = ''
    this.is_id_disabled = false
  }

  toggleShowDrop() {
    if(this.showPick){
      this.resetForm()
    }
    this.showForm = true;
    this.showPick = false;
    this.showDrop = true;
    this.entryType = 'drop_off';
    this.refreshVehicle()
  }

  useVehicle(val: string) {
    this.valPhv = false
    this.valCar = false
    this.valTaxi = false
    this.valBike = false
    
    switch(val) {
      case 'phv':
        this.valPhv = true;
        this.selectedVehicleType = 'phv_vehicle';
        break;
      case 'car':
        this.valCar = true;
        this.selectedVehicleType = 'private_car';
        break;
      case 'bike':
        this.valBike = true;
        this.selectedVehicleType = 'motorbike';
        break;
      case 'taxi':
        this.valTaxi = true;
        this.selectedVehicleType = 'taxi';
        break;
    }
  }

  vehicleNumber: string = ''; // Tambahkan properti untuk menyimpan nomor kendaraan
  blkLocation: string = ''; // Tambahkan properti untuk menyimpan nomor kendaraan

  onVehicleBlkChange(value: string) {
    this.blkLocation = value;
    console.log('Vehicle Number:', this.blkLocation); // Untuk debugging
  }

  async saveRecord(openBarrier: boolean = false, cameraId: string = '', bypass_ban: boolean = false) {
    const vehicleNumber = this.vehicleNumber
    const location = this.blkLocation;
    let errMsg = ''
    if (!this.selectedVehicleType) {
      errMsg += 'Vehicle type must be selected! \n'
    }
    // if (this.project_config.is_industrial && !this.identificationType) {
    //   errMsg += 'Identification type is required! \n'
    // }
    // if (this.project_config.is_industrial && !this.nric_value) {
    //   errMsg += 'Identification number is required! \n'
    // }
    if (!vehicleNumber && this.module_config.vehicle_number) {
      errMsg += 'Vehicle number is required! \n'
      console.log(this.vehicleNumberInput.value)
    }
    if ((!location && this.module_config.location) && !this.project_config.is_industrial) {
      errMsg += 'Location is required! \n'
    }
    if ((!this.industrial_location && this.module_config.location) && this.project_config.is_industrial) {
      errMsg += 'Location is required! \n'
    }
    // if (!this.selectedHost && this.project_config.is_industrial) {
    //   errMsg += 'Host is required! \n'
    // }
    // if (!this.pass_number && this.project_config.is_industrial) {
    //   errMsg += 'Pass number is required! \n'
    // }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger');
      return
    }

    try {
      // Gunakan subscribe alih-alih toPromise()
      let params = {
        entry_type: this.entryType,
        vehicle_type: this.selectedVehicleType,
        vehicle_number: vehicleNumber,
        block: location,
        project_id: this.project_id,
        camera_id: cameraId ? cameraId : '',
        host: this.selectedHost,
        identification_type: this.identificationType,
        identification_number: this.nric_value,
        pass_number: this.pass_number,
        bypass_ban: bypass_ban,
      }
      this.clientMainService.getApi(params, '/vms/post/add_entry').subscribe({
        next: (response) => {
          console.log(response)
          if (response.result.status_code === 200) {
            if (openBarrier) {
              this.functionMain.presentToast('Data has been successfully saved, and the barrier is now open!', 'success');
            } else {
              this.functionMain.presentToast('Data has been successfully saved to the system!', 'success');
            }
            this.router.navigate(['home-vms'])
            
            // Reset form
            this.vehicleNumberInput.value = '';
            this.selectedVehicleType = '';
            this.resetVehicleSelection();
            
            
          } else if (response.result.status_code === 205) {
            if (openBarrier) {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
            } else {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
            }
            this.router.navigate(['home-vms'])
          } else if (response.result.status_code === 405) {
            this.functionMain.presentToast(response.result.status_description, 'danger');
            this.router.navigate(['home-vms'])
          } else if (response.result.status_code === 407) {
            this.functionMain.presentToast(response.result.status_description, 'danger');
          } else if (response.result.status_code === 206) {
            this.functionMain.banAlert(response.result.status_description, false, this.selectedHost).then((value: any) => {
              if (value) {
                this.saveRecord(openBarrier, cameraId, true)
              }
            })
          } else {
            this.functionMain.presentToast('An error occurred while attempting to save the data!', 'danger');
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  resetVehicleSelection() {
    this.valPhv = false;
    this.valCar = false;
    this.valTaxi = false;
    this.valBike = false;
  }
  
  vehicle_number = ''

  refreshVehicle(is_click: boolean = false) {
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      if (value) {
        this.vehicleNumber = value.vehicle_number ? value.vehicle_number : ''
        if (!is_click) {
          // this.selectedNric = {type: value.identification_type ? value.identification_type : '', number: value.identification_number ? value.identification_number : '' }
          // this.contactHost = ''
          if (this.project_config.is_industrial) {
            // this.contactHost = value.industrial_host_id ? value.industrial_host_id : ''
          } else {
            if (value.block_id) {
              this.blkLocation = value.block_id
            }
          }
        }
      }
    })
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost: string = '';
  async loadHost() {
    this.contactHost = ''
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
      if (this.selectedHost) {
        this.contactHost = this.selectedHost
      }
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
  }

  is_id_disabled = false
  setFromScan(event: any) {
    console.log(event)
    this.nric_value = event.data.identification_number ? event.data.identification_number : ''
    this.identificationType = event.type
    if (event.data.is_server) {
      if (this.project_config.is_industrial) {
        this.contactHost = event.data.industrial_host_id ? event.data.industrial_host_id : ''
      }
      this.is_id_disabled = true
      this.vehicleNumber = event.data.vehicle_number ? event.data.vehicle_number : ''
    } 
    console.log(this.nric_value, this.identificationType)
  }

  identificationType = ''
  nric_value = ''
  selectedNric: any = ''
  pass_number = ''

  checkAlert(alert_data: any, openBarrier: boolean) {
    this.functionMain.addOffenceFromAlert({...alert_data, block_id: this.project_config.is_industrial ? false : this.blkLocation, host_id: this.project_config.is_industrial ? this.selectedHost : false, project_id: this.project_id }, openBarrier, 'home-vms')
  }

  handleRefresh(event: any) {
    this.functionMain.getModuleField(this.project_id, this.module_field).then((result) => {
      console.log(result)
      this.module_config = result
    })
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