import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { OvernightParkingModalPage } from 'src/app/modules/overnight_parking_list_module/pages/overnight-parking-modal/overnight-parking-modal.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Ocr, TextDetections} from '@capacitor-community/image-to-text';

import { ActivatedRoute, Router } from '@angular/router';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
// import * as Tesseract from 'tesseract.js';

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
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private modalController: ModalController,
    private changeDetectorRef: ChangeDetectorRef,
    private alertController: AlertController,
    private router: Router,
    private offensesService: OffensesService,
    private route: ActivatedRoute,
    private webRtcService: WebRtcService
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

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_name = value.project_name.toUpperCase()
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }
  project_name = ''
  project_id = 0
  project_config: any = []
  isLoading = false
  async toggleShowSearch(vehicle_number: any, is_camera: boolean = false) {
    this.isLoading = true
    this.showList = false
    this.vehicle = []
    console.log("PING OVER HERE")
    console.log(vehicle_number)
    this.clientMainService.getApi({vehicle_number: vehicle_number, project_id: this.project_id}, '/vms/get/search_vehicle' ).subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          // this.showList = false;
          this.vehicle = results.result.result[0]
          this.vehicleNumber = this.vehicle.vehicle_number
          console.log(this.vehicle);
          this.returnShowType()
          console.log(this.showType);
          
          setTimeout(() => {
            this.showList = true;
            if (is_camera) {
              this.is_vehicle_get = true
            }
          }, 300)
        } else {
          if (is_camera) {
            this.presentAlert(vehicle_number)
          } else {
            if (results.result.error) {
              this.functionMain.presentToast(results.result.error, 'danger');
            } else {
              this.functionMain.presentToast('An error occurred while searching vehicle records!', 'danger');
            }
            
          }
        }
        this.isLoading = false
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while searching vehicle records!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  async presentAlert(vehicle_number: any){
    const formatted_array = Array.isArray(vehicle_number) ? vehicle_number.join(" ") : vehicle_number;
    console.log(formatted_array)
    const alertButtons = await this.alertController.create({
      cssClass: 'checkout-alert',
      header: `Can't get vehicle number, is '${formatted_array}' the vehicle number you are looking for?`,
      buttons: [
        {
          text: 'Retake',
          role: 'confirm',
          handler: () => {
            this.takeVehicleLicense()
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
      ]
    })

    return await alertButtons.present()
  }

  ngOnInit() {
    this.loadProjectName()
    this.route.queryParams.subscribe(params => {
      if (params ) {
        if (params['vehicle_number']){
          this.loadProjectName()
          this.vehicleNumber = params['vehicle_number']
          this.toggleShowSearch([this.vehicleNumber])
        }
      }
    })
  }

  onSearch(vehicle_number: any) {
    if (vehicle_number) {
      let scan_list = [vehicle_number]
      this.toggleShowSearch(scan_list)
    } else {
      this.functionMain.presentToast('Vehicle number is required!', 'danger');
    }
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
      cssClass: 'record-modal',
      componentProps: {
        issue: issue,
        vehicle: {...vehicle, industrial_host_id: vehicle.industrial_host_ids.length > 0 ? [vehicle.industrial_host_ids[0]] : vehicle.industrial_host_id },
        search: true,
        alert: true
      }
  
    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if(result.data){
          this.toggleShowSearch([this.vehicleNumber])
          console.log("SUCCEED")
        }
      }
    });

    return await modal.present();
  }

  is_vehicle_get = false

  plate_value = ''
  detection_array = []
  async takeVehicleLicense() {
    this.showSearch = false
    this.is_vehicle_get = false
    let scan_list = []
    try {
      console.log("EY TAKE")
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        allowEditing: false,
        resultType: CameraResultType.Uri
      });
  
      console.log(image)
      const data: TextDetections = await Ocr.detectText({ filename: image.path! });
      console.log(data)
      for (let detection of data.textDetections) {
        scan_list.push(detection.text)
      }
      if (scan_list.length === 0) {
        this.functionMain.presentToast("Vehicle number not detected!", 'warning')
      } else {
        this.toggleShowSearch(scan_list, true)
      }
      this.showSearch = true
      this.is_vehicle_get = false
    } catch (error) {
      this.showSearch = true
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        } else {
          this.functionMain.presentToast('Error occured while taking a photo!', 'danger')
          console.error(error)
        }
      }
    }
  }

  public async showCheckoutAlert(id: number, type: string) {
    const alertButtons = await this.alertController.create({
      cssClass: 'checkout-alert',
      header: `Are you sure you want to ${type} this vehicle?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.onCheckOut(id, type)
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  onCheckOut(id: number, type: string) {
    let params = {
      offence_id: id,
      is_checkout: type == 'checkout',
      is_release: type != 'checkout',
      is_unregistered: false,
    }
    if (true) {
      this.clientMainService.getApi(params, '/vms/post/checkout_or_release_offence').subscribe({
        next: (results) => {
          if (results.result.response_code === 200) {
            this.toggleShowSearch([this.vehicleNumber])
            this.functionMain.presentToast(`Successfully ${type} vehicle!`, 'success');

          } else {
            this.functionMain.presentToast(`Failed to ${type} vehicle!`, 'danger');
          }
          
  
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while processing function!', 'danger');
          console.error(error);
        }
      });
    }
    
  }

  wheelClamp: any = []

  loadRecordsWheelClampById(id: any){
    this.offensesService.getOfffenses('wheel_clamp', true, parseInt(id)).subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.response_code === 200) {
          this.onPaymentClick(results.result.response_result[results.result.response_result.length - 1])
        } else {
        }

        // this.isLoading = false;
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
        // this.isLoading = false;
      }
    });
  }

  onPaymentClick(alert: any = []) {
    this.router.navigate(['records-wheel-clamped-payment'], {
      state: {
        vehicle: alert,
        search: true,
      },
    });
  }

  callResident(vehicle: any) {
    if (this.project_config.is_industrial){
      console.log(vehicle)
      this.webRtcService.createOffer(false, vehicle.industrial_host_ids.length > 0 ? vehicle.industrial_host_ids[0] : vehicle.industrial_host_id[0], false, false);
    }else{
      this.webRtcService.createOffer(false, false, vehicle.unit_id[0], false);
    }
  }

  callVisitor(vehicle: any) {
    console.log(vehicle)
    this.functionMain.callFromPhone(vehicle.contact_number)
  }

  handleRefresh(event: any) {
    if (this.vehicleNumber) {
      this.toggleShowSearch([this.vehicleNumber])
    }
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }
  
}
