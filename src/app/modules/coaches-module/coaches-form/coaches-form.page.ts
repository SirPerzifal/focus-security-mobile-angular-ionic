import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-coaches-form',
  templateUrl: './coaches-form.page.html',
  styleUrls: ['./coaches-form.page.scss'],
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
export class CoachesFormPage implements OnInit {

  paxForm: FormGroup;
  maxPax = 10;  // Define the maximum pax allowed
  paxCount = 1; // Initial pax count, you can set this to 1 by default

  constructor(private fb: FormBuilder, private router: Router, private blockUnitService: BlockUnitService, private toastController: ToastController, private clientMainService: ClientMainService, private functionMain: FunctionMainService) {
    // Initialize the form with an empty FormArray for pax entries
    this.paxForm = this.fb.group({
      paxEntries: this.fb.array([])
    });
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { schedule: any};
    if (state) {
      this.loadProjectName().then(() => {
        this.schedule= state.schedule
        console.log(this.schedule)
        if (!this.schedule.vehicle_number) {
          this.schedule.vehicle_number = ''
        }
        if (this.schedule.block_id){
          this.loadUnit()
        }
        if (!this.schedule.unit_id) {
          this.schedule.unit_id = ''
        }
        if (!this.schedule.coach_type_id) {
          this.schedule.coach_type_id = ''
        }
        this.loadType()
        if (this.schedule.vehicle_number) {
          this.toggleShowDrive()
          this.vehicle_number = this.schedule.vehicle_number
        }
      })
    } 
  }

  schedule: any = []
  contactNumber = ''
  selectedBlock = ''

  ngOnInit() {
    this.loadProjectName().then(() => {
      console.log(this.schedule)
      this.contactNumber = this.schedule.contact_number ? this.schedule.contact_number : ''
      this.loadBlock()
    })
    // Initialize with a default number of pax entries
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

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  get paxEntries(): FormArray {
    return this.paxForm.get('paxEntries') as FormArray;
  }

  selectedType = 'walk_in'
  coachName = ''

  showWalk = true;
  showDrive = false;
  showWalkTrans = false;
  showDriveTrans = false;

  toggleShowWalk() {
    this.showWalk = true
    this.showDrive = false;
    this.selectedType = 'walk_in'
  }

  toggleShowDrive() {
    this.showWalk = false;
    this.selectedType = 'drive_in'
    this.showDrive = true;
  }

  // Update pax entries when pax count is changed
  onPaxCountChange(event: any) {
    this.paxCount = parseInt(event.target.selectedOptions[0].value, 10); // Get the selected pax count
  }

  // For form submission or further handling
  submitForm() {
    console.log(this.paxForm.value);
  }

  vehicle_number = ''


  refreshVehicle() {
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * front.length)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.schedule.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
    })
  }

  onBackMove() {
    this.router.navigate(['move-home'], {
      queryParams: {type: 'coach'}
    });
  }

  block = ''
  unit = ''

  Block: any = []
  Unit: any = []
  Coach: any = []

  // onBlockChange(event: any) {
  //   this.schedule.block_id = event.target.value;
  //   this.schedule.unit_id = ''
  //   console.log(this.schedule.block_id)
  //   this.loadUnit(); // Panggil method load unit
  // }

  // onUnitChange(event: any) {
  //   this.schedule.unit_id = event.target.value;
  //   console.log(this.schedule.unit_id)
  // }

  onCoachChange(event: any) {
    this.schedule.coach_type_id = event.target.value;
    console.log(this.schedule.coach_type_id)
  }

  loadType() {
    this.clientMainService.getApi({project_id: this.project_id}, '/vms/get/get_coach_type' ).subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          console.log(results)
          if (results.result.coaches_type.length > 0) {
            this.Coach = results.result.coaches_type;
          } else {
            this.Coach = []
          }
        } else {
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
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
    this.isLoadingUnit = true
    this.blockUnitService.getUnit(this.schedule.block_id).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
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

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  onSubmitRecord(isOpenBarrier: boolean = false, camera_id: string = '') {
    let errMsg = ''
    if (!this.selectedImage) {
      errMsg += 'Coach image is required!\n';
    }
    if (!this.schedule.coach_name){
      errMsg += 'Coach name is missing! \n'
    }
    if (!this.contactNumber) {
      errMsg += 'Contact number is missing! \n'
    }
    if (this.contactNumber) {
      if (this.contactNumber.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (this.showDrive && !this.schedule.vehicle_number) {
      errMsg += 'Vehicle number is missing! \n'
    }
    if (!this.schedule.block_id || !this.schedule.unit_id) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger');
    } else {
      if (isOpenBarrier){
        console.log("OPEN BARRIER")
      } else {
        console.log("BARRIER NOT OPENED");
      }
      
      let params = {
        coach_id: this.schedule.coach_id,
        name: this.schedule.coach_name,
        contact_number: this.contactNumber,
        block_id: this.schedule.block_id,
        unit_id: this.schedule.unit_id,
        selection_type: this.schedule.coach_type_id,
        vehicle_number: this.showDrive ? this.schedule.vehicle_number : '' ,
        project_id: this.project_id,
        camera_id: camera_id,
        visitor_image: this.selectedImage,
      }
      console.log(params)
      this.clientMainService.getApi(params, '/vms/post/add_coaches' ).subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.functionMain.presentToast('Coach data successfully submitted!', 'success');
            this.onBackMove()
          } else if (results.result.response_code === 205) {
            if (isOpenBarrier) {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
            } else {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
            }
            this.onBackMove()
          } else if (results.result.response_code === 405) {
            this.functionMain.presentToast(results.result.status_description, 'danger');
            this.onBackMove()
          } else if (results.result.response_code === 206) {
            this.functionMain.banAlert(results.result.status_description, this.schedule.unit, false)
          } else {
            this.functionMain.presentToast('An error occurred while submitting coach data!', 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while submitting coach data!', 'danger');
          console.error(error);
        }
      });
    }
  }

  getContactInfo(contactData: any){
    if (contactData) {
      this.schedule.coach_name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.schedule.vehicle_number = contactData.vehicle_number ? contactData.vehicle_number  : ''
      this.selectedImage = contactData.visitor_image
      if (this.schedule.vehicle_number != ''){
        this.toggleShowDrive()
      }
      if (contactData.block_id) {
        this.schedule.block_id = contactData.block_id
        this.loadUnit().then(() => {
          this.schedule.unit_id = contactData.unit_id
        })
      }
    }
  }

  selectedImage: any = ''

  handleRefresh(event: any) {
    if (this.project_config.is_industrial) {
    } else {
      // this.loadBlock()
    }
    this.loadType()
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }
}
