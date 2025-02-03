import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

@Component({
  selector: 'app-records-wheel-clamped-new',
  templateUrl: './records-wheel-clamped-new.page.html',
  styleUrls: ['./records-wheel-clamped-new.page.scss'],
})
export class RecordsWheelClampedNewPage implements OnInit {

  constructor(private router: Router, private modalController: ModalController, private navParams: NavParams, private blockUnitService: BlockUnitService) {
    this.type = this.navParams.get('type')
    if (this.type == 'first_warning') {
      this.showType = 'FIRST WARNING NOTICE'
    } else if (this.type == 'second_warning') {
      this.showType = 'SECOND WARNING NOTICE'
    } else {
      this.showType = 'WHEEL CLAMP NOTICE'
    }
   }

  ngOnInit() {
    this.loadBlock()
  }

  type = 'firt_warning'
  showType = 'FIRST WARNING'
  selectedNotice = ''
  beforeClampImageFile = null as File | null;
  afterClampImageFile = null as File | null;
  imageBeforeClampInput: string = '';
  imageAfterClampInput: string = '';
  issueOfficer = ''
  issueName = ''
  vehicleNumber = ''
  issueContact = ''
  typeOfEntry = ''
  blockId = ''
  unitId = ''
  reasonOfIssuance = ''

  onBeforeClampImageFileSelected(file: File) {
    // Convert File to a usable format if needed
    this.beforeClampImageFile = file
    this.imageBeforeClampInput = file.name; // Or file.path if you need the full path
    console.log(this.imageBeforeClampInput);
    console.log('imageBeforeClampInputimageBeforeClampInputimageBeforeClampInputimageBeforeClampInput');


    // If you need to handle the file further
    // For example, prepare for upload
    const formData = new FormData();
    formData.append('image', file);

    // You can now use this formData for upload or further processing
  }

  onAfterClampImageFileSelected(file: File) {
    // Convert File to a usable format if needed
    this.afterClampImageFile = file
    this.imageAfterClampInput = file.name; // Or file.path if you need the full path
    console.log(this.imageAfterClampInput);
    console.log('this.imageAfterClampInputthis.imageAfterClampInputthis.imageAfterClampInputthis.imageAfterClampInput');

    // If you need to handle the file further
    // For example, prepare for upload
    const formData = new FormData();
    formData.append('image', file);

    // You can now use this formData for upload or further processing
  }

  onSubmit() {
    let errMsg = ''
    console.log(this.type, this.afterClampImageFile)
    if (!this.selectedNotice) {
      errMsg += 'You must select a notice! \n'
    }
    if (!this.beforeClampImageFile) {
      errMsg += this.type == 'wheel_clamp' ? 'Before clamp image is required! \n' : 'You must upload an evidence image! \n'
    } 
    if ( this.type == 'wheel_clamp' && !this.afterClampImageFile) {
      errMsg += 'After clamp image is required for wheel clamp issues! \n'
    } 
    if (!this.issueOfficer) {
      errMsg += 'Issue officer is required! \n'
    }
    if (errMsg) {
      console.log(errMsg)
    } else {
      console.log(this.afterClampImageFile, this.imageAfterClampInput, this.beforeClampImageFile, this.imageBeforeClampInput, this.selectedNotice, this.issueOfficer);
      this.modalController.dismiss({
        result: true, data: {
          image_after: {
            file: this.afterClampImageFile,
            name: this.imageAfterClampInput
          },
          image_before: {
            file: this.beforeClampImageFile,
            name: this.imageBeforeClampInput
          },
          notice: this.selectedNotice,
          officer: this.issueOfficer
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
          // this.presentToast('Failed to load vehicle data', 'danger');
        }
      },
      error: (error) => {
        // this.presentToast('Error loading vehicle data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async loadUnit() {
    this.blockUnitService.getUnit(this.blockId).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
        } else {
          // this.presentToast('Failed to load unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        // this.presentToast('Error loading unit data', 'danger');
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
    this.unitId = event.target.value;
  }

  onCancel() {
    this.modalController.dismiss(false);
  }

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * front.length)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.vehicleNumber = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }
  
}
