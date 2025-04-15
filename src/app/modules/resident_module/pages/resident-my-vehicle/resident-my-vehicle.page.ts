import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/service/storage/storage.service';
import { MyVehicleService } from 'src/app/service/resident/my-vehicle/my-vehicle.service';
import { Estate } from 'src/models/resident/resident.model';

interface Vehicle {
  unit_id: string;
  id: string;
  type_application: string;
  status: string;
  vehicleNo: string;
  make: string;
  colour: string;
  type: string;
  fees: string;
  isPrimary: string
}

@Component({
  selector: 'app-resident-my-vehicle',
  templateUrl: './resident-my-vehicle.page.html',
  styleUrls: ['./resident-my-vehicle.page.scss'],
})
export class ResidentMyVehiclePage implements OnInit {
  userRole: string = 'household';
  unitId: number = 0;
  isLoading: boolean = true;

  MaximumVehicle: boolean = false;
  vehicles: Vehicle[] = [];
  fromWhere: boolean = false; //

  constructor(private myVehicleService: MyVehicleService, private toast: ToastController, private router: Router, private storage: StorageService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { from: any};
    if (state) {
      // console.log(state.from);
      this.fromWhere = true
    } 
  }

  directTo() {
    if (this.fromWhere) {
      this.router.navigate(['/resident-my-profile']);
    } else {
      this.router.navigate(['/resident-homepage']);
    }
  }

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.unitId = Number(estate.unit_id);
            this.loadVehicleDetails();
          }
        })
      }
    })
  }

  ionViewWillEnter() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.unitId = Number(estate.unit_id);
            this.loadVehicleDetails();
          }
        })
      }
    })
  }

  // Method untuk navigasi ke halaman detail
  navigateToVehicleDetail(vehicle: Vehicle) {
    // Gunakan NavigationExtras untuk membawa data
    this.router.navigate(['/my-vehicle-detail'], {
      state: {
        vehicleData: vehicle
      }
    });
  }

  navigateToAddNewVehicle() {
    // Gunakan NavigationExtras untuk membawa data
    this.router.navigate(['/my-vehicle-form'], {
      state: {
       maximumVehicle: this.MaximumVehicle
      }
    });
  }

  navigateToVehiclePayment(vehicle: any) {
    this.router.navigate(['/my-vehicle-payment-form'], {
      state: {
        vehicleId: vehicle.id
      }
    });
  }

  loadVehicleDetails() {
    this.myVehicleService.getVehicleDetail(this.unitId).subscribe(
      response => {
        if (response.result.response_code === 200) {
          this.vehicles = response.result.response_result.vehicles.map((vehicle: any) => ({
            unit_id: String(vehicle.id), // Pastikan id ada di dalam data
            id: vehicle.vehicle_id,
            status: vehicle.states, // Assuming states represent the status
            type_application: vehicle.type_of_application,
            vehicleNo: vehicle.vehicle_number,
            make: vehicle.vehicle_make,
            colour: vehicle.vehicle_color || '-',
            type: vehicle.vehicle_type,
            fees: `S$${vehicle.vehicle_fee}`, // Anda dapat menyesuaikan ini berdasarkan logika Anda
            isPrimary:vehicle.is_primary_vehicle
          }));
          this.MaximumVehicle = response.result.response_result.exceeded_max;          ;
          this.isLoading = false
        } else {
          // this.presentToast('Data fetched failed!', 'danger');
          console.error('Error fetching vehicle details:', response);
          console.error('Error fetching vehicle details result:', response.result);
        }
      },
      error => {
        console.error('HTTP Error:', error);
      }
    );
  }

  getVehicleValue(vehicle: Vehicle, field: string): string {
    const fieldMap: { [key: string]: keyof Vehicle } = {
      'vehicle number': 'vehicleNo',
      'vehicle make': 'make',
      'vehicle colour': 'colour',
      'vehicle type': 'type',
      'fees': 'fees',
      'isPrimary' : 'isPrimary'
    };

    const mappedField = fieldMap[field.toLowerCase()];
    return mappedField ? vehicle[mappedField] : '';
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toast.create({
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
}