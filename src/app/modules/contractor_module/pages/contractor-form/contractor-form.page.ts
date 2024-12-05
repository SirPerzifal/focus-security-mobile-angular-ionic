import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ContractorsService } from 'src/app/service/vms/contrantors/contractors.service';
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

  constructor(
    private contractorService: ContractorsService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  onIdentificationTypeChange(event: any) {
    this.identificationType = event.target.value;
    console.log(this.identificationType)
  }

  onBlockChange(event: any) {
    this.selectedBlock = event.target.value;
    console.log(this.selectedBlock)
  }

  onUnitChange(event: any) {
    this.selectedUnit = event.target.value;
    console.log(this.selectedUnit)
  }

  async saveRecord(openBarrier: boolean = false) {
    // Validasi input
    const contractorName = this.contractorNameInput.value;
    const contractorContactNo = this.contractorContactNumberInput.value;
    const identificationNumber = this.contractorIdentificationNumberInput.value;
    const contractorVehicle = this.contractorVehicleNumberInput.value;
    const companyName = this.contractorCompanyNameInput.value;
    const remarks = this.remarksInput.value;

    // Validasi field wajib
    if (!contractorName) {
      this.presentToast('Masukkan nama contractor', 'danger');
      return;
    }

    if (!contractorContactNo) {
      this.presentToast('Masukkan nomor kontak', 'danger');
      return;
    }

    if (!this.identificationType) {
      this.presentToast('Pilih tipe identifikasi', 'danger');
      return;
    }

    if (!identificationNumber) {
      this.presentToast('Masukkan nomor identifikasi', 'danger');
      return;
    }

    if (!this.selectedBlock) {
      this.presentToast('Pilih block', 'danger');
      return;
    }

    if (!this.selectedUnit) {
      this.presentToast('Pilih unit', 'danger');
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
        remarks
      ).subscribe({
        next: (response: any) => {
          if (response.result.status_code === 200) {
            this.presentToast('Berhasil menyimpan data contractor', 'success');
            
            // Reset form
            this.resetForm();

            // Tambahkan logika untuk membuka barrier jika openBarrier true
            if (openBarrier) {
              console.log('Membuka barrier');
            }
          } else {
            this.presentToast('Gagal menyimpan data', 'danger');
          }
        },
        error: (error) => {
          console.error('Error:', error.result.status_description);
          this.presentToast('Terjadi kesalahan', 'danger');
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('Terjadi kesalahan tidak terduga', 'danger');
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
    toast.present();
  }
}