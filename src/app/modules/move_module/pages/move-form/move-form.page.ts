import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoveFormService } from 'src/app/service/vms/move_in_out_renovators/move_form/move-form.service';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-move-form',
  templateUrl: './move-form.page.html',
  styleUrls: ['./move-form.page.scss'],
})
export class MoveFormPage implements OnInit {
  @ViewChildren('textInput') textInputs!: QueryList<TextInputComponent>;

  maxPax = 10;
  paxCount = 0;
  block = '';
  block_id = '1';
  unit_id = '1';
  unit = '';
  scheduleType = '';
  identificationType = '';

  // Array untuk menyimpan data pax
  paxData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private moveFormService: MoveFormService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private functionMain: FunctionMainService,
    private mainVmsService: MainVmsService
  ) {}

  ngOnInit() {
    // Ambil parameter dari route
    this.loadProjectName().then(() => {
      this.refreshVehicle()
    })
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.block = params['block'] || '';
      this.unit = params['unit'] || '';
      this.block_id = params['block_id'] || '';
      this.unit_id = params['unit_id'] || '';
      this.scheduleType = params['schedule_type'] || 'move_in_out';
      this.requestor_id = params['requestor_id'] || ''
  
      // Setel nilai input secara manual
      setTimeout(() => {
        this.setInputValue('block', this.block);
        this.setInputValue('unit', this.unit);
        this.setInputValue('block_id', this.block_id);
        this.setInputValue('unit_id', this.unit_id);
      });
    });
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.Camera = value.config.lpr
    })
  }

  project_id = 0
  Camera: any = []

  requestor_id = ''

  // Metode baru untuk mengatur nilai input
  setInputValue(id: string, value: string) {
    const input = this.textInputs.find(input => input.id === id);
    if (input) {
      input.value = value;
    }
  }

  // Update jumlah pax
  onPaxCountChange(event: any) {
    this.paxCount = parseInt(event.target.value, 10);
    // Reset pax data
    this.paxData = [];
    // Kumpulkan data pax setelah mengubah paxCount
    this.collectPaxData();
  }

  // Ambil nilai dari input
  getInputValue(id: string): string {
    const input = this.textInputs.find(input => input.id === id);
    return input ? input.value : '';
  }

  // Ambil nilai radio button
  getIdentificationType(): string {
    const nricRadio = document.getElementById('nric_identification') as HTMLInputElement;
    const finRadio = document.getElementById('fin_identification') as HTMLInputElement;

    if (nricRadio.checked) return 'nric';
    if (finRadio.checked) return 'fin';
    return '';
  }

  // Kumpulkan data pax
  collectPaxData() {
    this.paxData = [];
    for (let i = 0; i < this.paxCount; i++) {
      const name = this.getInputValue(`name_pax_${i}`);
      const nric = this.getInputValue(`nric_fin_pax_${i}`);
      console.log(`Pax ${i}: Name = ${name}, NRIC = ${nric}`); // Tambahkan log ini
      this.paxData.push({
        contractor_name: name,
        identification_number: nric
      });
    }
  }

  checkPaxData(): boolean {
    for (let i = 0; i < this.paxCount; i++) {
      console.log(i)
      const name = this.getInputValue(`name_pax_${i}`);
      const nric = this.getInputValue(`nric_fin_pax_${i}`);
      console.log(name, nric)
      if (name && nric) {
        
      } else {
        return true
      }
    }
    return false
  }

  // Fungsi submit untuk SAVE RECORD & OPEN BARRIER
  saveRecordAndOpenBarrier() {
    this.submitForm(true);
  }

  // Fungsi submit untuk save record only
  saveRecordOnly() {
    this.submitForm(false);
  }

  onIdentificationTypeChange(event: any) {
    this.identificationType = event.target.value;
    console.log(this.identificationType)
  }

  contact_number = ''
  contractor_name = ''
  company_name = ''

  // Fungsi submit umum
  submitForm(openBarrier: boolean = false, camera_id: string = '') {
    let errMsg = ''
    if (!this.getInputValue('contractor_name')) {
      errMsg += 'Contractor name is required! \n'
    }
    if (!this.contact_number) {
      errMsg += 'Contact number is required! \n'
    }
    if (this.contact_number) {
      if (this.contact_number.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (!this.identificationType) {
      errMsg += 'Identification type must be selected! \n'
    }
    if (!this.nric_value) {
      errMsg += 'Identification number is required! \n'
    }
    if (!this.block_id || !this.unit_id) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if (!this.getInputValue('contractor_company_name')) {
      errMsg += 'Company name is required! \n'
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
  
    this.moveFormService.addSchedule(
      this.getInputValue('contractor_name'),
      this.contact_number,
      this.getInputValue('contractor_company_name'),
      this.identificationType, // Misalnya 'NRIC', 'Passport', dll
      this.nric_value,
      this.scheduleType == 'move_in' ? 'move_in_out' : 'renovation', // 'move_in', 'move_out', dll
      this.getInputValue('contractor_vc'), // Nomor kendaraan
      this.block_id,
      this.unit_id,
      this.requestor_id,
      subContractors,
      this.project_id,
      camera_id
    ).subscribe({
      next: (response) => {
        if (response.result.status_code === 200) {       
          if (openBarrier) {
            // Logika membuka barrier
            this.presentToast('Data has been successfully saved, and the barrier is now open!', 'success');
            this.router.navigate(['move-home'], {queryParams: {type: this.scheduleType}})
          } else {
            this.presentToast('Data has been successfully saved to the system!', 'success');
            this.router.navigate(['move-home'], {queryParams: {type: this.scheduleType}})
          }
        } else {
          this.presentToast(response.result.status_description, 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while attempting to save the data!', 'danger');
        console.error(error);
      }
    });
  }

  // Fungsi untuk menampilkan toast
  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    toast.present().then(() => {
    });
  }

  vehicle_number = ''

  refreshVehicle() {
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    // this.vehicle_number = randomVhc
    // console.log("Vehicle Refresh", randomVhc)
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
    })
  }

  onBackHome() {
    this.router.navigate(['move-home'], {queryParams: {type: this.scheduleType}})
  }

  requestor_name = ''
  requestor_vehicle = ''
  

  getContactInfo(contactData: any){
    if (contactData) {
      this.requestor_name = contactData.visitor_name
      this.requestor_vehicle = contactData.vehicle_number
    }
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  nric_value = ''
  onNricInput(event: any) {
    this.nric_value = this.functionMain.nricChange(event.target.value)
  }

  nricPaxChange(event: any) {
    this.setInputValue(event.target.id, this.functionMain.nricChange(event.target.value))
  }

  paxIdentity: string[] = []
  nameIdentity: string[] = []

  openNricScan(order: number = 0, is_pax: boolean = false) {
    this.functionMain.presentModalNric().then(value => {
      if (value) {
        if (is_pax) {
          this.paxData[order].identification_number = value.data
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
                this.paxData[order].contractor_name = data.contractor_name
              } else {
                console.log(value)
                this.contractor_name = data.contractor_name
                this.company_name = data.company_name
                this.contact_number = data.contact_number
                this.vehicle_number = data.vehicle_number
              } 
            } else {
              if (is_pax) {
                this.paxData[order].contractor_name = this.paxData[order].contractor_name ? this.paxData[order].contractor_name : ''
              } else {
                console.log(value)
                this.contractor_name = this.contractor_name ? this.contractor_name : ''
                this.company_name = this.company_name ? this.company_name : ''
                this.contact_number = this.contact_number ? this.contact_number : '65'
                this.vehicle_number = this.vehicle_number ? this.vehicle_number : ''
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

  faBarcode = faBarcode
}