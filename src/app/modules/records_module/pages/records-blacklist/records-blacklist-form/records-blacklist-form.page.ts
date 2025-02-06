import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-records-blacklist-form',
  templateUrl: './records-blacklist-form.page.html',
  styleUrls: ['./records-blacklist-form.page.scss'],
})
export class RecordsBlacklistFormPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService, 
    private router: Router, private mainVmsService: MainVmsService, 
    public functionMain: FunctionMainService) { }

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
    this.formData.block_id = event.target.value;
    this.Unit = []
    this.loadUnit()
    console.log(this.formData.block_id)
  }

  onUnitChange(event: any) {
    this.formData.unit_id = event.target.value;
    console.log(this.formData.unit_id)
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
    this.blockUnitService.getUnit(this.formData.block_id).subscribe({
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
    this.formData.vehicle_no = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

  saveRecord() {
    console.log("SAVE")
    let tempDate = new Date().toISOString().split('T')
    this.formData.last_entry_date_time = tempDate[0] + ' ' + tempDate[1].split('.')[0]
    console.log(this.formData)
    this.mainVmsService.getApi(this.formData, '/resident/post/ban_visitor').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_status === 200) {
          this.functionMain.presentToast('Successfully create blacklist data!', 'success');
          this.router.navigate(['records-blacklist'])
        } else {
          this.functionMain.presentToast('An error occurred while loading blacklist data!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading blacklist data!', 'danger');
        console.error(error);
      }
    });
  }

  getContactInfo(contactData: any){
    if (contactData) {
      this.formData.visitor_name = contactData.visitor_name
      this.formData.vehicle_no = contactData.vehicle_number
      this.formData.block_id = contactData.block_id
      this.loadUnit().then(() => {
        this.formData.unit_id = contactData.unit_id
      })
    }
  }

  formData = {
    reason: '',
    block_id: '',
    unit_id: '',
    contact_no: '',
    vehicle_no: '',
    visitor_name: '',
    last_entry_date_time: '', 
    image: '',
    banned_by: '',
  };

}
