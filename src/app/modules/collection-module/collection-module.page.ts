import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { CollectionService } from 'src/app/service/vms/collection/collection.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-collection-module',
  templateUrl: './collection-module.page.html',
  styleUrls: ['./collection-module.page.scss'],
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
export class CollectionModulePage implements OnInit {

  constructor(
    private collectionService: CollectionService,
    private toastController: ToastController, 
    private router: Router,
    private blockUnitService: BlockUnitService,
    private functionMain: FunctionMainService,
    private mainVmsService: MainVmsService
  ) { }

  walkInFormData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'walk_in',
    visitor_vehicle: '',
    block: '',
    unit: '',
    company_name: '',
    remarks: '',
  };

  driveInFormData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'drive_in',
    visitor_vehicle: '',
    block: '',
    unit: '',
    company_name: '',
    remarks: '',
  };

  Block: any[] = [];
  Unit: any[] = [];

  showWalk = false;
  showDrive = false;
  showWalkTrans = false;
  showDriveTrans = false;

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
      this.Camera = value.config.lpr
    })
  }

  project_config: any = []
  project_id = 0
  Camera: any = []

  toggleShowWalk() {
    if (!this.showDriveTrans){
      if(!this.showWalk){
        this.resetForm()
      }
      this.showWalkTrans = true
      this.showDrive = false;
      setTimeout(()=>{
        this.showWalk = true;
        this.showWalkTrans = false
      }, 300)
    }
  }

  resetForm(){
    this.walkInFormData = {
      visitor_name: '',
      visitor_contact_no: '',
      visitor_type: 'walk_in',
      visitor_vehicle: '',
      block: '',
      unit: '',
      company_name: '',
      remarks: '',
    };

    this.contactUnit = ''
    this.contactHost = ''
    this.selectedHost = ''
  
    this.driveInFormData = {
      visitor_name: '',
      visitor_contact_no: '',
      visitor_type: 'drive_in',
      visitor_vehicle: '',
      block: '',
      unit: '',
      company_name: '',
      remarks: '',
    };

    this.nric_value = ''
    this.identificationType = ''
    this.selectedNric = ''
    this.pass_number = ''
  }

  toggleShowDrive() {
    if (!this.showWalkTrans){
      if(!this.showDrive){
        this.resetForm()
      }
      this.showDriveTrans = true
      this.showWalk = false;
      setTimeout(()=>{
        this.showDrive = true;
        this.showDriveTrans = false
        this.refreshVehicle()
      }, 300)
    }
  }

  onWalkInNameChange(event:string){
    this.walkInFormData.visitor_name = event
  }

  onWalkInContactChange(event:string){
    this.walkInFormData.visitor_contact_no = event
    console.log(this.walkInFormData.visitor_contact_no)
  }

  onDriveInNameChange(event:string){
    this.driveInFormData.visitor_name = event
  }

  onDriveInContactChange(event:string){
    this.driveInFormData.visitor_contact_no = event
  }

  onDriveInVehicleChange(event:string){
    this.driveInFormData.visitor_vehicle = event
  }

  
  isLoadingBlock = false
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

  isLoadingUnit = false
  async loadUnit() {
    var blockUnittoGet = this.showWalk ? this.walkInFormData.block : this.showDrive ? this.driveInFormData.block : "0"
    this.blockUnitService.getUnit(blockUnittoGet).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name})); // Simpan data unit
          console.log(response)
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  onBlockChange(event: any) {
    if(this.showWalk){
      this.walkInFormData.block = event.target.value;
      this.walkInFormData.unit = ''
      this.isLoadingUnit =true
      this.loadUnit(); // Panggil method load unit
      this.isLoadingUnit =false
    }else if(this.showDrive){
      this.driveInFormData.block = event.target.value;
      this.driveInFormData.unit = ''
      this.isLoadingUnit =true
      this.loadUnit();
      this.isLoadingUnit =false
    }else{
      this.functionMain.presentToast('Please choose collection type first!', 'danger');
    }
  }

  onUnitChange(event: any) {
    if(this.showWalk){
      this.walkInFormData.unit = event[0];
    }else if(this.showDrive){
      this.driveInFormData.unit = event[0];
    }else{
      this.functionMain.presentToast('Please choose collection type first!', 'danger');
    }
  }

  onSubmitWalkIn(){
    let errMsg = ""
    if (!this.walkInFormData.visitor_name) {
      errMsg += 'Visitor is required!\n';
    }
    if (!this.walkInFormData.visitor_contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (this.walkInFormData.visitor_contact_no) {
      if (this.walkInFormData.visitor_contact_no.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if ((!this.identificationType) && this.project_config.is_industrial) {
      errMsg += 'Identification type is required!\n';
    }
    if ((!this.nric_value) && this.project_config.is_industrial) {
      errMsg += 'Identification number is required!\n';
    }
    if ((!this.walkInFormData.block || !this.walkInFormData.unit) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected!\n';
    }
    if ((!this.walkInFormData.company_name) && this.project_config.is_industrial) {
      errMsg += 'Company name is required!\n';
    }
    if ((!this.selectedHost) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected!\n';
    }
    if (!this.pass_number && this.project_config.is_industrial) {
      errMsg += 'Pass number is required! \n'
    }
    if ((!this.walkInFormData.remarks) && this.project_config.is_industrial) {
      errMsg += 'Remarks is required!\n';
    }
    if (errMsg != "") {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    try {
      this.collectionService.postAddColllection(this.walkInFormData.visitor_name, this.walkInFormData.visitor_contact_no, 'walk_in', this.walkInFormData.visitor_vehicle, this.walkInFormData.block, this.walkInFormData.unit, this.project_id, '', this.selectedHost, this.walkInFormData.company_name, this.walkInFormData.remarks,this.nric_value,this.identificationType,this.pass_number).subscribe(
        res => {
          console.log(res);
          if (res.result.response_code == 200) {
            this.functionMain.presentToast('Walk in data has been successfully saved to the system!', 'success');
            this.router.navigate(['home-vms'])
          } else {
            this.functionMain.presentToast('An error occurred while attempting to save walk in data', 'danger');
          }

        },
        error => {
          console.error('Error Here:', error);
          this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  onSubmitDriveIn(openBarrier: boolean = true, camera_id: string = ''){
    let errMsg = ""
    if (!this.driveInFormData.visitor_name) {
      errMsg += 'Visitor is required!\n';
    }
    if (!this.driveInFormData.visitor_contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (this.driveInFormData.visitor_contact_no) {
      if (this.driveInFormData.visitor_contact_no.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if ((!this.identificationType) && this.project_config.is_industrial) {
      errMsg += 'Identification type is required!\n';
    }
    if ((!this.nric_value) && this.project_config.is_industrial) {
      errMsg += 'Identification number is required!\n';
    }
    if (!this.driveInFormData.visitor_vehicle) {
      errMsg += 'Vehicle number is required!\n';
    }
    if ((!this.driveInFormData.block || !this.driveInFormData.unit) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected!\n';
    }
    if ((!this.driveInFormData.company_name) && this.project_config.is_industrial) {
      errMsg += 'Company name is required!\n';
    }
    if ((!this.selectedHost) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected!\n';
    }
    if (!this.pass_number && this.project_config.is_industrial) {
      errMsg += 'Pass number is required! \n'
    }
    if ((!this.driveInFormData.remarks) && this.project_config.is_industrial) {
      errMsg += 'Remarks is required!\n';
    }
    if (errMsg != "") {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    if (openBarrier){
      console.log("OPEN BARRIER")
    } else {
      console.log("BARRIER NOT OPENED");
    }
    try {
      this.collectionService.postAddColllection(this.driveInFormData.visitor_name, this.driveInFormData.visitor_contact_no, 'drive_in', this.driveInFormData.visitor_vehicle, this.driveInFormData.block, this.driveInFormData.unit, this.project_id, camera_id, this.selectedHost, this.driveInFormData.company_name, this.driveInFormData.remarks, this.nric_value, this.identificationType,this.pass_number).subscribe(
        res => {
          console.log(res);
          console.log(res.result.response_code);
          
          if (res.result.response_code == 200) {
            this.functionMain.presentToast('Drive in data has been successfully saved, and the barrier is now open!', 'success');
            this.router.navigate(['home-vms'])
          } else {
            this.functionMain.presentToast('An error occurred while attempting to save walk in data', 'danger');
          }

        },
        error => {
          console.error('Error Here:', error);
          this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  ngOnInit() {
    this.loadProjectName().then(() => {
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
    this.isLoadingBlock =true
    this.isLoadingBlock =false
  }

  vehicle_number = ''

  refreshVehicle() {
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.driveInFormData.visitor_vehicle = value.vehicle_number ? value.vehicle_number : ''
    })
    // console.log("Vehicle Refresh", randomVhc)
  }

  contactUnit = ''
  getDriveInContactInfo(contactData: any){
    this.contactUnit = ''
    if (contactData) {
      this.driveInFormData.visitor_name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.driveInFormData.visitor_vehicle = contactData.vehicle_number ? contactData.vehicle_number  : ''
      if (this.project_config.is_industrial) {
        this.contactHost = contactData.industrial_host_id ? contactData.industrial_host_id : ''
      } else {
        this.driveInFormData.block = contactData.block_id
        this.loadUnit().then(() => {
          setTimeout(() => {
            this.contactUnit = contactData.unit_id
          }, 300)
        })
      }
    }
  }

  getWalkInContactInfo(contactData: any){
    this.contactUnit = ''
    if (contactData) {
      this.walkInFormData.visitor_name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.walkInFormData.visitor_vehicle = contactData.vehicle_number ? contactData.vehicle_number  : ''
      if (this.project_config.is_industrial) {
        this.contactHost = contactData.industrial_host_id ? contactData.industrial_host_id : ''
      } else {
        this.walkInFormData.block = contactData.block_id
        this.loadUnit().then(() => {
          setTimeout(() => {
            this.contactUnit = contactData.unit_id
          }, 300)
        })
      }
    }
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
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
      if (this.showDrive) {
        this.driveInFormData.visitor_name = event.data.contractor_name
        this.driveInFormData.visitor_contact_no = event.data.contact_number
        this.driveInFormData.visitor_vehicle = event.data.vehicle_number
        this.driveInFormData.company_name = event.data.company_name
      }
      if (this.showWalk) {
        this.walkInFormData.visitor_name = event.data.contractor_name
        this.walkInFormData.visitor_contact_no = event.data.contact_number
        this.walkInFormData.visitor_vehicle = event.data.vehicle_number
        this.walkInFormData.company_name = event.data.company_name
      }
    } 
    console.log(this.nric_value, this.identificationType)
  }

  identificationType = ''
  nric_value = ''
  selectedNric = ''
  pass_number = ''

}
