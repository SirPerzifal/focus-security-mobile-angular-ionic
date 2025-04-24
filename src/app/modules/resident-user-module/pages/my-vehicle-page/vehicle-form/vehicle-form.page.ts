import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.page.html',
  styleUrls: ['./vehicle-form.page.scss'],
})
export class VehicleFormPage implements OnInit {

  selectedNameVehicleLog: string = '';
  selectedDate: string = '';
  minDate: string = ''; // Set tanggal minimum saat inisialisasi
  maximumVehicle: boolean = false;
  valueForSelect: any[] = [
    {
      value: 'primary_vehicle',
      text: 'Permanent Vehicle'
    },
    {
      value: 'temporary_vehicle',
      text: 'Temporary Vehicle'
    }
  ]
  FamilyMember: any[] = [];
  vehicleMakes: any[] = [];
  vehicleTypes: any[] = [];

  vehicleForm = {
    vehicleNumber: '',
    iuNumber: '',
    typeOfApplication: '',
    typeOfVehicle: '',
    vehicleMake: '',
    vehicleColour: '',
    vehicleLog: '',
    isFirstVehicle: false,
    primaryVehicle: 'false',
    ownedBy: '',
  }
  additionalTemporary = {
    temporaryCarRequest: '',
    endDate: '',
  }

  constructor(
    private router: Router,
    private mainApi: MainApiResidentService,
    public functionMain: FunctionMainService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { maximumVehicle: boolean };
    if (state) {
      // // console.log(state.from)
      this.maximumVehicle = state.maximumVehicle;
      if (this.maximumVehicle) {
        this.valueForSelect = [
          {
            value: 'primary_vehicle',
            text: 'Permanent Vehicle'
          },
        ]
      }
    } 
  }

  ngOnInit() {
    this.loadFamilyMember();
    this.loadVehicleMakeAndType();
    this.getTodayDate();
  }

  getTodayDate() {
    const today = new Date();
    const string = today.toString;
    const final = String(today);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    this.minDate = `${yyyy}-${mm}-${dd}`; // Format yyyy-mm-dd
  }

  onValueChange(event: any, type: string) {
    if (type === 'select_type_resident') {
      this.vehicleForm.typeOfApplication = event.target.value;
    } else if (type === 'owned_vehicle') {
      this.vehicleForm.ownedBy = event.target.value;
    } else if (type === 'vehicle_number') {
      this.vehicleForm.vehicleNumber = event
    } else if (type === 'iu_number') {
      this.vehicleForm.iuNumber = event
    } else if (type === 'type_vehicle') {
      this.vehicleForm.typeOfVehicle = event.target.value;
    } else if (type === 'make_vehicle') {
      this.vehicleForm.vehicleMake = event.target.value;
    } else if (type === 'vehicle_colour') {
      this.vehicleForm.vehicleColour = event;
    } else if (type === 'vehicle_log') {
      let data = event.target.files[0];
      if (data) {
        this.selectedNameVehicleLog = data.name; // Store the selected file name
        this.convertToBase64(data).then((base64: string) => {
          // console.log('Base64 successed');
          this.vehicleForm.vehicleLog = base64.split(',')[1]; // Update the form control for image file
        }).catch(error => {
          console.error('Error converting to base64', error);
        });
      } else {
        this.selectedNameVehicleLog = ''; // Reset if no file is selected
      }
    } else if (type === 'temporary_reason') {
      this.additionalTemporary.temporaryCarRequest = event.target.value;
    } else if (type === 'temporary_vehicle_end_date') {
      const date = new Date(event);
      this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      this.additionalTemporary.endDate = event;
    }
  }

  loadFamilyMember() {
    this.mainApi.endpointMainProcess({}, 'get/family_member_data').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        this.FamilyMember = response.result.family_data;
      } else {
        // this.presentToast('Failed to load vehicle data', 'danger');
        // console.log("gaada data");
        
      }
    })
  }

  loadVehicleMakeAndType() {
    this.mainApi.endpointMainProcess({}, 'get/get_car_make_and_type').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        // console.log(response.result)
        this.vehicleMakes = response.result.vehicle_makes;
        this.vehicleTypes = response.result.vehicle_types;
      } else {
      }
    })
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  saveRecord() {
    console.log(this.vehicleForm, this.additionalTemporary);
    try {
      this.mainApi.endpointMainProcess({
        vehicle_number: this.vehicleForm.vehicleNumber,
        IU_number: this.vehicleForm.iuNumber,
        type_of_application: this.vehicleForm.typeOfApplication,
        vehicle_type: this.vehicleForm.typeOfVehicle,
        vehicle_make: this.vehicleForm.vehicleMake,
        vehicle_color: this.vehicleForm.vehicleColour,
        vehicle_log_filename: this.selectedNameVehicleLog,
        vehicle_log: this.vehicleForm.vehicleLog,
        is_first_vehicle: this.vehicleForm.isFirstVehicle,
        end_date_for_temporary_pass: this.vehicleForm.typeOfApplication === 'temporary_vehicle' ? this.additionalTemporary.endDate : null,
        temporary_car_request: this.vehicleForm.typeOfApplication === 'temporary_vehicle' ? this.additionalTemporary.temporaryCarRequest : null
      }, 'post/post_vehicle').subscribe((response: any) => {
        if (response.result.response_code === 200) {
          this.router.navigate(['/payment-form-vehicle'], {
            state: {
              vehicleId: response.result.vehicle_id,
              from: 'add'
            }
          });
          // this.resetForm();
        } else {
          this.functionMain.presentToast('Failed', 'danger');
          console.error('Error:', response.result.message);
        }
      })
    } catch (error) {
      console.error('Unexpected error:', error);
      this.functionMain.presentToast('There was an error', 'danger');
    }
  }

}
