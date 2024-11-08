import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-renov-form',
  templateUrl: './renov-form.page.html',
  styleUrls: ['./renov-form.page.scss'],
})
export class RenovFormPage implements OnInit {

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


  // Update pax entries when pax count is changed
  onPaxCountChange(event: any) {
    this.paxCount = parseInt(event.target.selectedOptions[0].value, 10); // Get the selected pax count
  }

  // For form submission or further handling
  submitForm() {
    console.log(this.paxForm.value);
  }
}
