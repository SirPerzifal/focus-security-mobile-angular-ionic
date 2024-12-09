import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { faMotorcycle, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { VmsServicePickUp } from 'src/app/service/vms/pick_up/pick-up.service';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/vms/user/user.service';

@Component({
  selector: 'app-pick-up-page',
  templateUrl: './pick-up-page.page.html',
  styleUrls: ['./pick-up-page.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class PickUpPagePage implements OnInit {
  @ViewChild('vehicleNumberInput') vehicleNumberInput!: TextInputComponent;
  @ViewChild('locationInput') locationInput!: TextInputComponent;

  faTaxi = faTaxi
  faMotorcycle = faMotorcycle

  response: any;
  // data: Observable<any>

  async testAPI() {
    this.userApi.getMoveData().subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.error('Error:', error);
      }
    );
  
  }

  showPick = false;
  showDrop = false
  showForm = false

  valPhv = false
  valCar = false
  valTaxi = false
  valBike = false

  selectedVehicleType = '';
  entryType = '';

  constructor(
    private vmsService: VmsServicePickUp,
    private toastController: ToastController,
    private userApi: UserService,
    private router: Router
  ) { }

  toggleShowPick() {
    this.showForm = true;
    this.showDrop = false;
    this.showPick = true;
    this.entryType = 'pick_up';
  }

  toggleShowDrop() {
    this.showForm = true;
    this.showPick = false;
    this.showDrop = true;
    this.entryType = 'drop_off';
  }

  useVehicle(val: string) {
    this.valPhv = false
    this.valCar = false
    this.valTaxi = false
    this.valBike = false
    
    switch(val) {
      case 'phv':
        this.valPhv = true;
        this.selectedVehicleType = 'phv_vehicle';
        break;
      case 'car':
        this.valCar = true;
        this.selectedVehicleType = 'private_car';
        break;
      case 'bike':
        this.valBike = true;
        this.selectedVehicleType = 'motorbike';
        break;
      case 'taxi':
        this.valTaxi = true;
        this.selectedVehicleType = 'taxi';
        break;
    }
  }

  vehicleNumber: string = ''; // Tambahkan properti untuk menyimpan nomor kendaraan
  blkLocation: string = ''; // Tambahkan properti untuk menyimpan nomor kendaraan

  // Tambahkan method untuk menangkap perubahan value
  onVehicleNumberChange(value: string) {
    this.vehicleNumber = value;
    console.log('Vehicle Number:', this.vehicleNumber); // Untuk debugging
  }

  onVehicleBlkChange(value: string) {
    this.blkLocation = value;
    console.log('Vehicle Number:', this.blkLocation); // Untuk debugging
  }

  async saveRecord(openBarrier: boolean = false) {
    // Validasi input
    const vehicleNumber = this.vehicleNumber
    const location = this.blkLocation;

    if (!this.selectedVehicleType) {
      this.presentToast('Pilih tipe kendaraan terlebih dahulu', 'danger');
      return;
    }

    if (!vehicleNumber) {
      this.presentToast('Masukkan nomor kendaraan', 'danger');
      console.log(this.vehicleNumberInput.value)
      return;
    }

    if (!location) {
      this.presentToast('Masukkan lokasi', 'danger');
      return;
    }

    try {
      // Gunakan subscribe alih-alih toPromise()
      this.vmsService.addEntry(
        this.entryType, 
        this.selectedVehicleType, 
        vehicleNumber, 
        location
      ).subscribe({
        next: (response) => {
          console.log(response)
          if (response.result.status_code === 200) {
            this.presentToast('Berhasil menyimpan data', 'success');
            
            // Reset form
            this.vehicleNumberInput.value = '';
            this.locationInput.value = '';
            this.selectedVehicleType = '';
            this.resetVehicleSelection();
            
            this.router.navigate(['home-vms'])
            // Tambahkan logika untuk membuka barrier jika openBarrier true
            if (openBarrier) {
              // Implementasi logika membuka barrier
              console.log('Membuka barrier');
              this.presentToast('Berhasil menyimpan data dan Membuka barrier', 'success');
              this.router.navigate(['home-vms'])
            }
          } else {
            this.presentToast('Gagal menyimpan data', 'danger');
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.presentToast('Terjadi kesalahan', 'danger');
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('Terjadi kesalahan tidak terduga', 'danger');
    }
  }

  resetVehicleSelection() {
    this.valPhv = false;
    this.valCar = false;
    this.valTaxi = false;
    this.valBike = false;
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
      if (color == 'success'){
        pingSound.play().catch((err) => console.error('Error playing sound:', err));
      } else {
        errorSound.play().catch((err) => console.error('Error playing sound:', err));
      }
      
    });;;
  }

  ngOnInit() {
  }

  refreshVehicle() {
    console.log("Vehicle Refresh")
  }
}