import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { faBarcode, faL, faMotorcycle, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { VmsServicePickUp } from 'src/app/service/vms/pick_up/pick-up.service';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/vms/user/user.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

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
    private vmsService: VmsServicePickUp,
    private toastController: ToastController,
    private userApi: UserService,
    private router: Router,
    private blockUnitService: BlockUnitService,
    public functionMain: FunctionMainService,
    private mainVmsService: MainVmsService,
  ) { }

  ngOnInit() {
    // this.loadBlock()
    this.loadProjectId().then(() => {
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
        this.presentToast('An error occurred while loading block data!', 'danger');
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

  async saveRecord(openBarrier: boolean = false, cameraId: string = '') {
    const vehicleNumber = this.vehicleNumber
    const location = this.blkLocation;
    let errMsg = ''
    if (!this.selectedVehicleType) {
      errMsg += 'Vehicle type must be selected! \n'
    }

    if (!vehicleNumber) {
      errMsg += 'Vehicle number is required! \n'
      console.log(this.vehicleNumberInput.value)
    }

    if (!location && !this.project_config.is_industrial) {
      errMsg += 'Location is required! \n'
    }
    if (this.project_config.is_industrial && !this.identificationType) {
      errMsg += 'Identification type is required! \n'
    }
    if (this.project_config.is_industrial && !this.nric_value) {
      errMsg += 'Identification number is required! \n'
    }
    if (!this.selectedHost && this.project_config.is_industrial) {
      errMsg += 'Host is required! \n'
    }
    if (!this.pass_number && this.project_config.is_industrial) {
      errMsg += 'Pass number is required! \n'
    }
    if (errMsg) {
      this.presentToast(errMsg, 'danger');
      return
    }

    try {
      // Gunakan subscribe alih-alih toPromise()
      this.vmsService.addEntry(
        this.entryType, 
        this.selectedVehicleType, 
        vehicleNumber, 
        location,
        this.project_id,
        cameraId ? cameraId : '',
        this.selectedHost,
        this.identificationType,
        this.nric_value,
        this.pass_number,
      ).subscribe({
        next: (response) => {
          console.log(response)
          if (response.result.status_code === 200) {
            if (openBarrier) {
              this.presentToast('Data has been successfully saved, and the barrier is now open!', 'success');
            } else {
              this.presentToast('Data has been successfully saved to the system!', 'success');
            }
            this.router.navigate(['home-vms'])
            
            // Reset form
            this.vehicleNumberInput.value = '';
            // this.locationInput.value = '';
            this.selectedVehicleType = '';
            this.resetVehicleSelection();
            
            
          } else {
            this.presentToast('An error occurred while attempting to save the data!', 'danger');
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.presentToast('An unexpected error has occurred!', 'danger');
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  resetVehicleSelection() {
    this.valPhv = false;
    this.valCar = false;
    this.valTaxi = false;
    this.valBike = false;
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    

    toast.present().then(() => {
      
      
    });
  }
  
  vehicle_number = ''

  refreshVehicle() {
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    // this.vehicleNumber = randomVhc
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.vehicleNumber = value.vehicle_number ? value.vehicle_number : ''
    })
  }

  Host: any[] = [];
  selectedHost: string = '';
  loadHost() {
    this.mainVmsService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
  }

  setFromScan(event: any) {
    console.log(event)
    this.nric_value = event.data.identification_number
    this.identificationType = event.type
    if (event.data.is_server) {
      this.vehicleNumber = event.data.vehicle_number
    } 
    console.log(this.nric_value, this.identificationType)
  }

  identificationType = ''
  nric_value = ''
  selectedNric = ''
  pass_number = ''
}