import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-unregistered-resident-car',
  templateUrl: './unregistered-resident-car.page.html',
  styleUrls: ['./unregistered-resident-car.page.scss'],
})
export class UnregisteredResidentCarPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService,
    private toastController: ToastController,
    private mainVmsService: MainVmsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadBlock()
  }

  formData = {
    name: '',
    contact_number: '',
    vehicle_number: '',
    block_id: '',
    unit_id: '',
    reason: ''
  }

  onSubmit() {
    let errMsg = ''
    if (!this.formData.name) {
      errMsg += 'Name is missing! \n'
    }
    if (!this.formData.contact_number) {
      errMsg += 'Contact number is missing! \n'
    }
    if (!this.formData.vehicle_number) {
      errMsg += 'Vehicle number is missing! \n'
    }
    if (!this.formData.block_id || !this.formData.unit_id) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if (!this.formData.reason) {
      errMsg += 'Reason must be filled! \n'
    }
    if (errMsg) {
      this.presentToast(errMsg, 'danger');
    } else {
      console.log(this.formData)
      this.mainVmsService.getApi(this.formData, '/vms/post/unregistered_resident_car').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.presentToast('Unregistered car successfully submitted!', 'success');
            this.router.navigate(['/home-vms'])
          } else {
            this.presentToast('An error occurred while submitting unregistered car!', 'danger');
          }
        },
        error: (error) => {
          this.presentToast('An error occurred while submitting unregistered car!', 'danger');
          console.error(error);
        }
      });
    }
  }

  block = ''
  unit = ''

  Block: any
  Unit: any
  Coach: any

  onBlockChange(event: any) {
    this.formData.block_id = event.target.value;
    this.formData.unit_id = ''
    console.log(this.formData.block_id)
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.formData.unit_id = event.target.value;
    console.log(this.formData.unit_id)
  }

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
          this.presentToast('Failed to load vehicle data', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('Error loading vehicle data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  isLoadingUnit = false
  loadUnit() {
    this.isLoadingUnit = true
    this.blockUnitService.getUnit(this.formData.block_id).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
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

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.formData.vehicle_number = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

}
