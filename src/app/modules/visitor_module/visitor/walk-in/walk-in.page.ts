import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { VisitorService } from 'src/app/service/vms/visitor/visitor.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-walk-in',
  templateUrl: './walk-in.page.html',
  styleUrls: ['./walk-in.page.scss'],
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
export class WalkInPage implements OnInit {

  constructor(private paramsActiveFromCoaches: ActivatedRoute, private visitorService: VisitorService, private toastController: ToastController, private router: Router) { }

  formData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'walk_in',
    visitor_vehicle: '',
    block: 'Block 1',
    unit: 'Unit 1'
  };

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
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
      
    });;
  }

  onSubmitDriveIn(openBarrier: boolean = false) {
    console.log(this.formData)
    console.log(openBarrier)
    let errMsg = ""
    if (!this.formData.visitor_name) {
      errMsg += 'Please insert visitor name!\n';
    }
    if (!this.formData.visitor_contact_no) {
      errMsg += 'Please insert visitor contact number!\n';
    }
    if (!this.formData.visitor_vehicle) {
      errMsg += 'Please insert visitor vehicle number!\n';
    }
    if (!this.formData.block || !this.formData.unit) {
      errMsg += 'Please insert visitor block and unit!\n';
    }
    if (errMsg != "") {
      this.presentToast(errMsg, 'danger')
      return
    }
    try {
      this.visitorService.postAddVisitor(this.formData.visitor_name, this.formData.visitor_contact_no, 'drive_in', this.formData.visitor_vehicle, this.formData.block, this.formData.unit).subscribe(
        res => {
          console.log(res);
          if (res.result.status_code == 200) {
            if (openBarrier){
              console.log("Barrier Opened")
              this.presentToast('Successfully Insert New Drive In Record and Opened the Barrier', 'success');
            }else {
              this.presentToast('Successfully Insert New Drive In Record', 'success');
            }
            
            this.router.navigate(['home-vms'])
          } else {
            this.presentToast('Failed Insert New Drive In Record', 'danger');
          }

        },
        error => {
          console.error('Error Here:', error);
          this.presentToast(String(error), 'danger');
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast(String(error), 'danger');
    }

  }

  onSubmitWalkIn(openBarrier: boolean = false) {
    console.log(openBarrier)
    let errMsg = ""
    if (!this.formData.visitor_name) {
      errMsg += 'Please insert visitor name!\n';
    }
    if (!this.formData.visitor_contact_no) {
      errMsg += 'Please select visitor contact number!\n';
    }
    if (!this.formData.block || !this.formData.unit) {
      errMsg += 'Please insert your block and unit!\n';
    }
    if (errMsg != "") {
      this.presentToast(errMsg, 'danger')
      return
    }
    console.log(this.formData)
    try {
      this.visitorService.postAddVisitor(this.formData.visitor_name, this.formData.visitor_contact_no, 'walk_in', '', this.formData.block, this.formData.unit).subscribe(
        res => {
          console.log(res);
          if (res.result.status_code == 200) {
            if (openBarrier){
              console.log("Barrier Opened")
              this.presentToast('Successfully Insert New Walk In Record and Opened the Barrier', 'success');
            }else {
              this.presentToast('Successfully Insert New Walk In Record', 'success');
            }
            this.router.navigate(['home-vms'])
          } else {
            this.presentToast('Failed Insert New Walk In Record', 'danger');
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

  showWalk = false;
  showDrive = false;
  showQr = false;
  showWalkTrans = false;
  showDriveTrans = false;
  showQrTrans = false;

  toggleShowQr() {
    if (!this.showDriveTrans && !this.showWalkTrans) {
      this.showQrTrans = true
      this.showDrive = false;
      this.showWalk = false;
      setTimeout(() => {
        this.showQr = true;
        this.showQrTrans = false
      }, 300)
    }
  }

  toggleShowWalk() {
    if (!this.showQrTrans && !this.showDriveTrans) {
      this.showWalkTrans = true
      this.showDrive = false;
      this.showQr = false;
      setTimeout(() => {
        this.showWalk = true;
        this.showWalkTrans = false
      }, 300)
    }
  }

  toggleShowDrive() {
    if (!this.showQrTrans && !this.showWalkTrans) {
      this.showDriveTrans = true
      this.showWalk = false;
      this.showQr = false;
      setTimeout(() => {
        this.showDrive = true;
        this.showDriveTrans = false
      }, 300)
    }
  }

  ngOnInit() {
    this.paramsActiveFromCoaches.queryParams.subscribe(params => {
      if (params['showDrive']) {  // Gunakan bracket notation di sini
        this.showDrive = true; // Atur showDrive menjadi true jika parameter ada
      }
    });
  }

  refreshVehicle() {
    console.log("Vehicle Refresh")
  }

}
