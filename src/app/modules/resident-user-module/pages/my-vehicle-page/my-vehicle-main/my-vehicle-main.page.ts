import { Component, OnInit, ViewChild, ComponentRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

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
  isPrimary: string;
  endDateForTemporaryPass: string;
}

interface VehicleDetail {
  unit_id: string;
  id: 0;
  type_application: string;
  status: string;
  vehicleNo: string;
  make: string;
  colour: string;
  type: string;
  fees: string;
  endDateForTemporaryPass: string;
}

@Component({
  selector: 'app-my-vehicle-main',
  templateUrl: './my-vehicle-main.page.html',
  styleUrls: ['./my-vehicle-main.page.scss'],
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
export class MyVehicleMainPage implements OnInit {

  userRole: string = '';
  userType: string = '';

  fromWhere: string = '';
  isLoading: boolean = true;
  pageName: string = '';

  MaximumVehicle: boolean = false;
  vehicles: Vehicle[] = [];

  vehicleDetail: VehicleDetail | null = null;
  @ViewChild('extensionRequestModal') extensionRequestModal!: ComponentRef<Component>;
  dateNow: string = '';
  isExtensionRequestModal: boolean = false;
  selectedDate: string = '';
  formData = {
    vehicleId: 0,
    dateForExtensionRequest: ''
  }

  constructor(
    private mainApi: MainApiResidentService,
    private router: Router,
    private alertController: AlertController,
    public functionMain: FunctionMainService
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

  onChangeUserType(event: any) {
    this.userType = event;
    if (this.userType === 'industrial') {
      this.fieldOfVehicle = [
        'Vehicle Number', 
        'Vehicle Make', 
        'Vehicle Colour', 
        'Vehicle Type',
      ]
    }
  }

  directTo() {
    if (this.fromWhere === 'profile') {
      this.router.navigate(['/profile-page-main']);
    } else if (this.pageName === 'Vehicle Detail') {
      this.pageName = ''
      this.vehicleDetail = null
    } else {
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

  fieldOfVehicle: string[] = [
    'Vehicle Number', 
    'Vehicle Make', 
    'Vehicle Colour', 
    'Vehicle Type', 
    'Fees'
  ]

  loadVehicleFromBackend() {
    this.vehicles = []
    this.isLoading = true;
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
          isPrimary:vehicle.is_primary_vehicle,
          endDateForTemporaryPass: vehicle.end_date_for_temporary_pass
        }));
        this.MaximumVehicle = response.result.response_result.exceeded_max;
        this.isLoading = false
      } else {
        // this.presentToast('Data fetched failed!', 'danger');
        console.error('Error fetching vehicle details:', response);
        console.error('Error fetching vehicle details result:', response.result);
        this.isLoading = false
      }
    }, (error) => {
      // this.presentToast('Data fetched failed!', 'danger');
      console.error('Error fetching vehicle details:', error);
      console.error('Error fetching vehicle details result:', error);
      this.isLoading = false
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
        vehicleId: vehicle,
        from: 'main'
      }
    });
  }

  navigateToVehicleDetail(vehicle: any) {
    // // Gunakan NavigationExtras untuk membawa data
    // this.router.navigate(['/my-vehicle-detail'], {
    //   state: {
    //     vehicleData: vehicle
    //   }
    // });
    this.pageName = 'Vehicle Detail';
    this.getTodayDate();
    this.vehicleDetail = vehicle as VehicleDetail;
  }

  getTodayDate() {
    const today = new Date();
    const string = today.toString;
    const final = String(today);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    this.dateNow = `${yyyy}-${mm}-${dd}`; // Format yyyy-mm-dd
  }

  public async deleteVehicle(
    header: string = 'Cancel', 
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel', 
    vehicleId?: number  // Jadikan optional
  ) {
    // console.log(vehicleId)
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: header,
      message: 'Are you sure you want to delete this vehicle?', // Tambahkan pesan konfirmasi
      buttons: [
        {
          text: confirmText,
          cssClass: 'confirm-button',
          handler: () => {
            // console.log('Confirmed');
            // Logika konfirmasi
            if (vehicleId) {
              this.mainApi.endpointMainProcess({
                vehicle_id: vehicleId
              }, 'post/delete_vehicle').subscribe((response: any) => {
                if (response.result.response_code === 200) {
                  // console.log("Vehicle deleted successfully", response);
                  this.directTo();
                  this.loadVehicleFromBackend();
                } else {
                  console.error('Error deleting vehicle:', response);
                  // Tampilkan pesan kesalahan kepada pengguna
                }
              })
            } else {
              console.error('Vehicle ID is not provided');
              // Tampilkan pesan kesalahan kepada pengguna
            }
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
            // console.log('Canceled');
          }
        },
      ]
    });
  
    await alert.present();
  }

  isExtensionRequestDateChange(event: any) {
    const date = new Date(event);
    this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
    const [ dayStart, monthStart, yearStart ] = this.selectedDate.split('/');
    const setDefaultValueDateStart = `${yearStart}-${monthStart}-${dayStart}`
    this.formData.dateForExtensionRequest = setDefaultValueDateStart;
  } 

  submitRequest() {
    this.isExtensionRequestModal = false;
    const dateInput = this.formData.dateForExtensionRequest; // Ambil nilai dari input tanggal
    this.mainApi.endpointProcess({
      vehicle_id: this.formData.vehicleId,
      extension_date: this.formData.dateForExtensionRequest || dateInput
    }, 'post/vehicle_request_for_extension').subscribe((response: any) => {
      this.closeModal();
      this.pageName = '';
      this.loadVehicleFromBackend();
      this.vehicleDetail = null;
    })
  }

  reqForupdate(vehicleId: number) {
    this.pageName = '';
    this.router.navigate(['/vehicle-form'], {
      state: {
        vehicleId: vehicleId,
      }
    });
  }

  closeModal() {
    this.loadVehicleFromBackend();
    this.selectedDate = ''
    this.formData = {
      vehicleId: 0,
      dateForExtensionRequest: ''
    }
  }

  async requestForExtension(vehicleId: number) {
    this.formData.vehicleId = vehicleId;
    this.isExtensionRequestModal = true; // Set modal menjadi terbuka
  }

  // Method untuk mendapatkan label status
  getStatusLabel(): { text: string, color: string } {
    switch (this.vehicleDetail?.status.toLowerCase()) {
      case 'approved':
        return { text: 'Approved', color: 'text-green-500' };
      case 'pending_approval':
        return { text: 'Pending Approval', color: 'text-blue-500' };
      case 'pending_payment':
        return { text: 'Pending Payment', color: 'text-blue-500' };
      default:
        return { text: 'Unknown', color: 'text-gray-500' };
    }
  }

}
