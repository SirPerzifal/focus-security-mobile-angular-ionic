import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { VisitorService } from 'src/app/service/vms/visitor/visitor.service';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { Subscription } from 'rxjs';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
// import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
// import { Capacitor } from '@capacitor/core';

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

  constructor(
    private paramsActiveFromCoaches: ActivatedRoute, 
    private visitorService: VisitorService, 
    private toastController: ToastController, 
    private router: Router,
    private functionMain: FunctionMainService,
    private mainVmsService: MainVmsService,
    private blockUnitService: BlockUnitService) { }

  formData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'walk_in',
    visitor_vehicle: '',
    block: '',
    unit: ''
  };

  Block: any[] = [];
  Unit: any[] = [];

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });


    toast.present().then(() => {
      
      
    });;
  }

  onSubmitDriveIn(openBarrier: boolean = false) {
    console.log(this.formData)
    console.log(openBarrier)
    let errMsg = ""
    if (!this.formData.visitor_name) {
      errMsg += 'Visitor is required!\n';
    }
    if (!this.formData.visitor_contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (!this.formData.visitor_vehicle) {
      errMsg += 'Vehicle number is required!\n';
    }
    if (!this.formData.block || !this.formData.unit) {
      errMsg += 'Block and unit must be selected!\n';
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
              this.presentToast('Drive in data has been successfully saved, and the barrier is now open!', 'success');
            }else {
              this.presentToast('Drive in data has been successfully saved to the system!', 'success');
            }
            
            this.router.navigate(['home-vms'])
          } else {
            this.presentToast('An error occurred while attempting to save drive in data', 'danger');
          }

        },
        error => {
          console.error('Error Here:', error);
          this.presentToast('An unexpected error has occurred!', 'danger');
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('An unexpected error has occurred!', 'danger');
    }

  }

  onSubmitWalkIn(openBarrier: boolean = false) {
    console.log(openBarrier)
    let errMsg = ""
    if (!this.formData.visitor_name) {
      errMsg += 'Visitor is required!\n';
    }
    if (!this.formData.visitor_contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (!this.formData.block || !this.formData.unit) {
      errMsg += 'Block and unit must be selected!\n';
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
              this.presentToast('Walk in data has been successfully saved, and the barrier is now open!', 'success');
            }else {
              this.presentToast('Walk in data has been successfully saved to the system!', 'success');
            }
            this.router.navigate(['home-vms'])
          } else {
            this.presentToast('An error occurred while attempting to save walk in data!', 'danger');
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('An unexpected error has occurred!', 'danger');
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

  onBlockChange(event: any) {
    this.formData.block = event.target.value;
    console.log(this.formData.block)
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.formData.unit = event.target.value;
    console.log(this.formData.unit)
  }

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
          this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  async loadUnit() {
    this.blockUnitService.getUnit(this.formData.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
        } else {
          this.presentToast('An error occurred while loading unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }


  ngOnInit() {
    this.loadBlock(); 
    this.paramsActiveFromCoaches.queryParams.subscribe(params => {
      if (params['showDrive']) {  // Gunakan bracket notation di sini
        this.showDrive = true; // Atur showDrive menjadi true jika parameter ada
      }
    });
  }

  vehicle_number = ''

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.formData.visitor_vehicle = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

  getContactInfo(contactData: any){
    if (contactData) {
      this.formData.visitor_name = contactData.visitor_name
      this.formData.visitor_vehicle = contactData.vehicle_number
      this.formData.block = contactData.block_id
      this.loadUnit().then(() => {
        this.formData.unit = contactData.unit_id
      })
    }
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  fileInput: any

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      console.log(image)
      this.fileInput = image.base64String;
      await this.searchImageId(1).then(() => {
      })

      // this.showImage = `data:image/png;base64,${this.fileInput}`
      
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }
  
      this.functionMain.presentToast('Error taking photo', 'danger')
    }
    
  };

  searchData: any

  async searchImageId(id: number) {
    console.log(id);
    
    this.mainVmsService.getApi({id: id}, '/vms/get/search_expected_visitor').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.searchData = results.result.result[0]
          this.functionMain.presentToast('Expected visitor loaded!', 'success');
          
          this.formData.visitor_name = this.searchData.visitor_name
          this.formData.visitor_contact_no = this.searchData.contact_number
          this.formData.visitor_type = this.searchData.visitor_type
          this.formData.visitor_vehicle = this.searchData.vehicle_number
          this.formData.block = this.searchData.block_id[0]
          console.log(this.formData);
          
          this.loadUnit().then(() => {
            this.formData.unit = this.searchData.unit_id[0]
            if (this.formData.visitor_type == 'walk_in') {
              this.toggleShowWalk()
            } else {
              this.toggleShowDrive()
            }
          })
          
        } else {
          this.functionMain.presentToast('Expected visitor not found!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while searching the expected visitor!', 'danger');
        console.error(error);
      }
    });
  }

  // barcodes: any[] = [];

  // async scan(): Promise<void> {
  //   if (Capacitor.isNativePlatform()) {
  //     const { barcodes } = await BarcodeScanner.scan();
  //     this.barcodes.push(...barcodes);
  //   } else {
  //     // Mock barcode data for unsupported platforms
  //     const mockBarcodes = [{ format: 'QR_CODE', rawValue: 'MOCK_BARCODE' }];
  //     this.barcodes.push(...mockBarcodes);
  //     console.warn('Barcode Scanner is not available on this platform. Using mock data.');
  //   }
  
  // }

  // async requestPermissions(): Promise<boolean> {
  //   const { camera } = await BarcodeScanner.requestPermissions();
  //   return camera === 'granted' || camera === 'limited';
  // }


}
