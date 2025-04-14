import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { VisitorService } from 'src/app/service/vms/visitor/visitor.service';
import { ModalController, ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { Subscription } from 'rxjs';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { AlertModalPage } from 'src/app/modules/alert_module/pages/alert-modal/alert-modal.page';
import { Html5Qrcode } from "html5-qrcode";

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
    public functionMain: FunctionMainService,
    private mainVmsService: MainVmsService,
    private modalController: ModalController,
    private blockUnitService: BlockUnitService,
  ) { }
  
  ngOnInit() {
    this.paramsActiveFromCoaches.queryParams.subscribe(params => {
      if (params['showDrive']) { 
        this.showDrive = true; 
      }
    });
    this.loadProjectId().then(() => {
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
  }

  formData = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_type: 'walk_in',
    visitor_vehicle: '',
    block: '',
    unit: '',
    family_id: '',
    purpose: ''
  };

  async loadProjectId() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id
      this.project_config = value.config
      this.Camera = value.config.lpr
    })
  }

  project_id = 0
  project_config: any = []
  Camera: any = []

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

  resetForm() {
    this.Unit = []
    this.formData.visitor_name = ''
    this.formData.visitor_contact_no = ''
    this.formData.visitor_type = ''
    this.formData.visitor_vehicle = ''
    this.formData.block = ''
    this.formData.purpose = ''
    this.formData.unit = ''
    this.contactUnit = ''
    this.selectedHost = ''
    this.contactHost = ''
  }

  onSubmitDriveIn(openBarrier: boolean = false, camera_id: string = '') {
    console.log(this.formData)
    console.log(this.selectedHost)
    let errMsg = ""
    if (!this.formData.visitor_name) {
      errMsg += 'Visitor is required!\n';
    }
    if (!this.formData.visitor_contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (this.formData.visitor_contact_no) {
      if (this.formData.visitor_contact_no.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (!this.formData.visitor_vehicle) {
      errMsg += 'Vehicle number is required!\n';
    }
    if ((!this.formData.block || !this.formData.unit) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected!\n';
    }
    if ((!this.selectedHost) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected!\n';
    }
    if ((!this.formData.purpose) && this.project_config.is_industrial) {
      errMsg += 'Purpose is required!\n';
    }
    if (errMsg != "") {
      this.presentToast(errMsg, 'danger')
      return
    }
    try {
      this.visitorService.postAddVisitor(this.formData.visitor_name, this.formData.visitor_contact_no, 'drive_in', this.formData.visitor_vehicle, this.formData.block, this.formData.unit, this.formData.family_id, this.project_id, camera_id,this.isFromScan,this.isFromScan ? this.searchData.id : '',this.isFromScan ? this.searchData.entry_type : '',this.selectedHost,this.formData.purpose).subscribe(
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

  purposeInput(event: any) {
    this.formData.purpose = event.target.value
  }

  purpose = ''
  onSubmitWalkIn(openBarrier: boolean = false) {
    console.log(this.formData)
    let errMsg = ""
    if (!this.formData.visitor_name) {
      errMsg += 'Visitor is required!\n';
    }
    if (!this.formData.visitor_contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (this.formData.visitor_contact_no) {
      if (this.formData.visitor_contact_no.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if ((!this.formData.block || !this.formData.unit) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected!\n';
    }
    if ((!this.selectedHost) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected!\n';
    }
    if ((!this.formData.purpose) && this.project_config.is_industrial) {
      errMsg += 'Purpose is required!\n';
    }
    if (errMsg != "") {
      this.presentToast(errMsg, 'danger')
      return
    }
    console.log(this.formData)
    try {
      this.visitorService.postAddVisitor(this.formData.visitor_name, this.formData.visitor_contact_no, 'walk_in', '', this.formData.block, this.formData.unit, this.formData.family_id,this.project_id,'',this.isFromScan,this.isFromScan ? this.searchData.id : '',this.isFromScan ? this.searchData.entry_type : '',this.selectedHost,this.formData.purpose).subscribe(
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
  showClose = false

  toggleShowQr() {
    if (!this.showDriveTrans && !this.showWalkTrans) {
      if ( !this.isFromScan) {
        this.resetForm()
      }
      this.showQrTrans = true
      this.showDrive = false;
      this.showWalk = false;
      this.isHidden = true
      setTimeout(() => {
        this.showQr = true;
        this.showQrTrans = false
        this.startScanner()
      }, 300)
    }
  }

  toggleShowWalk() {
    if (!this.showQrTrans && !this.showDriveTrans) {
      if (this.showDrive && !this.isFromScan) {
        this.resetForm() 
      }
      if (this.showQr && this.showClose) {
        this.stopScanner()
      }
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
      if (this.showWalk && !this.isFromScan) {
        this.resetForm() 
      }
      if (this.showQr && this.showClose) {
        this.stopScanner()
      }
      this.showDriveTrans = true
      this.showWalk = false;
      this.showQr = false;
      setTimeout(() => {
        this.showDrive = true;
        this.showDriveTrans = false
        this.refreshVehicle()
      }, 300)
    }
  }

  onBlockChange(event: any) {
    this.formData.block = event.target.value;
    this.loadUnit(); // Panggil method load unit
  }

  contactUnit = ''
  onUnitChange(event: any) {
    this.formData.unit = event[0];
  }

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
  }

  textUnit = 'UNIT'

  async loadUnit() {
    this.formData.unit = ''
    this.blockUnitService.getUnit(this.formData.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name})); 
          console.log(this.Unit)
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  

  htmlScanner!: Html5Qrcode
  scannerId = 'reader'
  ngAfterViewInit() {
    // Inisialisasi scanner setelah view siap
    
  }


  vehicle_number = ''

  refreshVehicle() {
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.formData.visitor_vehicle = value.vehicle_number ? value.vehicle_number : ''
    })
    // console.log("Vehicle Refresh", randomVhc)
  }

  getContactInfo(contactData: any){
    this.contactUnit = ''
    this.contactHost = ''
    if (contactData) {
      this.formData.visitor_name = contactData.visitor_name
      this.formData.visitor_vehicle = contactData.vehicle_number
      if (this.project_config.is_industrial) {
        this.contactHost = contactData.host_id
      } else {
        this.formData.block = contactData.block_id
        this.loadUnit().then(() => {
          setTimeout(() => {
            this.contactUnit = contactData.unit_id
          }, 300)
        })
      }
    }
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    this.stopScanner()
    console.log("HEY TEST DESTRoy")
    if (this.routerSubscription) {
      this.stopScanner()
      this.routerSubscription.unsubscribe();
    }
  }

  searchData: any

  imageSrc: string | ArrayBuffer | null = null;
  barcodeResult: string | null = null;

  scanResult: string = ''
  isHidden = false
  isFromScan = false
  startScanner(){
    setTimeout(() => {

      const closeModalOnBack = () => {
        this.stopScanner()
        window.removeEventListener('popstate', closeModalOnBack);
      };
      window.addEventListener('popstate', closeModalOnBack)

      this.htmlScanner = new Html5Qrcode(this.scannerId);
      console.log("Scanner Initialized:", this.htmlScanner);
      this.isHidden = true
      console.log("WORK")
      this.htmlScanner.start(
        { 
          facingMode: "environment"
        },
        {
          fps: 10,
          qrbox: {
            width: 500,
            height: 500,
          }
        },
        (decodedText) => {
          this.scanResult = decodedText
          console.log(this.scanResult)
          this.checkResult()
        },
        (errorMessage) => {
          console.log(errorMessage)
        }
        
      ).catch(err => console.log(err));
      this.showClose = true
    }, 500)
    
  }

  stopScanner() {
    if (this.htmlScanner) {
      this.htmlScanner.stop().catch( err => console.log(err))
    }
    this.isHidden = false
    this.showClose = false
  }

  entry_id = 0
  entry_type = ''
  errorSound = new Audio('assets/sound/Error Alert.mp3');
  checkResult(){
    this.mainVmsService.getApi({id: this.scanResult}, '/vms/get/search_expected_visitor').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.isFromScan = true
          this.stopScanner()
          this.searchData = results.result.result[0]
          this.formData.visitor_name = this.searchData.visitor_name
          this.formData.visitor_contact_no = this.searchData.contact_number
          this.formData.visitor_type = this.searchData.visitor_type
          this.formData.visitor_vehicle = this.searchData.vehicle_number ? this.searchData.vehicle_number : '' 
          this.formData.family_id = this.searchData.family_id
          this.contactUnit = ''
          if (this.project_config.is_industrial) {
            this.contactHost = this.searchData.host_id
          } else {
            this.formData.block = this.searchData.block_id[0]
            this.loadUnit().then(() => {
              this.contactUnit = this.searchData.unit_id[0]
            })
          }
          if (this.formData.visitor_type == 'walk_in') {
            this.toggleShowWalk()
          } else {
            this.toggleShowDrive()
          }
        } else {
          this.functionMain.presentToast('Expected visitor not found!', 'danger');
          this.errorSound.play().catch((err) => console.error('Error playing sound:', err));
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while searching the expected visitor!', 'danger');
        this.errorSound.play().catch((err) => console.error('Error playing sound:', err));
        console.error(error);
      }
    });
  }

  onBackHome() {
    if (this.isHidden){
      this.stopScanner()
    }
    this.router.navigate(['home-vms'])
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  loadHost() {
    this.mainVmsService.getApi({ project_id: this.project_id }, '/commercial/get/host').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
  }
}
