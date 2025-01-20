import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ContractorsService } from 'src/app/service/vms/contrantors/contractors.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.page.html',
  styleUrls: ['./contractor-form.page.scss'],
})
export class ContractorFormPage implements OnInit {
  @ViewChild('contractorNameInput') contractorNameInput!: TextInputComponent;
  @ViewChild('contractorContactNumberInput') contractorContactNumberInput!: TextInputComponent;
  @ViewChild('contractorIdentificationNumberInput') contractorIdentificationNumberInput!: TextInputComponent;
  @ViewChild('contractorVehicleNumberInput') contractorVehicleNumberInput!: TextInputComponent;
  @ViewChild('contractorCompanyNameInput') contractorCompanyNameInput!: TextInputComponent;
  @ViewChild('remarksInput') remarksInput!: TextInputComponent;

  identificationType: string = '';
  selectedBlock: string = '';
  selectedUnit: string = '';

  Block: any[] = [];
  Unit: any[] = [];

  constructor(
    private contractorService: ContractorsService,
    private toastController: ToastController,
    private router: Router,
    private blockUnitService: BlockUnitService
  ) {}

  ngOnInit() {
    this.loadBlock()
  }

  onIdentificationTypeChange(event: any) {
    this.identificationType = event.target.value;
    console.log(this.identificationType)
  }

  onBlockChange(event: any) {
    this.selectedBlock = event.target.value;
    this.loadUnit()
    console.log(this.selectedBlock)
  }

  onUnitChange(event: any) {
    this.selectedUnit = event.target.value;
    console.log(this.selectedUnit)
  }

  async saveRecord(openBarrier: boolean = false) {
    let errMsg = ''
    // Validasi input
    const contractorName = this.contractorNameInput.value;
    const contractorContactNo = this.contractorContactNumberInput.value;
    const identificationNumber = this.contractorIdentificationNumberInput.value;
    const contractorVehicle = this.contractorVehicleNumberInput.value;
    const companyName = this.contractorCompanyNameInput.value;
    const remarks = this.remarksInput.value;

    // Validasi field wajib
    if (!contractorName) {
      errMsg += 'Contractor name is required! \n'
      // this.presentToast('Vehicle number is required', 'danger');
    }

    if (!contractorContactNo) {
      errMsg += 'Contact number is required! \n'
      // this.presentToast('Masukkan nomor kontak', 'danger');
    }

    if (!this.identificationType) {
      errMsg += 'Identification type must be selected! \n'
      // this.presentToast('Pilih tipe identifikasi', 'danger');
    }

    if (!identificationNumber) {
      errMsg += 'Identification number is required! \n'
      // this.presentToast('Masukkan nomor identifikasi', 'danger');
    }

    if (!this.selectedBlock || !this.selectedUnit) {
      errMsg += 'Block and unit must be selected! \n'
      // this.presentToast('Pilih block', 'danger');
    }

    if (errMsg){
      this.presentToast(errMsg, 'danger')
      return
    }

    try {
      this.contractorService.addContractor(
        contractorName,
        contractorContactNo,
        companyName,
        this.identificationType,
        identificationNumber,
        contractorVehicle,
        this.selectedBlock,
        this.selectedUnit,
        remarks
      ).subscribe({
        next: (response: any) => {
          if (response.result.status_code === 200) {
            this.presentToast('Contractor data has been successfully saved, and the barrier is now open!', 'success');
            this.router.navigate(['home-vms'])

            console.log(this.selectedBlock)
            console.log(this.selectedUnit)
            
            // Reset form
            this.resetForm();

            // Tambahkan logika untuk membuka barrier jika openBarrier true
            if (openBarrier) {
              console.log('Membuka barrier');
              this.presentToast('Contractor data has been successfully saved to the system!', 'success');
              this.router.navigate(['home-vms'])

              console.log(this.selectedBlock)
              console.log(this.selectedUnit)
            }
          } else {
            this.presentToast('An error occurred while attempting to save contractor data', 'danger');
          }
        },
        error: (error) => {
          console.error('Error:', error.result.status_description);
          this.presentToast('An unexpected error has occurred!', 'danger');
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  resetForm() {
    // Reset semua input
    this.contractorNameInput.value = '';
    this.contractorContactNumberInput.value = '';
    this.contractorIdentificationNumberInput.value = '';
    this.contractorVehicleNumberInput.value = '';
    this.contractorCompanyNameInput.value = '';
    this.remarksInput.value = '';
    
    // Reset pilihan
    this.identificationType = '';
    this.selectedBlock = '';
    this.selectedUnit = '';

    // Reset radio button
    const nricRadio = document.getElementById('nric_identification') as HTMLInputElement;
    const finRadio = document.getElementById('fin_identification') as HTMLInputElement;
    if (nricRadio) nricRadio.checked = false;
    if (finRadio) finRadio.checked = false;

    // Reset select
    const blockSelect = document.getElementById('contractor_block') as HTMLSelectElement;
    const unitSelect = document.getElementById('contractor_unit') as HTMLSelectElement;
    if (blockSelect) blockSelect.selectedIndex = 0;
    if (unitSelect) unitSelect.selectedIndex = 0;
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    

    toast.present().then(() => {
      
      
    });
  }

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

  async loadUnit() {
    this.blockUnitService.getUnit(this.selectedBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
        } else {
          this.presentToast('An error occurred while loading unit data!', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading unit data!', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  vehicle_number = ''

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.contractorVehicleNumberInput.value = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

  formData = {
    contractor_name: '',
    contractor_vehicle: '',
  };

  getContactInfo(contactData: any){
    if (contactData) {
      this.formData.contractor_name = contactData.visitor_name
      this.formData.contractor_vehicle = contactData.vehicle_number
      this.selectedBlock = contactData.block_id
      this.loadUnit().then(() => {
        this.selectedUnit = contactData.unit_id
      })
    }
  }
}