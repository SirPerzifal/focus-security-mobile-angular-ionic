import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    // Initialize the form with an empty FormArray for pax entries
    this.paxForm = this.fb.group({
      paxEntries: this.fb.array([])
    });
  }

  ngOnInit() {
    // Initialize with a default number of pax entries
  }

  get paxEntries(): FormArray {
    return this.paxForm.get('paxEntries') as FormArray;
  }

  showWalk = false;
  showDrive = false;
  showWalkTrans = false;
  showDriveTrans = false;

  toggleShowWalk() {
    if (!this.showDriveTrans) {
      this.showWalkTrans = true
      this.showDrive = false;
      setTimeout(() => {
        this.showWalk = true;
        this.showWalkTrans = false
      }, 300)
    }
  }

  toggleShowDrive() {
    if (!this.showWalkTrans) {
      this.showDriveTrans = true
      this.showWalk = false;
      setTimeout(() => {
        this.showDrive = true;
        this.showDriveTrans = false
      }, 300)
    }
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
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.vehicle_number = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }
}
