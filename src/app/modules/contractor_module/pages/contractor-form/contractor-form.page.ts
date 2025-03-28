import { Component, OnInit, ViewChild, QueryList, ViewChildren  } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ContractorsService } from 'src/app/service/vms/contrantors/contractors.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
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
  paxCount = 0;
  selectedBlock: string = '';
  selectedUnit: string = '';

  faBarcode = faBarcode

  Block: any[] = [];
  Unit: any[] = [];

  // Array untuk menyimpan data pax
  paxData: any[] = [];

  constructor(
    private contractorService: ContractorsService,
    private toastController: ToastController,
    private router: Router,
    private blockUnitService: BlockUnitService,
    private functionMain: FunctionMainService,
    private mainVmsService: MainVmsService,
  ) { }

  // Ambil nilai dari input
  getInputValue(id: string): string {
    const input = this.textInputs.find(input => input.id === id);
    return input ? input.value : '';
  }

  paxIdentity: string[] = []
  nameIdentity: string[] = []

  // Update jumlah pax
  onPaxCountChange(event: any) {
    this.paxCount = parseInt(event.target.value, 10);
    // Reset pax data
    // this.paxData = Array.from({ length: this.paxCount }, () => ({ contractor_name: '', identification_number: '' }));
    this.paxData = [];
    // Kumpulkan data pax setelah mengubah paxCount
    this.collectPaxData();
}
  
  collectPaxData() {
    this.paxData = [];
    for (let i = 0; i < this.paxCount; i++) {
      const name = this.getInputValue(`contractor_name_pax_${i}`);
      const nric = this.getInputValue(`contractor_nric_fin_pax_${i}`);
      console.log(name, nric)
      this.paxData.push({
        contractor_name: name,
        identification_number: nric
      });
    }

    return true
  }

  checkPaxData(): boolean {
    for (let i = 0; i < this.paxCount; i++) {
      console.log(i)
      const name = this.getInputValue(`contractor_name_pax_${i}`);
      const nric = this.getInputValue(`contractor_nric_fin_pax_${i}`);
      console.log(name, nric)
      if (name && nric) {
        
      } else {
        return true
      }
    }
    return false
  }

  nricPaxChange(event: any, i: any) {
     this.paxData[i].identification_number = this.functionMain.nricChange(event.target.value)
  }

  ngOnInit() {
    this.loadProjectName().then(() => {
      this.loadBlock();
      this.refreshVehicle()
    })
    this.paxData = Array.from({ length: this.maxPax }, () => ({ contractor_name: '', identification_number: '' }));
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.Camera = value.config.lpr
    })
  }

  Camera: any = []
  project_id = 0

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
    this.selectedUnit = event[0]
  }

  async saveRecord(openBarrier: boolean = false, camera_id: string = '') {  
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
    if (!companyName) {
      errMsg += 'Company name is required! \n'
    }
    if (!contractorContactNo) {
      errMsg += 'Contact number is required! \n'
    }
    if (contractorContactNo) {
      if (contractorContactNo.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
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
    if (this.checkPaxData()) {
      errMsg += "All names and NRICs of contractor members must be filled in!!"
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
        subContractors,
        this.project_id,
        camera_id
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
          console.error('Error:', error);
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
    this.contactUnit = ''
    
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
    this.selectedUnit = ''
    this.blockUnitService.getUnit(this.selectedBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}));
          console.log(response)
        } else {
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
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    // this.contractorVehicleNumberInput.value = randomVhc
    // console.log("Vehicle Refresh", randomVhc)
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.contractorVehicleNumberInput.value = value.vehicle_number ? value.vehicle_number : ''
    })
  }

  formData = {
    contractor_name: '',
    contractor_vehicle: '',
    company_name: '',
    contact_number: '',
  };

  contactUnit = ''
  getContactInfo(contactData: any) {
    this.contactUnit = ''
    if (contactData) {
      this.formData.contractor_name = contactData.visitor_name
      this.formData.contractor_vehicle = contactData.vehicle_number
      this.selectedBlock = contactData.block_id
      this.loadUnit().then(() => {
        setTimeout(() => {
          this.contactUnit = contactData.unit_id
        }, 300)
      })
    }
  }

  nric_value = ''
  onNricInput(event: any) {
    this.nric_value = this.functionMain.nricChange(event.target.value)
  }

  openNricScan(order: number = 0, is_pax: boolean = false) {
    this.functionMain.presentModalNric().then(value => {
      if (value) {
        if (is_pax) {
          this.paxIdentity[order] = value.data
        } else {
          console.log(value)
          this.identificationType = value.is_fin ? 'fin' : 'nric'
          this.nric_value = value.data;
        } 
        this.mainVmsService.getApi({nric: value.data, project_id: this.project_id}, '/vms/get/contractor_by_nric').subscribe({
          next: (results) => {
            console.log(results)
            if (results.result.status_code === 200) {
              let data = results.result.result[0]
              if (is_pax) {
                this.nameIdentity[order] = data.contractor_name
              } else {
                console.log(value)
                this.formData.contractor_name = data.contractor_name
                this.formData.company_name = data.company_name
                this.formData.contact_number = data.contact_number
                this.formData.contractor_vehicle =  data.vehicle_number
              } 
            } else {
              if (is_pax) {
                this.paxData[order].contractor_name = this.paxData[order].contractor_name ? this.paxData[order].contractor_name : ''
              } else {
                console.log(value)
                this.formData.contractor_name = this.formData.contractor_name ? this.formData.contractor_name : ''
                this.formData.company_name = this.formData.company_name ? this.formData.company_name : ''
                this.formData.contact_number = this.formData.contact_number ? this.formData.contact_number : '65'
                this.formData.contractor_vehicle = this.formData.contractor_vehicle ? this.formData.contractor_vehicle : ''
              } 
              this.functionMain.presentToast(`No data found in the system for ${value.data}!`, 'warning')
            }
          },
          error: (error) => {
            this.presentToast('An error occurred while searching for nric!', 'danger');
            console.error(error);
          }
        });
      }
      
    });
    console.log(this.nric_value)
  }

  
}