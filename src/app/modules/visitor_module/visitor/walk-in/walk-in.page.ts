import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
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
    private toastController: ToastController, 
    private router: Router,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
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
    this.selectedNric = ''
    this.pass_number = ''
    this.purpose = ''
    this.selectedImage = ''
  }

  onSubmitDriveIn(openBarrier: boolean = false, camera_id: string = '') {
    console.log(this.formData)
    console.log(this.selectedHost)
    let errMsg = ""
    if (!this.selectedImage) {
      errMsg += 'Visitor image is required!\n';
    }
    if ((!this.identificationType) && this.project_config.is_industrial) {
      errMsg += 'Identification type is required!\n';
    }
    if ((!this.nric_value) && this.project_config.is_industrial) {
      errMsg += 'Identification number is required!\n';
    }
    if (!this.formData.visitor_name) {
      errMsg += 'Visitor name is required!\n';
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
    if (!this.pass_number && this.project_config.is_industrial) {
      errMsg += 'Pass number is required! \n'
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
      let params = {
        visitor_name: this.formData.visitor_name,
        visitor_contact_no: this.formData.visitor_contact_no,
        visitor_type: 'drive_in',
        visitor_vehicle: this.formData.visitor_vehicle,
        block: this.formData.block,
        unit: this.formData.unit,
        family_id: this.formData.family_id,
        project_id: this.project_id,
        camera_id: '',
        is_pre_entry: this.isFromScan,
        entry_id: this.isFromScan ? this.searchData.id : '',
        entry_type: this.isFromScan ? this.searchData.entry_type : '',
        host: this.selectedHost,
        purpose: this.formData.purpose,
        identification_type: this.identificationType,
        identification_number: this.nric_value,
        pass_number: this.pass_number,
        visitor_image: this.selectedImage
      }
      this.clientMainService.getApi(params, '/vms/post/add_visitor').subscribe(
        res => {
          console.log(res);
          if (res.result.status_code == 200) {
            if (openBarrier){
              console.log("Barrier Opened")
              this.presentToast('Drive in data has been successfully saved, and the barrier is now open!', 'success');
            } else {
              this.presentToast('Drive in data has been successfully saved to the system!', 'success');
            }
            
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 205) {
            if (openBarrier) {
              this.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
            } else {
              this.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
            }
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 405) {
            this.presentToast(res.result.status_description, 'danger');
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 407) {
            this.functionMain.presentToast(res.result.status_description, 'danger');
          } else if (res.result.status_code === 206) {
            // this.functionMain.presentToast(res.result.status_description, 'danger');
            this.functionMain.banAlert(res.result.status_description, this.formData.unit, this.selectedHost)
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
    console.log(this.pass_number)
    let errMsg = ""
    if (!this.selectedImage) {
      errMsg += 'Visitor image is required!\n';
    }
    if ((!this.identificationType) && this.project_config.is_industrial) {
      errMsg += 'Identification type is required!\n';
    }
    if ((!this.nric_value) && this.project_config.is_industrial) {
      errMsg += 'Identification number is required!\n';
    }
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
    if (!this.pass_number && this.project_config.is_industrial) {
      errMsg += 'Pass number is required! \n'
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
      let params = {
        visitor_name: this.formData.visitor_name,
        visitor_contact_no: this.formData.visitor_contact_no,
        visitor_type: 'walk_in',
        visitor_vehicle: '',
        block: this.formData.block,
        unit: this.formData.unit,
        family_id: this.formData.family_id,
        project_id: this.project_id,
        camera_id: '',
        is_pre_entry: this.isFromScan,
        entry_id: this.isFromScan ? this.searchData.id : '',
        entry_type: this.isFromScan ? this.searchData.entry_type : '',
        host: this.selectedHost,
        purpose: this.formData.purpose,
        identification_type: this.identificationType,
        identification_number: this.nric_value,
        pass_number: this.pass_number,
        visitor_image: this.selectedImage
      }
      this.clientMainService.getApi(params, '/vms/post/add_visitor').subscribe(
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
          } else if (res.result.status_code === 205) {
            if (openBarrier) {
              this.presentToast('This data has been alerted on previous value and offence data automatically added. The barrier is now open!', 'success');
            } else {
              this.presentToast('This data has been alerted on previous value and offence data automatically added!', 'success');
            }
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 405) {
            this.presentToast(res.result.status_description, 'danger');
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 407) {
            this.functionMain.presentToast(res.result.status_description, 'danger');
          } else if (res.result.status_code === 206) {
            this.functionMain.banAlert(res.result.status_description, this.formData.unit, this.selectedHost)
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
      if (this.showWalk || this.showDrive) {
        this.resetForm()
        this.isFromScan = false
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
      console.log(this.isFromScan)
      if (!this.showDrive && !this.isFromScan) {
        this.resetForm() 
        this.refreshVehicle()
      }
      if (this.showQr && this.showClose) {
        if (!this.isFromScan){
          this.refreshVehicle()
        }
        this.stopScanner()
      }
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

  refreshVehicle(is_click: boolean = false) {
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.formData.visitor_vehicle = value.vehicle_number ? value.vehicle_number : ''
      if (!is_click) {
        this.formData.visitor_contact_no = value.contact_number ? value.contact_number : ''
        this.formData.visitor_name = value.visitor_name ? value.visitor_name  : ''
        this.selectedImage = value.visitor_image
        this.selectedNric = {type: value.identification_type ? value.identification_type : '', number: value.identification_number ? value.identification_number : '' }
        this.contactUnit = ''
        this.contactHost = ''
        if (this.project_config.is_industrial) {
          this.contactHost = value.industrial_host_id ? value.industrial_host_id : ''
        } else {
          if (value.block_id) {
            this.formData.block = value.block_id
            this.loadUnit().then(() => {
              setTimeout(() => {
                this.contactUnit = value.unit_id
              }, 300)
            })
          }
        }
      }
    })
    // console.log("Vehicle Refresh", randomVhc)
  }

  getContactInfo(contactData: any){
    this.contactUnit = ''
    this.contactHost = ''
    if (contactData) {
      this.formData.visitor_name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.formData.visitor_vehicle = contactData.vehicle_number ? contactData.vehicle_number  : ''
      this.selectedImage = contactData.visitor_image
      if (this.project_config.is_industrial) {
        this.contactHost = contactData.industrial_host_id ? contactData.industrial_host_id : ''
        this.selectedNric = {type: contactData.identification_type ? contactData.identification_type : '', number: contactData.identification_number ? contactData.identification_number : '' }
      } else {
        if (contactData.block_id) {
          this.formData.block = contactData.block_id
          this.loadUnit().then(() => {
            setTimeout(() => {
              this.contactUnit = contactData.unit_id
            }, 300)
          })
        }
      }
    }
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
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

      this.isHidden = true
      this.htmlScanner = new Html5Qrcode(this.scannerId);
      console.log("Scanner Initialized:", this.htmlScanner);
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
          if (!this.isProcess) {
            this.checkResult()
          }
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
  isProcess = false
  checkResult(){
    this.isProcess = true
    this.clientMainService.getApi({id: this.scanResult}, '/vms/get/search_expected_visitor').subscribe({
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
          this.selectedImage = this.searchData.visitor_image
          this.selectedNric = {type: this.searchData.identification_type , number: this.searchData.identification_number}
          this.contactUnit = ''
          if (this.project_config.is_industrial) {
            this.contactHost = this.searchData.industrial_host_id[0]
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
          this.functionMain.presentToast(results.result.error, 'danger');
          this.errorSound.play().catch((err) => console.error('Error playing sound:', err));
        }
        this.isProcess = false
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while searching the expected visitor!', 'danger');
        this.errorSound.play().catch((err) => console.error('Error playing sound:', err));
        console.error(error);
        this.isProcess = false
      }
    });
  }

  onBackHome() {
    if (this.isHidden){
      this.stopScanner()
      setTimeout(() => {
        this.router.navigate(['home-vms'])
      }, 300);
    } else {
      this.router.navigate(['home-vms'])
    }
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  loadHost() {
    this.contactHost = ''
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
      if (this.selectedHost) {
        this.contactHost = this.selectedHost
      }
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
  }

  setFromScan(event: any) {
    console.log(event)
    this.nric_value = event.data.identification_number
    this.identificationType = event.type
    if (event.data.is_server) {
      if (this.project_config.is_industrial) {
        this.contactHost = event.data.industrial_host_id ? event.data.industrial_host_id : ''
      }
      this.selectedImage = event.data.visitor_image
      this.formData.visitor_name = event.data.contractor_name ? event.data.contractor_name : ''
      this.formData.visitor_contact_no = event.data.contact_number ? event.data.contact_number : ''
      if (this.showDrive) {
        this.formData.visitor_vehicle = event.data.vehicle_number ? event.data.vehicle_number : ''
      }
    } 
    console.log(this.nric_value, this.identificationType)
  }

  identificationType = ''
  nric_value = ''
  selectedNric: any = ''
  pass_number = ''

  selectedImage: any = ''

  handleRefresh(event: any) {
    if (this.project_config.is_industrial) {
      this.loadHost()
    } else {
      this.loadBlock()
    }
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }
}
