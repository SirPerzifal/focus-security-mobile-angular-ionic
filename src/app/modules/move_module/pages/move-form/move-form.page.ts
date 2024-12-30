import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoveFormService } from 'src/app/service/vms/move_in_out_renovators/move_form/move-form.service';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-move-form',
  templateUrl: './move-form.page.html',
  styleUrls: ['./move-form.page.scss'],
})
export class MoveFormPage implements OnInit {
  @ViewChildren('textInput') textInputs!: QueryList<TextInputComponent>;

  maxPax = 10;
  paxCount = 1;
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
    private router: Router
  ) {}

  ngOnInit() {
    // Ambil parameter dari route
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.block = params['block'] || '';
      this.unit = params['unit'] || '';
      this.block_id = params['block_id'] || '';
      this.unit_id = params['unit_id'] || '';
      this.scheduleType = params['schedule_type'] || 'move_in_out';
  
      // Setel nilai input secara manual
      setTimeout(() => {
        this.setInputValue('block', this.block);
        this.setInputValue('unit', this.unit);
        this.setInputValue('block_id', this.block_id);
        this.setInputValue('unit_id', this.unit_id);
      });
    });
  }

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

  // Fungsi submit umum
  submitForm(openBarrier: boolean = false) {
    // Tampilkan loading
    // const loading = await this.loadingController.create({
    //   message: 'Saving Record...'
    // });
    // await loading.present();

    // Kumpulkan data pax sebelum menggunakan subContractors
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
  
    this.moveFormService.addSchedule(
      this.getInputValue('contractor_name'),
      this.getInputValue('contractor_contact'),
      this.getInputValue('contractor_company_name'),
      this.identificationType, // Misalnya 'NRIC', 'Passport', dll
      this.getInputValue('contractor_nric/fin'),
      this.scheduleType == 'move_in' ? 'move_in_out' : 'renovation', // 'move_in', 'move_out', dll
      this.getInputValue('contractor_vc'), // Nomor kendaraan
      this.block_id,
      this.unit_id,
      subContractors
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
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.vehicle_number = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

  onBackHome() {
    this.router.navigate(['move-home'], {queryParams: {type: this.scheduleType}})
  }
}