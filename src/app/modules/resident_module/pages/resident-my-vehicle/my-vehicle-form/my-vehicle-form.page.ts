import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { MyVehicleFormService } from 'src/app/service/resident/my-vehicle/my-vehicle-form/my-vehicle-form.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-my-vehicle-form',
  templateUrl: './my-vehicle-form.page.html',
  styleUrls: ['./my-vehicle-form.page.scss'],
})
export class MyVehicleFormPage implements OnInit {
  unitId: number = 0;
  dateNow: string = String(new Date());

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
  vehicleColours: any[] = [];
  Block: any[] = [];
  Unit: any[] = [];
  FamilyMember: any[] = [];
  showDate = '';
  projectId: number = 0;
  MaximumVehicle = '';

  // State untuk form
  selectedTypeOfApplication: string = '';
  selectedVehicleType: string = '';
  selectedFamilyMember: string = '';
  selectedVehicleMake: string = '';
  selectedVehicleColour: string = '';
  selectedBlock: string = '';
  selectedUnit: string = '';
  selectedTemporaryCarReason: string = '';
  isFirstVehicle: boolean = false; // Tambahkan ini

  constructor(
    private myVehicleFormService: MyVehicleFormService,
    private blockUnitService: BlockUnitService,
    private toastController: ToastController,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.unitId = Number(estate.unit_id);
            this.projectId = Number(estate.project_id);
            this.selectedBlock = String(estate.block_id)
            this.selectedUnit = String(estate.unit_id)
            this.loadFamilyMember();
            this.loadVehicleMakeAndType();
          }
        })
      }
    })
    
    // Ambil data yang dikirim dari halaman sebelumnya
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.MaximumVehicle = navigation.extras.state['maximumVehicle']; 
    }
  }

  loadFamilyMember() {
    this.myVehicleFormService.getFamily(this.unitId).subscribe({
      next: (response: any) => {
        if (response.result.response_code === 200) {
          this.FamilyMember = response.result.family_data;
        } else {
          // this.presentToast('Failed to load vehicle data', 'danger');
          // console.log("gaada data");
          
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  loadVehicleMakeAndType() {
    this.myVehicleFormService.getVehicleMakeAndType().subscribe({
      next: (response: any) => {
        if (response.result.response_code === 200) {
          // console.log(response.result)
          this.vehicleMakes = response.result.vehicle_makes;
          this.vehicleTypes = response.result.vehicle_types;
          this.vehicleColours = response.result.vehicle_colors;
        } else {
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  selectedVehiclelog: string = '';
  // Method untuk menangani pemilihan file
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVehiclelog = file.name; // Store the selected file name
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

  onTypeOfApplicationChange(event: any) {
    this.selectedTypeOfApplication = event.target.value;
  }

  onVehicleTypeChange(event: any) {
    this.selectedVehicleType = event.target.value;
  }

  onVehicleMakeChange(event: any) {
    this.selectedVehicleMake = event.target.value;
  }

  onFamilyMemberChange(event: any) {
    this.selectedFamilyMember = event.target.value;
  }

  onColourChange(event: any) {
    this.selectedVehicleColour = event.target.value;
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
    const dateParts = this.endDate.split('-');
    this.showDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Format to dd/mm/yyyy
  }

  // Tambahkan properti untuk menyimpan tanggal
  endDate: string = '';

  async saveRecord() {
    // Validasi input
    const vehicleNumber = this.vehicleNumberInput.value;
    const iuNumber = this.iuNumberInput.value;
    const endDate = this.endDate;
    const vehicle_color = this.vehicleColorInput.value;
    const states = 'pending_approval';
    const temporaryCarRequest = this.selectedTemporaryCarReason;

    // Validasi file log
    if (!this.uploadedFileBase64) {
        this.presentToast('Upload your vehicle log', 'danger');
        return;
    }

    // Validasi field wajib
    if (!this.selectedTypeOfApplication) {
        this.presentToast('Choose type of application', 'danger');
        return;
    }

    if (!vehicleNumber) {
        this.presentToast('Input your vehicle number', 'danger');
        return;
    }

    if (!iuNumber) {
        this.presentToast('Input your I.U number', 'danger');
        return;
    }

    if (!this.selectedVehicleType) {
        this.presentToast('Choose your vehicle type', 'danger');
        return;
    }

    if (!this.selectedVehicleMake) {
        this.presentToast('Choose your vehicle make', 'danger');
        return;
    }

    if (!this.selectedBlock) {
        this.presentToast('Choose your block', 'danger');
        return;
    }

    if (!this.selectedUnit) {
        this.presentToast('Choose your unit', 'danger');
        return;
    }

    if (!this.selectedFamilyMember) {
        this.presentToast('Choose your family member', 'danger');
        return;
    }

    // Validasi untuk isFirstVehicle
    // if (this.selectedTypeOfApplication === 'owned_vehicle' && !this.isFirstVehicle) {
    //     this.presentToast('Please confirm if this is the first vehicle', 'danger');
    //     return;
    // }

    // Tambahkan validasi untuk end date jika temporary vehicle
    if (this.selectedTypeOfApplication === 'temporary_vehicle') {
        if (!this.endDate) {
            this.presentToast('Choose end date', 'danger');
            return;
        }
        if (!this.selectedTemporaryCarReason) {
            this.presentToast('Input your reason for temporary vehicle', 'danger');
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
            vehicle_color,
            this.selectedBlock,
            this.selectedFamilyMember,
            this.selectedUnit,
            this.uploadedFileBase64, // Kirim base64
            this.endDate,
            states,
            temporaryCarRequest,
            String(this.isFirstVehicle), // Pastikan ini ada
            this.projectId
        ).subscribe({
            next: (response: any) => {
                if (response.result.response_code === 200) {
                    this.router.navigate(['/my-vehicle-payment-form'], {
                      state: {
                        vehicleId: response.result.vehicle_id
                      }
                    });
                    this.resetForm();
                } else {
                    this.presentToast('Failed', 'danger');
                    console.error('Error:', response.result.message);
                }
            },
            error: (error: any) => {
                console.error('Error:', error);
                this.presentToast('There was an error', 'danger');
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        this.presentToast('There was an error', 'danger');
    }
}

  resetForm() {
    // Reset semua input
    this.vehicleNumberInput.value = '';
    this.iuNumberInput.value = '';
    this.vehicleColorInput.value = '';
    this.showDate = '';
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
    // this.selectedBlock = '';
    // this.selectedUnit = '';
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