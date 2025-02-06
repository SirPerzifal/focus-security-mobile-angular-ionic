import { Component, OnInit, ViewChild, QueryList, ViewChildren  } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ContractorsService } from 'src/app/service/vms/contrantors/contractors.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
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
  @ViewChildren('textInput') textInputs!: QueryList<TextInputComponent>;

  identificationType: string = '';
  maxPax = 10;
  paxCount = 1;
  selectedBlock: string = '';
  selectedUnit: string = '';

  Block: any[] = [];
  Unit: any[] = [];

  // Array untuk menyimpan data pax
  paxData: any[] = [];

  constructor(
    private contractorService: ContractorsService,
    private toastController: ToastController,
    private router: Router,
    private blockUnitService: BlockUnitService,
    private functionMain: FunctionMainService
  ) { }

  // Ambil nilai dari input
  getInputValue(id: string): string {
    const input = this.textInputs.find(input => input.id === id);
    return input ? input.value : '';
  }

  // Update jumlah pax
  onPaxCountChange(event: any) {
    this.paxCount = parseInt(event.target.value, 10);
    // Reset pax data
    this.paxData = Array.from({ length: this.paxCount }, () => ({ contractor_name: '', identification_number: '' }));
    this.collectPaxData();
  }
  
  collectPaxData() {
    this.paxData = [];
    for (let i = 0; i < this.paxCount; i++) {
      const name = this.getInputValue(`contractor_name_pax_${i}`);
      const nric = this.getInputValue(`contractor_nric_fin_pax_${i}`);
      
      // Validasi input
      if (name && nric) {
        this.paxData.push({
          contractor_name: name,
          identification_number: nric
        });
      }
    }
  }

  ngOnInit() {
    this.loadBlock();
    this.paxData = Array.from({ length: this.maxPax }, () => ({ contractor_name: '', identification_number: '' }));
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
    const identificationNumber = this.nric_value;
    const contractorVehicle = this.contractorVehicleNumberInput.value;
    const companyName = this.contractorCompanyNameInput.value;
    const remarks = this.remarksInput.value;

    if (!contractorName) {
      errMsg += 'Contractor name is required! \n'
    }
    if (!contractorContactNo) {
      errMsg += 'Contact number is required! \n'
    }
    if (!this.identificationType) {
      errMsg += 'Identification type must be selected! \n'
    }
    if (!identificationNumber) {
      errMsg += 'Identification number is required! \n'
    }
    if (!this.selectedBlock || !this.selectedUnit) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if (errMsg) {
      this.presentToast(errMsg, 'danger')
      return
    }

    this.collectPaxData();

    const subContractors = this.paxData.map(pax => ({
      contractor_name: pax.contractor_name, // Pastikan ini sesuai dengan nama property yang benar
      identification_number: pax.identification_number // Pastikan ini sesuai dengan nama property yang benar
    }));

    console.log("subcon", subContractors);
    console.log("paxdata", this.paxData);

    if (!subContractors.length) {      
      console.log("No subcontractors found");
      return;
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
        remarks,
        subContractors
      ).subscribe({
        next: (response: any) => {
          if (response.result.status_code === 200) {
            if (openBarrier) {
              this.presentToast('Contractor data has been successfully saved, and the barrier is now open!', 'success');
              this.router.navigate(['home-vms'])
            } else {
              this.presentToast('Contractor data has been successfully saved to the system!', 'success');
            } 
            this.router.navigate(['home-vms'])
            this.resetForm();
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

  getContactInfo(contactData: any) {
    if (contactData) {
      this.formData.contractor_name = contactData.visitor_name
      this.formData.contractor_vehicle = contactData.vehicle_number
      this.selectedBlock = contactData.block_id
      this.loadUnit().then(() => {
        this.selectedUnit = contactData.unit_id
      })
    }
  }

  nric_value = ''
  onNricInput(event: any) {
    this.nric_value = this.functionMain.nricChange(event.target.value)
  }
}