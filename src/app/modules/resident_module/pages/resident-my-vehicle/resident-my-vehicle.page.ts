import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MyVehicleService } from 'src/app/service/resident/my-vehicle/my-vehicle.service';

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
}

@Component({
  selector: 'app-resident-my-vehicle',
  templateUrl: './resident-my-vehicle.page.html',
  styleUrls: ['./resident-my-vehicle.page.scss'],
})
export class ResidentMyVehiclePage implements OnInit {
  userRole: string = 'household';

  MaximumVehicle: boolean = false;
  vehicles: Vehicle[] = [];

  constructor(private myVehicleService: MyVehicleService, private toast: ToastController, private router: Router) { }

  ngOnInit() {
    this.loadVehicleDetails(); // Replace with the actual unit ID you want to fetch
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

  loadVehicleDetails() {
    const unitId = 1; // Ganti dengan unit_id yang sesuai
    this.myVehicleService.getVehicleDetail(unitId).subscribe(
      response => {
        if (response.result.response_code === 200) {
          this.vehicles = response.result.response_result.vehicles.map((vehicle: any) => ({
            unit_id: String(vehicle.id), // Pastikan id ada di dalam data
            id: vehicle.vehicle_number,
            status: vehicle.states, // Assuming states represent the status
            type_application: vehicle.type_of_application,
            vehicleNo: vehicle.vehicle_number,
            make: vehicle.vehicle_make,
            colour: vehicle.vehicle_color || '-',
            type: vehicle.vehicle_type,
            fees: 'S$0.00' // Anda dapat menyesuaikan ini berdasarkan logika Anda
          }));
          this.MaximumVehicle = response.result.response_result.exceeded_max;          ;
          // this.presentToast('Data fetched successfully!', 'success');
          console.log("heres the data", response);
        } else {
          // this.presentToast('Data fetched failed!', 'danger');
          console.error('Error fetching vehicle details:', response);
          console.error('Error fetching vehicle details result:', response.result);
        }
      },
      error => {
        this.presentToast('Data fetched failed!', 'danger');
        console.error('HTTP Error:', error);
      }
    );
  }

  getVehicleValue(vehicle: Vehicle, field: string): string {
    const fieldMap: { [key: string]: keyof Vehicle } = {
      'vehicle no': 'vehicleNo',
      'make': 'make',
      'colour': 'colour',
      'vehicle type': 'type',
      'fees': 'fees'
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