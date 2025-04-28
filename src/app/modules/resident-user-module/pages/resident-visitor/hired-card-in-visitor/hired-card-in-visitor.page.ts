import { Component, OnInit, OnDestroy } from '@angular/core';
import { faMotorcycle, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { StorageService } from 'src/app/service/storage/storage.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-hired-card-in-visitor',
  templateUrl: './hired-card-in-visitor.page.html',
  styleUrls: ['./hired-card-in-visitor.page.scss'],
})
export class HiredCardInVisitorPage implements OnInit, OnDestroy {

  navButtonsMain: any[] = [
    {
      text: 'Daily Invite',
      active: false,
      action: 'route',
      routeTo: '/visitor-main'
    },
    {
      text: 'Hired Car',
      active: true,
      action: 'route',
      routeTo: '/hired-card-in-visitor'
    },
    {
      text: 'History',
      active: false,
      action: 'route',
      routeTo: '/history-in-visitor'
    },
  ]

  vehicleTypeButtons: any[] = [
    {
      name: 'PHV',
      value: 'phv_vehicle',
      active: true,
      image: 'assets/icon/pick_up-page/Grab_Outline.png',
      icon: '',
      ion_icon: ''
    },{
      name: 'TAXI',
      value: 'taxi',
      active: false,
      image: '',
      icon: 'faTaxi',
      ion_icon: ''
    },{
      name: 'CAR',
      value: 'private_car',
      active: false,
      image: '',
      icon: '',
      ion_icon: 'car-sport-outline'
    },{
      name: 'BIKE',
      value: 'motor_bike',
      active: false,
      image: '',
      icon: 'faMotorcycle',
      ion_icon: ''
    }
  ]
  userType: string = '';

  faTaxi = faTaxi
  faMotorcycle = faMotorcycle

  isLoading: boolean = true;
  textForHiredCarPages = {
    title: '',
    content: []
  }

  formData = {
    entry_type: 'pick_up',
    vehicle_type: 'phv_vehicle',
    vehicle_number: '',
    unit: 0,
    family_id: 0
  }

  projectId: number = 0;

  showPick = true;
  showDrop = false;
  
  agreementChecked: boolean = false; // Status checkbox
  termsAndCOndition: string = '';

  constructor(
    private router: Router,
    private modalController: ModalController,
    private mainApiResidentService: MainApiResidentService,
    public functionMain: FunctionMainService,
    private storage: StorageService
  )  {}

  ngOnInit() {
    this.loaadTextForPage();
    this.formData.vehicle_type = 'phv_vehicle';
  }

  loaadTextForPage() {
    this.isLoading = false;
    this.mainApiResidentService.endpointMainProcess({}, 'get/hired_car_text').subscribe((response) => {
      if (response.result.response_code == 200) {
        this.textForHiredCarPages = {
          title: response.result.response_description.title,
          content: response.result.response_description.content // langsung assign
        };
      } else {
        // this.functionMain.presentToast('Failed to load text for page', 'danger');
      }
    }, (error) => {
      console.error('API error:', error);
      // this.functionMain.presentToast('An error occurred while fetching data', 'danger');
    });
  }

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    // this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    this.router.navigate(['history']);
  }

  toggleShowPick() {
    this.showDrop = false;
    this.showPick = true;
    this.formData.entry_type = 'pick_up'
  }

  toggleShowDrop() {
    this.showPick = false;
    this.showDrop = true;
    this.formData.entry_type = 'drop_off'
  }

  changeVehicleNumber(value: string): void {
    this.formData.vehicle_number = value
  }

  onChangeVehicleType(selectedButton: any) {
    this.vehicleTypeButtons.forEach(button => {
      button.active = (button.value === selectedButton.value); // Set active status
    });
    this.formData.vehicle_type = selectedButton.value; // Update vehicle type
  }

  onSubmit() {
    let errMsg = '';
    if (this.formData.vehicle_number == '') {
      errMsg += 'Please fill the vehicle number!\n';
    }
  
    if (!this.agreementChecked) { // Validasi checkbox
      errMsg += 'You must agree to the terms above!\n';
    }
  
    if (errMsg != '') {
      this.functionMain.presentToast(errMsg, 'danger');
    } else {
      try {
        this.mainApiResidentService.endpointMainProcess({
          entry_type: this.formData.entry_type,
          vehicle_type: this.formData.vehicle_type,
          vehicle_number: this.formData.vehicle_number,
        }, 'post/create_expected_entry').subscribe((response) => {
          if (response.result.response_code == 200) {
            this.functionMain.presentToast('Success Add Record', 'success');
            this.router.navigate(['/visitor-main'], {
              queryParams: {
                openActive: true,
              }
            });
          } else {
            this.functionMain.presentToast('Failed Add Record', 'danger');
          }
        })
      } catch (error) {
        console.error('Unexpected error:', error);
        this.functionMain.presentToast(String(error), 'danger');
      }
    }
  }

  async presentModalAgreement() {
    const modal = await this.modalController.create({
      component: TermsConditionModalComponent,
      cssClass: 'terms-condition-modal',
      componentProps: {
        // email: email
        terms_condition: this.termsAndCOndition
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {

      }
    });

    return await modal.present();
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
