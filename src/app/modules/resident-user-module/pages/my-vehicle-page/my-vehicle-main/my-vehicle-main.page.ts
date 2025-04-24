import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

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
  selector: 'app-my-vehicle-main',
  templateUrl: './my-vehicle-main.page.html',
  styleUrls: ['./my-vehicle-main.page.scss'],
})
export class MyVehicleMainPage implements OnInit {

  userRole: string = '';

  fromWhere: string = '';
  isLoading: boolean = true;
  pageName: string = '';

  MaximumVehicle: boolean = false;
  vehicles: Vehicle[] = [];

  constructor(
    private mainApi: MainApiResidentService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { from: string };
    if (state) {
      // // console.log(state.from);
      this.fromWhere = state.from
    } 
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadVehicleFromBackend();
  }

  onChangeTypeFamily(event: any) {
    this.userRole = event;
  }

  directTo() {
    if (this.fromWhere === 'profile') {
      this.router.navigate(['/profile-page-main']);
    }
     else {
      this.router.navigate(['/resident-home-page']);
    }
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

  loadVehicleFromBackend() {
    this.mainApi.endpointMainProcess({}, 'get/get_all_vehicle').subscribe((response: any) => {
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
    })
  }

  navigateToAddNewVehicle() {
    // Gunakan NavigationExtras untuk membawa data
    this.router.navigate(['/vehicle-form'], {
      state: {
       maximumVehicle: this.MaximumVehicle
      }
    });
  }

  navigateToVehiclePayment(vehicle: any) {
    this.router.navigate(['/payment-form-vehicle'], {
      state: {
        vehicleId: vehicle.id,
        from: 'main'
      }
    });
  }

  navigateToVehicleDetail(vehicle: Vehicle) {
    // Gunakan NavigationExtras untuk membawa data
    this.router.navigate(['/my-vehicle-detail'], {
      state: {
        vehicleData: vehicle
      }
    });
  }

}
