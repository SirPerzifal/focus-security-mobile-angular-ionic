import { Component, OnInit } from '@angular/core';
import { faBedPulse, faMotorcycle, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HiredCarService } from 'src/app/service/resident/hired_car/hired-car.service';

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
export class HiredCarPage implements OnInit {
  agreementChecked: boolean = false; // Status checkbox

  constructor(private router: Router, private toastController: ToastController, private hiredCarService: HiredCarService)  {}

  faTaxi = faTaxi
  faMotorcycle = faMotorcycle

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });

    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      
      
    });;
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

  formData = {
    entry_type: 'pick_up',
    vehicle_type: 'phv_vehicle',
    vehicle_number: '',
    unit: 1
  }

  showPick = true;
  showDrop = false

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

  phv_vehicle = true;
  taxi = false;
  private_car = false;
  motor_bike = false

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
    console.log(this.formData);
  
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
        this.hiredCarService.postCreateExpectedVisitors(this.formData).subscribe(
          res => {
            console.log(res);
            if (res.result.response_code == 200) {
              this.presentToast('Success Add Record', 'success');
              this.router.navigate(['/resident-visitors'], {
                queryParams: {
                  openActive: true,
                }
              });
            } else {
              this.presentToast('Failed Add Record', 'danger');
            }
          },
          error => {
            console.error('Error:', error);
          }
        );
      } catch (error) {
        console.error('Unexpected error:', error);
        this.presentToast(String(error), 'danger');
      }
    }
  }

  ngOnInit() {
  }

}
