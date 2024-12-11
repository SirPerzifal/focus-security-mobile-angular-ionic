import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { MyVehicleFormService } from 'src/app/service/resident/my-vehicle/my-vehicle-form/my-vehicle-form.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

@Component({
  selector: 'app-my-vehicle-form',
  templateUrl: './my-vehicle-form.page.html',
  styleUrls: ['./my-vehicle-form.page.scss'],
})
export class MyVehicleFormPage implements OnInit {
  // Properti untuk file
  selectedFile: File | null = null;
  uploadedFileBase64: string | null = null;

  // ViewChild references untuk input
  @ViewChild('vehicleNumberInput') vehicleNumberInput!: TextInputComponent;
  @ViewChild('iuNumberInput') iuNumberInput!: TextInputComponent;
  @ViewChild('vehicleColorInput') vehicleColorInput!: TextInputComponent;
  @ViewChild('vehicleLogInput') vehicleLogInput!: ElementRef;
  // @ViewChild('endDateInput') endDateInput!: TextInputComponent;

  // Data untuk dropdown
  vehicleMakes: any[] = [];
  vehicleTypes: any[] = [];
  Block: any[] = [];
  Unit: any[] = [];


  // State untuk form
  selectedTypeOfApplication: string = '';
  selectedVehicleType: string = '';
  selectedVehicleMake: string = '';
  selectedBlock: string = '';
  selectedUnit: string = '';
  selectedTemporaryCarReason: string = '';

  constructor(
    private myVehicleFormService: MyVehicleFormService,
    private blockUnitService: BlockUnitService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVehicleMakeAndType();
    this.loadBlock();
  }

  loadVehicleMakeAndType() {
    this.myVehicleFormService.getVehicleMakeAndType().subscribe({
      next: (response: any) => {
        if (response.result.response_code === 200) {
          this.vehicleMakes = response.result.vehicle_makes;
          this.vehicleTypes = response.result.vehicle_types;
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

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
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

  loadUnit() {
    this.blockUnitService.getUnit(this.selectedBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
        } else {
          this.presentToast('Failed to load unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  // Method untuk menangani pemilihan file
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Konversi file ke base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Hapus prefix data URL jika ada
        const base64 = e.target.result.split(',')[1] || e.target.result;
        this.uploadedFileBase64 = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  // Method untuk mengupload file (opsional, bisa dihapus jika tidak diperlukan)
  uploadFile() {
    if (this.selectedFile) {
      this.presentToast(`File ${this.selectedFile.name} siap diunggah`, 'success');
    } else {
      this.presentToast('Pilih file terlebih dahulu', 'danger');
    }
  }

  onTypeOfApplicationChange(event: any) {
    this.selectedTypeOfApplication = event.target.value;
  }

  onVehicleTypeChange(event: any) {
    this.selectedVehicleType = event.target.value;
  }

  onVehicleMakeChange(event: any) {
    this.selectedVehicleMake = event.target.value;
  }

  onBlockChange(event: any) {
    this.selectedBlock = event.target.value;
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.selectedUnit = event.target.value;
  }

  onTemporaryCarReasonChange(event: any) {
    this.selectedTemporaryCarReason = event.target.value;
  }

  // Tambahkan method baru
  onEndDateChange(event: any) {
    const inputDate = event.target.value;
    // Format date ke YYYY-MM-DD sesuai kebutuhan Odoo
    this.endDate = inputDate; // Simpan dalam format yang benar
  }

  // Tambahkan properti untuk menyimpan tanggal
  endDate: string = '';

  async saveRecord() {
    // Validasi input
    const vehicleNumber = this.vehicleNumberInput.value;
    const iuNumber = this.iuNumberInput.value;
    const vehicleColor = this.vehicleColorInput.value;
    const endDate = this.endDate;
    const company_id = 1;
    const states = 'pending_payment';
    const temporaryCarRequest = this.selectedTemporaryCarReason

    // Validasi file log
    if (!this.uploadedFileBase64) {
      this.presentToast('Unggah dokumen log kendaraan', 'danger');
      return;
    }

    // Validasi field wajib
    if (!this.selectedTypeOfApplication) {
      this.presentToast('Pilih tipe aplikasi', 'danger');
      return;
    }

    if (!vehicleNumber) {
      this.presentToast('Masukkan nomor kendaraan', 'danger');
      return;
    }

    if (!iuNumber) {
      this.presentToast('Masukkan nomor IU', 'danger');
      return;
    }

    if (!this.selectedVehicleType) {
      this.presentToast('Pilih tipe kendaraan', 'danger');
      return;
    }

    if (!this.selectedVehicleMake) {
      this.presentToast('Pilih tipe kendaraan', 'danger');
      return;
    }

    if (!this.selectedBlock) {
      this.presentToast('Pilih tipe kendaraan', 'danger');
      return;
    }

    if (!this.selectedUnit) {
      this.presentToast('Pilih merek kendaraan', 'danger');
      return;
    }

    if (!vehicleColor) {
      this.presentToast('Masukkan warna kendaraan', 'danger');
      return;
    }

    // Tambahkan validasi untuk end date jika temporary vehicle
    if (this.selectedTypeOfApplication === 'temporary_vehicle') {
      if (!this.endDate) {
        this.presentToast('Pilih tanggal berakhir untuk kendaraan sementara', 'danger');
        return;
      }
      if (!this.selectedTemporaryCarReason) {
        this.presentToast('Pilih alasan kendaraan sementara', 'danger');
        return;
      }
    }

    try {
      this.myVehicleFormService.postVehicle(
        vehicleNumber,
        iuNumber,
        this.selectedTypeOfApplication,
        this.selectedVehicleType,
        this.selectedVehicleMake,
        this.selectedBlock,
        this.selectedUnit,
        vehicleColor,
        this.uploadedFileBase64, // Kirim base64
        this.endDate,
        states,
        company_id,
        temporaryCarRequest
      ).subscribe({
        next: (response: any) => {
          if (response.result.response_code === 200) {
            this.presentToast('Berhasil menyimpan data kendaraan', 'success');
            this.router.navigate(['/resident-my-vehicle']);
            this.resetForm();
          } else {
            this.presentToast('Gagal menyimpan data', 'danger');
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
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
    this.vehicleNumberInput.value = '';
    this.iuNumberInput.value = '';
    this.vehicleColorInput.value = '';
    // Reset file
    this.selectedFile = null;
    this.uploadedFileBase64 = null;
    if (this.vehicleLogInput) {
      this.vehicleLogInput.nativeElement.value = '';
    }
    this.endDate = ''; // Reset endDate
    // this.endDateInput.value = '';

    // Reset pilihan
    this.selectedTypeOfApplication = '';
    this.selectedVehicleType = '';
    this.selectedBlock = '';
    this.selectedUnit = '';
    this.selectedVehicleMake = '';
    this.selectedTemporaryCarReason = '';

    // Reset select
    const typeOfApplicationSelect = document.getElementById('type_of_application') as HTMLSelectElement;
    const vehicleTypeSelect = document.getElementById('vehicle_type') as HTMLSelectElement;
    const vehicleMakeSelect = document.getElementById('vehicle_make') as HTMLSelectElement;
    const temporaryCarReasonSelect = document.getElementById('temporary_car_reason') as HTMLSelectElement;

    if (typeOfApplicationSelect) typeOfApplicationSelect.selectedIndex = 0;
    if (vehicleTypeSelect) vehicleTypeSelect.selectedIndex = 0;
    if (vehicleMakeSelect) vehicleMakeSelect.selectedIndex = 0;
    if (temporaryCarReasonSelect) temporaryCarReasonSelect.selectedIndex = 0;
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      if (color === 'success') {
        pingSound.play().catch((err) => console.error('Error playing sound:', err));
      } else {
        errorSound.play().catch((err) => console.error('Error playing sound:', err));
      }
    });
  }
}