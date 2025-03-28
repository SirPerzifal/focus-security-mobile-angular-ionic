import { Component, OnInit, OnDestroy } from '@angular/core';
import { faMotorcycle, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { trigger, style, animate, transition} from '@angular/animations';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';

import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-hired-car',
  templateUrl: './hired-car.page.html',
  styleUrls: ['./hired-car.page.scss'],
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
export class HiredCarPage implements OnInit, OnDestroy {
  faTaxi = faTaxi
  faMotorcycle = faMotorcycle

  isLoading: boolean = true;
  textForHiredCarPages = {
    title: '',
    content: []
  }

  formData = {
    entry_type: 'pick_up',
    vehicle_type: '',
    vehicle_number: '',
    unit: 0,
    family_id: 0
  }

  projectId: number = 0;
  
  phv_vehicle = true;
  taxi = false;
  private_car = false;
  motor_bike = false
  showPick = true;
  showDrop = false;
  
  agreementChecked: boolean = false; // Status checkbox
  termsAndCOndition: string = '';

  constructor(private router: Router, 
    private toastController: ToastController,
    private modalController: ModalController,
    private mainApiResidentService: MainApiResidentService,
  )  {}

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.formData.unit = Number(parseValue.unit_id);
        this.formData.family_id = Number(parseValue.family_id);
        this.projectId = Number(parseValue.project_id);
        this.loaadTextForPage();
      } 
    })
  }

  loaadTextForPage() {
    this.isLoading = false;
  
    this.mainApiResidentService.endpointProcess(
      { project_id: this.projectId }, 
      'get/hired_car_text'
    ).subscribe((response) => {
      if (response.result.response_code == 200) {
        this.textForHiredCarPages = {
          title: response.result.response_description.title,
          content: response.result.response_description.content // langsung assign
        };
        console.log(this.textForHiredCarPages);
      } else {
        this.presentToast('Failed to load text for page', 'danger');
      }
    }, (error) => {
      console.error('API error:', error);
      this.presentToast('An error occurred while fetching data', 'danger');
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

  usePhvVehicle() {
    this.phv_vehicle = true;
    this.taxi = false;
    this.private_car = false;
    this.motor_bike = false
    this.formData.vehicle_type = 'phv_vehicle'
  }

  useTaxi() {
    this.phv_vehicle = false;
    this.taxi = true;
    this.private_car = false;
    this.motor_bike = false
    this.formData.vehicle_type = 'taxi'
  }

  usePrivateCar() {
    this.phv_vehicle = false;
    this.taxi = false;
    this.private_car = true;
    this.motor_bike = false
    this.formData.vehicle_type = 'private_car'
  }

  useMotorBike() {
    this.phv_vehicle = false;
    this.taxi = false;
    this.private_car = false;
    this.motor_bike = true
    this.formData.vehicle_type = 'motor_bike'
  }

  changeVehicleNumber(value: string): void {
    this.formData.vehicle_number = value
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
      this.presentToast(errMsg, 'danger');
    } else {
      try {
        this.mainApiResidentService.endpointProcess({
          entry_type: this.formData.entry_type,
          vehicle_type: this.formData.vehicle_type,
          vehicle_number: this.formData.vehicle_number,
          unit: this.formData.unit,
          family_id: this.formData.family_id
        }, 'post/create_expected_entry').subscribe((response) => {
          if (response.result.response_code == 200) {
            this.presentToast('Success Add Record', 'success');
            this.router.navigate(['/resident-visitors'], {
              queryParams: {
                openActive: true,
              }
            });
          } else {
            this.presentToast('Failed Add Record', 'danger');
          }
        })
      } catch (error) {
        console.error('Unexpected error:', error);
        this.presentToast(String(error), 'danger');
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

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present().then(() => {
    });;
  }
}
