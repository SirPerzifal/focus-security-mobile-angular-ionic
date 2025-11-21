import { Component, OnInit, ViewChild, QueryList, ViewChildren  } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ContractorsService } from 'src/app/service/vms/contrantors/contractors.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { Html5Qrcode } from 'html5-qrcode';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NodeWebSocket } from 'socket.io-client';
@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.page.html',
  styleUrls: ['./contractor-form.page.scss'],
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
export class ContractorFormPage implements OnInit {

  constructor(
    private contractorService: ContractorsService,
    private toastController: ToastController,
    private router: Router,
    private blockUnitService: BlockUnitService,
    private functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
  ) { }

  module_field = 'contractor'
  module_config: any = {}
  ngOnInit() {
    this.loadProjectName().then(() => {
      this.functionMain.getModuleField(this.project_id, this.module_field).then((result) => {
        console.log(result)
        this.module_config = result
      })
      if (this.project_config.is_industrial) {
        this.loadHost()
        this.showDrive = false
        this.showWalk = false
        this.showQr = false
      } else {
        this.loadBlock()
        this.showDrive = true
        this.refreshVehicle()
      }
    })
    this.paxData = Array.from({ length: this.maxPax }, () => ({ contractor_name: '', identification_number: '' }));
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
      this.checkOpenTime()
      this.Camera = value.config.lpr
    })
  }

  project_config: any = []
  
  @ViewChild('contractorNameInput') contractorNameInput!: TextInputComponent;
  @ViewChild('contractorContactNumberInput') contractorContactNumberInput!: TextInputComponent;
  @ViewChild('contractorIdentificationNumberInput') contractorIdentificationNumberInput!: TextInputComponent;
  @ViewChild('contractorVehicleNumberInput') contractorVehicleNumberInput!: TextInputComponent;
  @ViewChild('contractorCompanyNameInput') contractorCompanyNameInput!: TextInputComponent;
  @ViewChild('remarksInput') remarksInput!: TextInputComponent;
  @ViewChildren('textInput') textInputs!: QueryList<TextInputComponent>;

  identificationType: string = '';
  maxPax = 10;
  paxCount = 0;
  selectedBlock: string = '';
  selectedUnit: string = '';
  remarksValue = ''

  faBarcode = faBarcode

  Block: any[] = [];
  Unit: any[] = [];

  // Array untuk menyimpan data pax
  paxData: any[] = [];

  // Ambil nilai dari input
  getInputValue(id: string): string {
    const input = this.textInputs.find(input => input.id === id);
    return input ? input.value : '';
  }

  paxIdentity: string[] = []
  nameIdentity: string[] = []
  typeIdentity: string[] = ['nric']

  // Update jumlah pax
  onPaxCountChange(event: any) {
    this.paxCount = parseInt(event.target.value, 10);
    this.paxData = [];
    this.collectPaxData();
}
  
  collectPaxData() {
    this.paxData = [];
    for (let i = 0; i < this.paxCount; i++) {
      const name = this.getInputValue(`contractor_name_pax_${i}`);
      const nric = this.paxIdentity[i];
      console.log(name, nric)
      this.paxData.push({
        contractor_name: name,
        identification_number: nric
      });
    }

    return true
  }

  checkPaxData(): boolean {
    for (let i = 0; i < this.paxCount; i++) {
      console.log(i)
      const name = this.getInputValue(`contractor_name_pax_${i}`);
      const nric = this.paxIdentity[i];
      console.log(name, nric)
      if (name && nric) {
        
      } else {
        return true
      }
    }
    return false
  }

  nricPaxChange(event: any, i: any) {
     this.paxData[i].identification_number = this.functionMain.nricChange(event.target.value)
  }

  Camera: any = []
  project_id = 0

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onIdentificationTypeChange(event: any) {
    this.identificationType = event.target.value;
    if ((this.identificationType == 'nric' || this.identificationType == 'fin') && this.temp_type == 'passport') {
      this.nric_value = ''
    }
    if ((this.temp_type == 'nric' || this.temp_type == 'fin') && this.identificationType == 'passport') {
      this.nric_value = ''
    }
    this.temp_type = this.identificationType
    console.log(this.identificationType)
  }

  temp_type = 'nric'

  onBlockChange(event: any) {
    this.selectedBlock = event.target.value;
    this.loadUnit()
    console.log(this.selectedBlock)
  }

  onUnitChange(event: any) {
    this.selectedUnit = event[0]
  }

  async saveRecord(openBarrier: boolean = false, camera_id: string = '', bypass_ban: boolean = false) {  
    let errMsg = ''
    // Validasi input
    const contractorName = this.formData.contractor_name;
    const contractorContactNo = this.formData.contact_number;
    const identificationNumber = this.nric_value;
    const contractorVehicle = this.formData.contractor_vehicle;
    const companyName = this.formData.company_name;
    const remarks = this.remarksValue;

    if (!this.selectedImage && this.module_config.contractor_image) {
      errMsg += 'Contractor image is required! \n'
    }
    if (!this.selectedCard && !this.project_config.is_industrial && this.module_config.contractor_card) {
      errMsg += 'Contractor ID Card is required! \n'
    }
    if (!contractorName && this.module_config.contractor_name) {
      errMsg += 'Contractor name is required! \n'
    }
    if (!contractorContactNo && this.module_config.contact_number) {
      errMsg += 'Contact number is required! \n'
    }
    if (contractorContactNo && this.module_config.contact_number) {
      if (contractorContactNo.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (!this.identificationType && this.module_config.identification) {
      errMsg += 'Identification type must be selected! \n'
    }
    if (!identificationNumber && this.module_config.identification) {
      errMsg += 'Identification number is required! \n'
    }
    if (!contractorVehicle && this.showDrive && this.module_config.vehicle_number) {
      errMsg += 'Vehicle number is required! \n'
    }
    if (!companyName && this.module_config.company_name) {
      errMsg += 'Company name is required! \n'
    }
    if (((!this.selectedBlock && this.module_config.block) || (!this.selectedUnit && this.module_config.unit_id)) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if ((!this.selectedHost && this.module_config.host) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected! \n'
    }
    if ((!this.contractor_total_package && this.module_config.total_package) && this.project_config.is_industrial) {
      errMsg += 'Total package is required! \n'
    }
    if ((!this.contractor_entry_purpose && this.module_config.purpose) && this.project_config.is_industrial) {
      errMsg += 'Entry purpose is required! \n'
    }
    if ((!this.contractor_expired_date && this.module_config.sic_expiry_date) && this.project_config.is_industrial) {
      errMsg += 'SIC expiry date is required! \n'
    }
    if ((!this.contractor_gate_pass_number && this.module_config.gate_pass_number) && this.project_config.is_industrial) {
      errMsg += 'Gate pass number is required! \n'
    }
    if ((!this.contractor_pass_number && this.module_config.pass_number) && (this.project_config.is_industrial || this.project_config.is_allow_pass_number_resident)) {
      errMsg += 'Pass number is required! \n'
    }
    if (!this.remarksValue && this.module_config.remarks) {
      errMsg += 'Remarks is required! \n'
    }
    if (this.checkPaxData()) {
      errMsg += "All names and ICs of contractor members must be filled in!!"
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }

    this.collectPaxData();

    const subContractors = this.paxData.map(pax => ({
      contractor_name: pax.contractor_name, // Pastikan ini sesuai dengan nama property yang benar
      identification_number: pax.identification_number // Pastikan ini sesuai dengan nama property yang benar
    }));

    console.log("subcon", subContractors);
    console.log("paxdata", this.paxData);
    let params = {
      contractor_name: contractorName,
      contractor_contact_no: contractorContactNo,
      company_name: companyName,
      identification_type: this.identificationType,
      identification_number: identificationNumber,
      contractor_vehicle: this.showDrive ? contractorVehicle : '',
      block: this.selectedBlock,
      unit: this.selectedUnit,
      remarks: remarks,
      sub_contractors: subContractors,
      project_id: this.project_id,
      camera_id: camera_id,
      host: this.selectedHost,
      total_package: this.contractor_total_package,
      expired_date: this.contractor_expired_date ? this.contractor_expired_date : false,
      purpose: this.contractor_entry_purpose,
      gate_pass: this.contractor_gate_pass_number,
      pass_number: this.contractor_pass_number,
      is_pre_entry: this.isFromScan,
      entry_id: this.isFromScan ? this.entry_id : false,
      entry_type: this.isFromScan ? this.entry_type : '',
      visitor_image: this.selectedImage,
      contractor_card: this.selectedCard,
      is_bypass: this.isBypass,
      bypass_ban: bypass_ban,
    }
    
    try {
      this.clientMainService.getApi(params, '/vms/post/add_contractors').subscribe({
        next: (response: any) => {
          if (response.result.status_code === 200) {
            if (openBarrier) {
              this.functionMain.presentToast('Contractor data has been successfully saved, and the barrier is now open!', 'success');
            } else {
              this.functionMain.presentToast('Contractor data has been successfully saved to the system!', 'success');
            } 
            this.router.navigate(['home-vms'])
            this.resetForm();
          } else if (response.result.status_code === 205) {
            if (openBarrier) {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
            } else {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
            }
            this.router.navigate(['home-vms'])
          } else if (response.result.status_code === 405) {
            this.functionMain.presentToast(response.result.status_description, 'danger');
            this.router.navigate(['home-vms'])
          } else if (response.result.status_code === 407) {
            this.functionMain.presentToast(response.result.status_description, 'danger');
          } else if (response.result.status_code === 206) {
            this.functionMain.banAlert(response.result.status_description, this.selectedUnit, this.selectedHost[0]).then((value: any) => {
              if (value) {
                this.saveRecord(openBarrier, camera_id, true)
              }
            })
          } else {
            this.functionMain.presentToast('An error occurred while attempting to save contractor data', 'danger');
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.functionMain.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  resetForm() {
    // Reset semua input
    this.contactUnit = ''
    this.contactHost = ''
    this.selectedHost = ''

    this.entry_type = ''
    this.entry_id = 0
    this.isFromScan = false
    
    this.formData.contact_number = '';
    this.formData.company_name = '';
    this.formData.contractor_name = '';
    this.formData.contractor_vehicle = '';
    this.nric_value = '';
    this.remarksValue = '';

    // Reset pilihan
    this.identificationType = '';

    this.selectedBlock = '';
    this.contactUnit = ''
    this.selectedUnit = '';

    this.contactHost = ''
    this.selectedHost = ''

    this.paxCount = 0

    this.contractor_pass_number = ''
    this.contractor_gate_pass_number = ''
    this.contractor_expired_date = ''
    this.contractor_total_package = 0
    this.contractor_entry_purpose = ''
    this.contractor_entry_date = ''

    this.selectedImage = ''
    this.selectedCard = ''
    this.is_id_disabled = false
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });


    toast.present().then(() => {


    });
  }

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  async loadUnit() {
    this.selectedUnit = ''
    this.blockUnitService.getUnit(this.selectedBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}));
          console.log(response)
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading unit data!', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  vehicle_number = ''

  refreshVehicle(is_click: boolean = false) {
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      if (value) {
        this.formData.contractor_vehicle = value.vehicle_number ? value.vehicle_number : ''
        if (!this.isFromScan) {
          this.formData.contact_number = value.contact_number ? value.contact_number : ''
          this.formData.contractor_name = value.visitor_name ? value.visitor_name  : ''
          this.formData.contractor_vehicle = value.vehicle_number ? value.vehicle_number  : ''
          this.selectedImage = value.visitor_image
          this.selectedCard = value.contractor_card
          this.identificationType = value.identification_type ? value.identification_type : ''
          this.temp_type = this.identificationType
          this.nric_value = value.identification_number ? value.identification_number : '' 
          this.contactUnit = ''
          this.contactHost = ''
          if (this.project_config.is_industrial) {
            if (value.industrial_host_ids.length > 0) {
              this.contactHost = value.industrial_host_ids ? value.industrial_host_ids : ''
            } else {
              if (this.isFromScan) {
                this.tempHost = value.industrial_host_id ? [value.industrial_host_id] : ''
              }
              setTimeout(() => {
                this.contactHost = value.industrial_host_id ? [value.industrial_host_id] : ''
              }, 300)
              console.log(this.contactHost)
            }
          } else {
            if (value.block_id) {
              this.selectedBlock = value.block_id
              this.loadUnit().then(() => {
                setTimeout(() => {
                  this.contactUnit = value.unit_id
                }, 300)
              })
            }
          }
        }
      }
    })
  }

  formData = {
    contractor_name: '',
    contractor_vehicle: '',
    company_name: '',
    contact_number: '',
  };

  contactUnit = ''
  selectedNric: any = ''
  is_id_disabled = false
  getContactInfo(contactData: any) {
    this.contactUnit = ''
    this.contactHost = ''
    if (contactData && !this.isFromScan) {
      this.formData.contractor_name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.formData.contractor_vehicle = contactData.vehicle_number ? contactData.vehicle_number  : ''
      this.selectedImage = contactData.visitor_image
      this.selectedCard = contactData.contractor_card
      this.nric_value = contactData.identification_number
      if (contactData.identification_type && contactData. identification_number) {
        this.is_id_disabled = true
      } else {
        this.is_id_disabled = false
      }
      if (contactData.identification_type) {
        this.identificationType = contactData.identification_type
        this.temp_type = this.identificationType
      }
      if (this.project_config.is_industrial) {
        if (contactData.industrial_host_ids.lentgh > 0) {
          setTimeout(() => {
            this.contactHost = contactData.industrial_host_ids ? contactData.industrial_host_ids : ''
          }, 300)
        } else {
          if (this.isFromScan) {
            this.tempHost = contactData.industrial_host_id ? [contactData.industrial_host_id] : ''
          }
          setTimeout(() => {
            this.contactHost = contactData.industrial_host_id ? [contactData.industrial_host_id] : ''
          }, 300)
        }
      } else {
        if (contactData.block_id) {
          this.selectedBlock = contactData.block_id
          this.loadUnit().then(() => {
            setTimeout(() => {
              this.contactUnit = contactData.unit_id
            }, 300)
          })
        }
      }
    }
  }

  nric_value = ''
  onNricInput(event: any) {
    this.nric_value = this.functionMain.nricChange(event.target.value)
  }

  openNricScan(order: number = 0, is_pax: boolean = false) {
    this.functionMain.presentModalNric().then(value => {
      if (value) {
        if (is_pax) {
          this.paxIdentity[order] = value.data
        } else {
          console.log(value)
          this.identificationType = value.is_fin ? 'fin' : 'nric'
          this.nric_value = value.data;
        } 
        this.clientMainService.getApi({nric: value.data, project_id: this.project_id, is_visitor_logs: true}, '/vms/get/contractor_by_nric').subscribe({
          next: (results) => {
            console.log(results)
            if (results.result.status_code === 200) {
              let data = results.result.result[0]
              if (is_pax) {
                this.nameIdentity[order] = data.contractor_name
              } else {
                console.log(value)
                this.is_id_disabled = true
                if (this.isFromScan) {
                  this.formData.contractor_name = this.formData.contractor_name ? this.formData.contractor_name : data.contractor_name
                  this.formData.company_name = this.formData.company_name ? this.formData.company_name : data.company_name
                  this.formData.contact_number = this.formData.contact_number ? this.formData.contact_number : data.contact_number
                  this.selectedImage = data.visitor_image
                  this.selectedCard = data.contractor_card
                  if (this.showDrive) {
                    this.formData.contractor_vehicle = this.formData.contractor_vehicle ? this.formData.contractor_vehicle : data.vehicle_number
                  }
                } else {
                  this.formData.contractor_name = data.contractor_name
                  this.formData.company_name = data.company_name
                  this.formData.contact_number = data.contact_number
                  this.selectedImage = data.visitor_image
                  this.selectedCard = data.contractor_card
                  if (this.showDrive) {
                    this.formData.contractor_vehicle =  data.vehicle_number
                  }
                }
              } 
            } else {
              if (is_pax) {
                this.paxData[order].contractor_name = this.paxData[order].contractor_name ? this.paxData[order].contractor_name : ''
              } else {
                console.log(value)
                this.formData.contractor_name = this.formData.contractor_name ? this.formData.contractor_name : ''
                this.formData.company_name = this.formData.company_name ? this.formData.company_name : ''
                this.formData.contact_number = this.formData.contact_number ? this.formData.contact_number : '65'
                this.formData.contractor_vehicle = this.formData.contractor_vehicle ? this.formData.contractor_vehicle : ''
              } 
              this.functionMain.presentToast(`No data found in the system for ${value.data}!`, 'warning')
            }
          },
          error: (error) => {
            this.functionMain.presentToast('An error occurred while searching for nric!', 'danger');
            console.error(error);
          }
        });
      }
      
    });
    console.log(this.nric_value)
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost: any = ''
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
    this.selectedHost = event
    console.log(this.selectedHost)
  }

  contractor_pass_number = ''
  contractor_gate_pass_number = ''
  contractor_expired_date = ''
  contractor_total_package = 0
  contractor_entry_purpose = ''
  contractor_entry_date = ''
  contractor_id = 0

  onExpiredDateChange(event: any) {
    console.log(event.target.value)
    this.contractor_expired_date = event.target.value
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
        this.tempHost = []
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
      this.contactHost = ''
      setTimeout(() => {
        this.showWalk = true;
        this.showWalkTrans = false
        if (this.isFromScan) {
          setTimeout(() => {
            this.contactHost = this.tempHost
          }, 300)
        }
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
      this.contactHost = ''
      setTimeout(() => {
        this.showDrive = true;
        this.showDriveTrans = false
        if (this.isFromScan) {
          setTimeout(() => {
            this.contactHost = this.tempHost
          }, 300)
        }
        if (!this.isFromScan) {
          this.refreshVehicle()
        }
      }, 300)
    }
  }

  tempHost: any = []

  searchData: any

  htmlScanner!: Html5Qrcode
  scannerId = 'reader'

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
          if (!this.isProcess){
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
    try {
      if (this.htmlScanner) {
        this.htmlScanner.stop().catch( err => console.log(err))
      }
      this.isHidden = false
      this.showClose = false
    } catch (error) {
      this.isHidden = false
      this.showClose = false
    }
  }

  isProcess = false
  entry_id = 0
  entry_type = ''
  errorSound = new Audio('assets/sound/Error Alert.mp3');
  checkResult(){
    this.isProcess = true
    this.clientMainService.getApi({id: this.scanResult}, '/vms/get/search_expected_contractor').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.isFromScan = true
          this.stopScanner()
          this.searchData = results.result.result[0]
          if (this.searchData.visitor_type == 'walk_in') {
            this.toggleShowWalk()
          } else {
            this.toggleShowDrive()
          }
          this.entry_id = this.searchData.id
          this.entry_type = this.searchData.entry_type
          this.formData.contact_number = this.searchData.contact_number;
          this.formData.company_name = this.searchData.company_name;
          this.formData.contractor_name = this.searchData.contractor_name;
          this.formData.contractor_vehicle = this.searchData.vehicle_number;
          this.formData.company_name = this.searchData.company_name
          this.contractor_entry_purpose = this.searchData.type_of_work
          this.identificationType = this.searchData.identification_type
          this.selectedImage = this.searchData.visitor_image
          this.selectedCard = this.searchData.contractor_card
          this.nric_value= this.searchData.identification_number
          if (this.searchData.identification_type && this.searchData.identification_number) {
            this.is_id_disabled = true
          } else {
            this.is_id_disabled = false
          }
            
          if (this.project_config.is_industrial) {
            setTimeout(() => {
              this.contactHost = this.searchData.industrial_host_ids
              this.tempHost = this.contactHost
            }, 300)
          } else {
            // this.formData.block = this.searchData.block_id[0]
            // this.loadUnit().then(() => {
            //   this.contactUnit = this.searchData.unit_id[0]
            // })
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

  changeType(i: number) {
    this.paxIdentity[i] = ''
    if (['nric', 'fin'].includes(this.typeIdentity[i]) ) {
      this.typeIdentity[i] = 'passport'
    } else {
      this.typeIdentity[i] = 'nric'
    }
  }

  selectedImage = ''
  selectedCard = ''

  handleRefresh(event: any) {
    this.functionMain.getModuleField(this.project_id, this.module_field).then((result) => {
      console.log(result)
      this.module_config = result
    })
    if (this.project_config.is_industrial) {
      this.loadHost()
    } else {
      this.loadBlock()
    }
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

  isOpen = true
  async checkOpenTime() {
    this.isOpen = await this.functionMain.checkOpenTime()
  }

  isBypass = false
  
}