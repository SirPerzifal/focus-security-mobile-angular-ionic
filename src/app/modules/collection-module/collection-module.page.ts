import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { CollectionService } from 'src/app/service/vms/collection/collection.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

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
    private blockUnitService: BlockUnitService
  ) { }

  walkInFormData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'walk_in',
    visitor_vehicle: '',
    block: '',
    unit: ''
  };

  driveInFormData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'drive_in',
    visitor_vehicle: '',
    block: '',
    unit: ''
  };

  Block: any[] = [];
  Unit: any[] = [];

  showWalk = false;
  showDrive = false;
  showWalkTrans = false;
  showDriveTrans = false;

  toggleShowWalk() {
    if (!this.showDriveTrans){
      this.showWalkTrans = true
      this.showDrive = false;
      setTimeout(()=>{
        this.showWalk = true;
        this.showWalkTrans = false
      }, 300)
    }
  }

  toggleShowDrive() {
    if (!this.showWalkTrans){
      this.showDriveTrans = true
      this.showWalk = false;
      setTimeout(()=>{
        this.showDrive = true;
        this.showDriveTrans = false
      }, 300)
    }
  }

  onWalkInNameChange(event:string){
    this.walkInFormData.visitor_name = event
  }

  onWalkInContactChange(event:string){
    this.walkInFormData.visitor_contact_no = event
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
          this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  isLoadingUnit = false
  loadUnit() {
    var blockUnittoGet = this.showWalk ? this.walkInFormData.block : this.showDrive ? this.driveInFormData.block : "0"
    this.blockUnitService.getUnit(blockUnittoGet).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
        } else {
          this.presentToast('An error occurred while loading unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  onBlockChange(event: any) {
    if(this.showWalk){
      this.walkInFormData.block = event.target.value;
      this.isLoadingUnit =true
      this.loadUnit(); // Panggil method load unit
      this.isLoadingUnit =false
    }else if(this.showDrive){
      this.driveInFormData.block = event.target.value;
      this.isLoadingUnit =true
      this.loadUnit();
      this.isLoadingUnit =false
    }else{
      this.presentToast('Please choose collection type first!', 'danger');
    }
  }

  onUnitChange(event: any) {
    if(this.showWalk){
      this.walkInFormData.unit = event.target.value;
    }else if(this.showDrive){
      this.driveInFormData.unit = event.target.value;
    }else{
      this.presentToast('Please choose collection type first!', 'danger');
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
    if (!this.walkInFormData.block || !this.walkInFormData.unit) {
      errMsg += 'Block and unit must be selected!\n';
    }
    if (errMsg != "") {
      this.presentToast(errMsg, 'danger')
      return
    }
    
    try {
      this.collectionService.postAddColllection(this.walkInFormData.visitor_name, this.walkInFormData.visitor_contact_no, 'walk_in', this.walkInFormData.visitor_vehicle, this.walkInFormData.block, this.walkInFormData.unit).subscribe(
        res => {
          console.log(res);
          if (res.result.response_code == 200) {
            this.presentToast('Walk in data has been successfully saved to the system!', 'success');
            // this.walkInFormData.visitor_name = ''
            // this.walkInFormData.visitor_contact_no = ''
            // this.walkInFormData.visitor_type = 'walk_in'
            // this.walkInFormData.visitor_vehicle = ''
            // this.walkInFormData.block = ''
            // this.walkInFormData.unit = ''
            // this.driveInFormData.visitor_name = ''
            // this.driveInFormData.visitor_contact_no = ''
            // this.driveInFormData.visitor_type = 'drive_in'
            // this.driveInFormData.visitor_vehicle = ''
            // this.driveInFormData.block = ''
            // this.driveInFormData.unit = ''
            // if (openBarrier){
            //   console.log("Barrier Opened")
            // }else {
            //   this.presentToast('Drive in data has been successfully saved to the system!', 'success');
            // }
            
            this.router.navigate(['home-vms'])
          } else {
            this.presentToast('An error occurred while attempting to save walk in data', 'danger');
          }

        },
        error => {
          console.error('Error Here:', error);
          this.presentToast('An unexpected error has occurred!', 'danger');
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  onSubmitDriveIn(){
    let errMsg = ""
    if (!this.driveInFormData.visitor_name) {
      errMsg += 'Visitor is required!\n';
    }
    if (!this.driveInFormData.visitor_contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (!this.driveInFormData.visitor_vehicle) {
      errMsg += 'Vehicle number is required!\n';
    }
    if (!this.driveInFormData.block || !this.driveInFormData.unit) {
      errMsg += 'Block and unit must be selected!\n';
    }
    if (errMsg != "") {
      this.presentToast(errMsg, 'danger')
      return
    }
    
    try {
      this.collectionService.postAddColllection(this.driveInFormData.visitor_name, this.driveInFormData.visitor_contact_no, 'drive_in', this.driveInFormData.visitor_vehicle, this.driveInFormData.block, this.driveInFormData.unit).subscribe(
        res => {
          console.log(res);
          if (res.result.response_code == 200) {
            this.presentToast('Drive in data has been successfully saved, and the barrier is now open!', 'success');
            // this.walkInFormData.visitor_name = ''
            // this.walkInFormData.visitor_contact_no = ''
            // this.walkInFormData.visitor_type = 'walk_in'
            // this.walkInFormData.visitor_vehicle = ''
            // this.walkInFormData.block = ''
            // this.walkInFormData.unit = ''
            // this.driveInFormData.visitor_name = ''
            // this.driveInFormData.visitor_contact_no = ''
            // this.driveInFormData.visitor_type = 'drive_in'
            // this.driveInFormData.visitor_vehicle = ''
            // this.driveInFormData.block = ''
            // this.driveInFormData.unit = ''
            // if (openBarrier){
            //   console.log("Barrier Opened")
            // }else {
            //   this.presentToast('Drive in data has been successfully saved to the system!', 'success');
            // }
            
            this.router.navigate(['home-vms'])
          } else {
            this.presentToast('An error occurred while attempting to save walk in data', 'danger');
          }

        },
        error => {
          console.error('Error Here:', error);
          this.presentToast('An unexpected error has occurred!', 'danger');
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
  }

  ngOnInit() {
    this.isLoadingBlock =true
    this.loadBlock(); 
    this.isLoadingBlock =false
  }

  vehicle_number = ''

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.vehicle_number = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

}
