import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

@Component({
  selector: 'app-records-blacklist-form',
  templateUrl: './records-blacklist-form.page.html',
  styleUrls: ['./records-blacklist-form.page.scss'],
})
export class RecordsBlacklistFormPage implements OnInit {

  constructor(private blockUnitService: BlockUnitService, private router: Router) { }

  ngOnInit() {
    this.loadBlock()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBlockChange(event: any) {
    this.formData.block = event.target.value;
    this.loadUnit()
    console.log(this.formData.block)
  }

  onUnitChange(event: any) {
    this.formData.unit = event.target.value;
    console.log(this.formData.unit)
  }

  Block: any[] = [];
  Unit: any[] = [];

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
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  async loadUnit() {
    this.blockUnitService.getUnit(this.formData.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        console.error('Error:', error.result);
      }
    });
  }

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.formData.visitor_vehicle = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

  saveRecord() {
    console.log("SAVE")
  }

  getContactInfo(contactData: any){
    if (contactData) {
      this.formData.visitor_name = contactData.visitor_name
      this.formData.visitor_vehicle = contactData.vehicle_number
      this.formData.block = contactData.block_id
      this.loadUnit().then(() => {
        this.formData.unit = contactData.unit_id
      })
    }
  }

  formData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'walk_in',
    visitor_vehicle: '',
    block: '',
    unit: ''
  };

}
