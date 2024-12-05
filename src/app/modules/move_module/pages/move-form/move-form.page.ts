import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoveFormService } from 'src/app/service/vms/move_in_out_renovators/move_form/move-form.service';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ToastController, LoadingController } from '@ionic/angular';

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
  unit = '';
  scheduleType = '';
  identificationType = '';

  // Array untuk menyimpan data pax
  paxData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private moveFormService: MoveFormService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    // Ambil parameter dari route
    this.route.queryParams.subscribe(params => {
      this.block = params['block'] || '';
      this.unit = params['unit'] || '';
      this.scheduleType = params['schedule_type'] || 'move_in_out';
  
      // Setel nilai input secara manual
      setTimeout(() => {
        this.setInputValue('block', this.block);
        this.setInputValue('unit', this.unit);
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
      this.paxData.push({
        contractor_name: this.getInputValue(`name_pax_${i}`),
        identification_number: this.getInputValue(`nric_fin_pax_${i}`)
      });
    }
  }

  // Fungsi submit untuk save record & open barrier
  async saveRecordAndOpenBarrier() {
    await this.submitForm(true);
  }

  // Fungsi submit untuk save record only
  async saveRecordOnly() {
    await this.submitForm(false);
  }

  // Fungsi submit umum
  async submitForm(openBarrier: boolean = false) {
    // Tampilkan loading
    const loading = await this.loadingController.create({
      message: 'Saving Record...'
    });
    await loading.present();

    // Pastikan Anda mengumpulkan semua data yang diperlukan
    const subContractors = this.paxData.map(pax => ({
      contractor_name: pax.name,
      identification_number: pax.nric
    }));
  
    this.moveFormService.addSchedule(
      this.getInputValue('contractor_name'),
      this.getInputValue('contractor_contact'),
      this.getInputValue('contractor_company_name'),
      this.getIdentificationType(), // Misalnya 'NRIC', 'Passport', dll
      this.getInputValue('contractor_nric/fin'),
      this.scheduleType, // 'move_in', 'move_out', dll
      this.getInputValue('contractor_vc'), // Nomor kendaraan
      this.getInputValue('block'),
      this.getInputValue('unit'),
      subContractors
    ).subscribe({
      next: (response) => {
        if (response.result.status_code === 200) {
          this.presentToast('Schedule added successfully', 'success');
          loading.dismiss();
          
          if (openBarrier) {
            // Logika membuka barrier
            console.log('Membuka barrier');
            loading.dismiss();
          }
        } else {
          this.presentToast(response.result.status_description, 'danger');
        }
      },
      error: (error) => {
        this.presentToast('Error adding schedule', 'danger');
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
    toast.present();
  }
}