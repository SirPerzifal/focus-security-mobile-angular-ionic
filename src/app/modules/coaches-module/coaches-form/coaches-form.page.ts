import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

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

  constructor(private fb: FormBuilder, private router: Router, private blockUnitService: BlockUnitService, private toastController: ToastController, private mainVmsService: MainVmsService) {
    // Initialize the form with an empty FormArray for pax entries
    this.paxForm = this.fb.group({
      paxEntries: this.fb.array([])
    });
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { schedule: any};
    if (state) {
      this.schedule= state.schedule
    } 
  }

  schedule: any

  ngOnInit() {
    console.log(this.schedule)
    this.loadBlock()
    // Initialize with a default number of pax entries
  }

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
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * front.length)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.vehicle_number = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

  onBackMove() {
    this.router.navigate(['move-home'], {
      queryParams: {type: 'coach'}
    });
  }

  block = ''
  unit = ''

  Block: any
  Unit: any

  onBlockChange(event: any) {
    this.block = event.target.value;
    console.log(this.block)
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.unit = event.target.value;
    console.log(this.unit)
  }

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
          this.presentToast('Failed to load vehicle data', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('Error loading vehicle data', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  isLoadingUnit = false
  loadUnit() {
    this.isLoadingUnit = true
    this.blockUnitService.getUnit(this.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
          this.isLoadingUnit = false
        } else {
          this.presentToast('Failed to load unit data', 'danger');
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

  onSubmitRecord(isOpenBarrier: boolean = false) {
    let params = {
      coach_id: this.schedule.coach_id,
      name: this.coachName,
      contact_number: this.schedule.contact_number,
      block_id: this.block,
      unit_id: this.unit,
      selection_type: '1',
    }
    console.log(params)
    this.mainVmsService.getApi(params, 'vms/post/add_coaches' ).subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.presentToast('Coach data successfully submitted!', 'success');
        } else {
          this.presentToast('An error occurred while submitting coach data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while submitting coach data!', 'danger');
        console.error(error);
      }
    });
  }
}
