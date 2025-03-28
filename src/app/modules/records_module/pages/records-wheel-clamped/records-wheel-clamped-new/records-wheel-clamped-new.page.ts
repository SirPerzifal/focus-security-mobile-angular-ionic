import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-records-wheel-clamped-new',
  templateUrl: './records-wheel-clamped-new.page.html',
  styleUrls: ['./records-wheel-clamped-new.page.scss'],
})
export class RecordsWheelClampedNewPage implements OnInit {

  constructor(
    private router: Router, 
    private modalController: ModalController, 
    private navParams: NavParams, 
    private blockUnitService: BlockUnitService,
    private mainVmsService: MainVmsService,
    private functionMain: FunctionMainService,
  ) {
    this.type = this.navParams.get('type')
    const vehicle_number = navParams.get('vehicle_number')
    if (vehicle_number){
      this.vehicleNumber = vehicle_number
      this.isVehicleNumberReadonly = true
      if (navParams.get('type_of_entry')) {
        this.typeOfEntry = navParams.get('type_of_entry')
        this.isTypeOfEntryReadonly = true
      }
    } else {
      this.loadProjectName().then(() => {
        this.refreshVehicle()
      })
    }
    
    this.selectedNotice = this.type
    if (this.type == 'first_warning') {
      this.showType = 'FIRST WARNING NOTICE'
    } else if (this.type == 'second_warning') {
      this.showType = 'SECOND WARNING NOTICE'
    } else {
      this.showType = 'WHEEL CLAMP NOTICE'
    }
   }

  ngOnInit() {
    this.loadProjectName().then(() => {
      this.loadBlock()
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
    })
  }

  project_id = 0

  type = 'first_warning'
  showType = 'FIRST WARNING'
  selectedNotice = ''
  beforeClampImageFile = '';
  afterClampImageFile = '';
  imageBeforeClampInput: string = '';
  imageAfterClampInput: string = '';
  issueOfficer = ''
  issueName = ''
  vehicleNumber = ''
  isVehicleNumberReadonly = false
  issueContact = ''
  typeOfEntry = ''
  isTypeOfEntryReadonly = false
  blockId = ''
  unitId = ''
  reasonOfIssuance = ''

  onBeforeClampImageFileSelected(file: File) {
    let data = file;
    if (data){
      this.functionMain.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.beforeClampImageFile = base64.split(',')[1]
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } 
  }

  onAfterClampImageFileSelected(file: File) {
    let data = file;
    if (data){
      this.functionMain.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.afterClampImageFile = base64.split(',')[1]
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } 
  }

  onSubmit() {
    let errMsg = ''
    if (this.type == 'wheel_clamp'){
      this.selectedNotice = 'wheel_clamp'
    } else {
      if (!this.selectedNotice) {
        errMsg += 'You must select a notice! \n'
      }
    }
    if (!this.beforeClampImageFile) {
      errMsg += this.type == 'wheel_clamp' ? 'Before clamp image is required! \n' : 'You must upload an evidence image! \n'
    }
    if (this.type == 'wheel_clamp') {
      if (!this.afterClampImageFile) {
        errMsg += 'After clamp image is required for wheel clamp issues! \n'
      }
    }
    if (!this.vehicleNumber) {
      errMsg += 'Offender vehicle number is required! \n'
    }
    if (!this.issueName) {
      errMsg += 'Offender name is required! \n'
    }
    if (!this.issueContact) {
      errMsg += 'Offender contact number is required! \n'
    }
    if (this.issueContact) {
      if (this.issueContact.length <= 2 ) {
        errMsg += 'Offender contact number is required! \n'
      }
    }
    if (!this.typeOfEntry) {
      errMsg += 'Offender type of entry is required! \n'
    }
    if (!this.blockId || !this.unitId) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if (!this.reasonOfIssuance) {
      errMsg += 'You must provide an issue reason! \n'
    }
    if (!this.issueOfficer) {
      errMsg += 'Issue officer is required! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger');
    } else {
      let params = {
        vehicle_number: this.vehicleNumber, 
        visitor_name: this.issueName, 
        block_id: this.blockId, 
        unit_id: this.unitId, 
        contact_number: this.issueContact,
        type_notice: this.selectedNotice, 
        issuing_officer_name: this.issueOfficer,
        type: this.typeOfEntry,
        reason: this.reasonOfIssuance,
        notice_image: this.type != 'wheel_clamp' ? this.beforeClampImageFile : false,
        before_clamp_image: this.type == 'wheel_clamp' ? this.beforeClampImageFile : false,
        after_clamp_image: this.type == 'wheel_clamp' ? this.afterClampImageFile : false,
        project_id: this.project_id
      }
      
      console.log(params)
      this.mainVmsService.getApi(params, '/vms/create/offenses' ).subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.functionMain.presentToast('Issue notice successfully submitted!', 'success');
            this.modalController.dismiss(true);
          } else {
            if (results.result.error_message.includes('Record does not exist or has been deleted')) {
              this.functionMain.presentToast('Issue notice successfully submitted!', 'success');
              this.modalController.dismiss(true);
            } else {
              this.functionMain.presentToast('An error occurred while submitting issue notice!', 'danger');
            }
            
          }
  
          // this.isLoading = false;
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while submitting issue notice!', 'danger');
          console.error(error);
        }
      });
    }
  }

  getContactInfo(contactData: any){
    if (contactData) {
      this.issueName = contactData.visitor_name
      this.vehicleNumber = contactData.vehicle_number
      this.blockId = contactData.block_id
      this.loadUnit().then(() => {
        this.unitId = contactData.unit_id
      })
    }
  }

  Block: any;
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
        // this.functionMain.presentToast('Error loading vehicle data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async loadUnit() {
    this.unitId = ''
    this.blockUnitService.getUnit(this.blockId).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}))
        } else {
          // this.functionMain.presentToast('Failed to load unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        // this.functionMain.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  onBlockChange(event: any) {
    this.blockId = event.target.value;
    this.unitId = ''
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.unitId = event[0];
  }

  onCancel() {
    this.modalController.dismiss(false);
  }

  refreshVehicle() {
    if (!this.isVehicleNumberReadonly) {
      // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
      // let front = ['SBA', 'SBS', 'SAA']
      // let randomVhc = front[Math.floor(Math.random() * front.length)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
      // this.vehicleNumber = randomVhc
      this.functionMain.getLprConfig(this.project_id).then((value) => {
        console.log(value)
        this.vehicleNumber = value.vehicle_number ? value.vehicle_number : ''
      })
    }
  }
  
}
