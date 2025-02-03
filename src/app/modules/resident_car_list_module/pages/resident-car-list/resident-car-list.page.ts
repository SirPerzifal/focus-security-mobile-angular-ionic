import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ModalController, ToastController } from '@ionic/angular';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { OvernightParkingModalPage } from 'src/app/modules/overnight_parking_list_module/pages/overnight-parking-modal/overnight-parking-modal.page';

@Component({
  selector: 'app-resident-car-list',
  templateUrl: './resident-car-list.page.html',
  styleUrls: ['./resident-car-list.page.scss'],
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
export class ResidentCarListPage implements OnInit {

  constructor(
    private toastController: ToastController,
    private mainVmsService: MainVmsService,
    private functionMain: FunctionMainService,
    private modalController: ModalController,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  searchType: string = '';
  vehicle: any
  showSearch: boolean = true;
  showList: boolean = false;
  showWarning: boolean = false;
  showClamp: boolean = false;


  isButtonPressed = false;
  selectedReason: string = '';
  imageWarningInput: string = '';
  imageBeforeClampInput: string = '';
  imageAfterClampInput: string = '';
  canNricConfirm: boolean = false;
  showType = ''

  vehicleNumber = ''
  toggleShowSearch() {
    if (this.vehicleNumber){
      this.mainVmsService.getApi({vehicle_number: this.vehicleNumber}, '/vms/get/search_vehicle' ).subscribe({
        next: (results) => {
          if (results.result.response_code === 200) {
            this.showList = false;
            this.vehicle = results.result.result[0]
            console.log(this.vehicle);
            this.returnShowType()
            console.log(this.showType);
            
            setTimeout(() => {
            this.showList = true;
            }, 300)
            
          } else {
            this.functionMain.presentToast(results.result.error, 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while searching vehicle records!', 'danger');
          console.error(error);
        }
      });
      
    }
    
  }

  ngOnInit() {
  }

  returnShowType() {
    if (this.vehicle.offence_type == 'first_warning'){
      this.showType = 'First Warning'
    } else if (this.vehicle.offence_type == 'second_warning') {
      this.showType = 'Second Warning'
    } else if (this.vehicle.offence_type == 'wheel_clamp') {
      this.showType = 'Wheel Clamp'
    } else {
      this.showType = 'No Issue'
    }
    // this.changeDetectorRef.detectChanges()
  }

  async presentModal(issue: string= 'wheel_clamp', vehicle: any = this.vehicle) {
    const modal = await this.modalController.create({
      component: OvernightParkingModalPage,
      cssClass: issue == 'wheel_clamp' ? 'record-modal' : 'record-modal-notice',
      componentProps: {
        issue: issue,
        vehicle: vehicle,
        search: true
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if(result.data){
          console.log("SUCCEED")
        }
      }
    });

    return await modal.present();
  }


}
