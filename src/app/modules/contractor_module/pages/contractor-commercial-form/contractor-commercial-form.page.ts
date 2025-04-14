import { Component, OnInit, ViewChild, QueryList, ViewChildren, HostListener } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ContractorsService } from 'src/app/service/vms/contrantors/contractors.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { faBarcode, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-contractor-commercial-form',
  templateUrl: './contractor-commercial-form.page.html',
  styleUrls: ['./contractor-commercial-form.page.scss'],
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
export class ContractorCommercialFormPage implements OnInit {

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

  faBarcode = faBarcode

  Block: any[] = [];
  Unit: any[] = [];

  // Array untuk menyimpan data pax
  paxData: any[] = [];

  constructor(
    private contractorService: ContractorsService,
    private toastController: ToastController,
    private router: Router,
    private blockUnitService: BlockUnitService,
    private functionMain: FunctionMainService,
    private mainVmsService: MainVmsService
  ) { }

  // Ambil nilai dari input
  getInputValue(id: string): string {
    const input = this.textInputs.find(input => input.id === id);
    return input ? input.value : '';
  }

  paxIdentity: string[] = []
  typeIdentity: string[] = []
  nameIdentity: string[] = []

  // Update jumlah pax
  onPaxCountChange(event: any) {
    this.paxCount = parseInt(event.target.value, 10);
    // Reset pax data
    // this.paxData = Array.from({ length: this.paxCount }, () => ({ contractor_name: '', identification_number: '' }));
    this.paxData = [];
    // Kumpulkan data pax setelah mengubah paxCount
    this.collectPaxData();
  }

  collectPaxData() {
    this.paxData = [];
    for (let i = 0; i < this.paxCount; i++) {
      const name = this.getInputValue(`contractor_name_pax_${i}`);
      const nric = this.typeIdentity[i] == 'passport' ? this.paxIdentity[i] : this.getInputValue(`contractor_nric_fin_pax_${i}`);
      const type = this.typeIdentity[i] ? this.typeIdentity[i] : 'nric'
      console.log(name, nric)
      this.paxData.push({
        contractor_name: name,
        identification_number: nric,
        identification_type: type
      });
    }

    return true
  }

  checkPaxData(): boolean {
    for (let i = 0; i < this.paxCount; i++) {
      console.log(i)
      const name = this.getInputValue(`contractor_name_pax_${i}`);
      const nric = this.typeIdentity[i] == 'passport' ? this.paxIdentity[i] : this.getInputValue(`contractor_nric_fin_pax_${i}`);
      console.log(name, nric)
      if (name && (this.typeIdentity[i] != 'passport' && nric)) {
        console.log("PING")
        if ((nric.length > this.max_digit || nric.length < this.min_digit)) {
          console.log("PANG")
          return true
        }
      } else {
        console.log("PENG")
        if (!(this.typeIdentity[i] == 'passport' && nric)) {
          console.log("PONG")
          return true
        }
      }
    }
    return false
  }

  ngOnInit() {
    this.loadProjectName().then(() => {
      this.loadHost();
      this.getMinMaxNric()
    })
    this.paxData = Array.from({ length: this.maxPax }, () => ({ contractor_name: '', identification_number: '' }));
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  project_id = 0
  project_config: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onIdentificationTypeChange(event: any) {
    this.identificationType = event.target.value;
    console.log(this.identificationType)
  }

  onCheckoutIdentificationTypeChange(event: any) {
    this.checkoutForm.identification_type = event.target.value;
  }

  onBlockChange(event: any) {
    // this.selectedBlock = event.target.value;
    // this.loadUnit()
    // console.log(this.selectedBlock)
  }

  onUnitChange(event: any) {
    // this.selectedUnit = event.target.value;
    // console.log(this.selectedUnit)
  }

  collectForm: any = {}

  async saveRecord(openBarrier: boolean = false) {
    let errMsg = ''
    // Validasi input
    const contractorName = this.contractorNameInput.value;
    const contractorContactNo = this.contractorContactNumberInput.value;
    const identificationNumber = this.nric_value;
    const contractorVehicle = this.contractorVehicleNumberInput.value;
    const companyName = this.contractorCompanyNameInput.value;
    const remarks = this.remarksInput.value;

    if (!contractorName) {
      errMsg += 'Contractor name is required! \n'
    }
    if (!contractorContactNo) {
      errMsg += 'Contact number is required! \n'
    }
    if (contractorContactNo) {
      if (contractorContactNo.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (!this.identificationType) {
      errMsg += 'Identification type must be selected! \n'
    }
    if (!identificationNumber && !this.contractor_passport) {
      errMsg += 'Identification number or passport number is required! \n'
    }
    if (identificationNumber && (identificationNumber.length > this.max_digit || identificationNumber.length < this.min_digit)) {
      errMsg += `Identification number cannot be more than ${this.max_digit} digits or less than ${this.min_digit}! \n`
    }
    if (!contractorVehicle) {
      errMsg += 'Vehicle number is required! \n'
    }
    if (!companyName) {
      errMsg += 'Company name is required! \n'
    }
    if (!this.selectedHost) {
      errMsg += 'Host must be selected! \n'
      console.log('Host must be selected')
    }
    if (!this.contractor_total_package) {
      errMsg += 'Total package is required! \n'
    }
    // if (!this.contractor_expired_date) {
    //   errMsg += 'SIC expired date is required! \n'
    // }
    if (!this.contractor_entry_purpose) {
      errMsg += 'Entry purpose is required! \n'
    }
    if (!this.contractor_gate_pass_number) {
      errMsg += 'Gate pass number is required! \n'
    }
    if (!this.contractor_pass_number) {
      errMsg += 'Pass number is required! \n'
    }
    if (this.checkPaxData()) {
      errMsg += `All names and NRICs (or Passport) of contractor members must be filled in or NRICs cannot be more than ${this.max_digit} digits or less than ${this.min_digit}! \n`
    }
    if (errMsg) {
      this.presentToast(errMsg, 'danger')
      return
    }

    this.collectPaxData();

    const subContractors = this.paxData.map(pax => ({
      contractor_name: pax.contractor_name, // Pastikan ini sesuai dengan nama property yang benar
      identification_number: pax.identification_number, // Pastikan ini sesuai dengan nama property yang benar
      identification_type: pax.identification_type
    }));

    console.log("subcon", subContractors);
    console.log("paxdata", this.paxData);

    this.collectForm = {
      contractor_name: contractorName,
      contractor_contact_no: contractorContactNo,
      company_name: companyName,
      identification_type: this.identificationType,
      identification_number: this.identificationType == 'passport' ? this.contractor_passport : identificationNumber,
      contractor_vehicle: contractorVehicle,
      host: this.selectedHost,
      remarks: remarks,
      sub_contractors: subContractors,
      project_id: this.project_id,
      total_package: this.contractor_total_package,
      expired_date: this.contractor_expired_date,
      purpose: this.contractor_entry_purpose,
      gate_pass: this.contractor_gate_pass_number,
      pass_number: this.contractor_pass_number,
    }
    console.log(this.collectForm)
    try {
      this.mainVmsService.getApi(this.collectForm, '/commercial/post/add_contractors').subscribe({
        next: (response: any) => {
          if (response.result.status_code === 200) {
            if (openBarrier) {
              this.functionMain.presentToast('Contractor data has been successfully saved, and the barrier is now open!', 'success');
              this.router.navigate(['home-vms'])
            } else {
              this.functionMain.presentToast('Contractor data has been successfully saved to the system!', 'success');
            }
            this.router.navigate(['home-vms'])
            this.resetForm();
          } else if (response.result.status_code === 401) {
            this.functionMain.presentToast(response.result.status_description, 'warning');
          }
          else {
            this.functionMain.presentToast('An error occurred while attempting to save contractor data', 'danger');
          }
        },
        error: (error) => {
          console.error('Error:', error.result.status_description);
          this.presentToast('An unexpected error has occurred!', 'danger');
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.presentToast('An unexpected error has occurred!', 'danger');
    }
  }

  resetForm() {
    this.identificationType = '';
    this.contractorNameInput.value = '';
    this.contractorContactNumberInput.value = '';
    this.nric_value = '';
    this.contractorVehicleNumberInput.value = '';
    this.contractorCompanyNameInput.value = '';
    this.remarksInput.value = '';
    this.paxCount = 0
    this.contractor_passport = ''
    this.formData.contact_number = ''

    this.selectedHost = ''
    this.contractor_pass_number = ''
    this.contractor_gate_pass_number = ''
    this.contractor_expired_date = ''
    this.contractor_total_package = 0
    this.contractor_entry_purpose = ''
    this.contractor_entry_date = ''

    this.checkoutForm = {
      identification_number: '',
      identification_type: '',
      pass: '',
      passport: '',
      contact_number: '',
    }
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

  Host: any[] = [];
  selectedHost: string = '';
  loadHost() {
    this.mainVmsService.getApi({ project_id: this.project_id }, '/commercial/get/host').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
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
    this.selectedUnit = ''
    this.blockUnitService.getUnit(this.selectedBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
        } else {
          this.presentToast('An error occurred while loading unit data!', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading unit data!', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  vehicle_number = ''

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.contractorVehicleNumberInput.value = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

  formData = {
    contractor_name: '',
    contractor_vehicle: '',
    company_name: '',
    contact_number: '',
  };

  contractor_passport = ''
  contactHost = ''

  getContactInfo(contactData: any) {
    this.selectedUnit = ''
    if (contactData) {
      this.formData.contractor_name = contactData.visitor_name
      this.formData.contractor_vehicle = contactData.vehicle_number
      setTimeout(()=>{
        this.selectedUnit = contactData.host_id
      }, 300)
      // this.selectedBlock = contactData.block_id
      // this.loadUnit().then(() => {
      //   this.selectedUnit = contactData.unit_id
      // })
    }
    console.log(this.selectedUnit)
  }

  nric_value = ''

  openNricScan(order: number = 0, is_pax: boolean = false, is_checkout: boolean = false) {
    if (this.is_checkout) return
    this.functionMain.presentModalNric().then(value => {
      if (value) {
        if (is_checkout) {
          this.checkoutForm.identification_number = value.data
          this.checkoutForm.identification_type = value.is_fin ? 'fin' : 'nric'
        } else {
          if (is_pax) {
            this.paxIdentity[order] = value.data
            this.typeIdentity[order] = value.is_fin ? 'fin' : 'nric'
          } else {
            console.log(value)
            this.identificationType = value.is_fin ? 'fin' : 'nric'
            this.nric_value = value.data;
          }
          this.mainVmsService.getApi({ nric: value.data, project_id: this.project_id }, '/vms/get/contractor_by_nric').subscribe({
            next: (results) => {
              console.log(results)
              if (results.result.status_code === 200) {
                let data = results.result.result[0]
                if (is_pax) {
                  this.nameIdentity[order] = data.contractor_name
                } else {
                  console.log(value)
                  this.formData.contractor_name = data.contractor_name
                  this.formData.company_name = data.company_name
                  this.formData.contact_number = data.contact_number
                  this.formData.contractor_vehicle = data.vehicle_number
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
              this.presentToast('An error occurred while searching for nric!', 'danger');
              console.error(error);
            }
          });
        }
      }

    });
    console.log(this.nric_value)
  }

  showCheckInTrans = false
  showCheckIn = true
  showCheckOutTrans = false
  showCheckOut = false

  toggleShowCheckIn() {
    if (!this.showCheckOutTrans && this.showCheckOut) {
      if (this.is_checkout) {
        this.resetForm()
      }
      this.data_is_checkout = false
      this.showCheckoutSearch = false
      this.showCheckInTrans = true
      this.showCheckOut = false;
      this.is_checkout = false
      this.is_pax = false
      this.is_allow_scan = false
      this.is_checkout_scan = false
      setTimeout(() => {
        this.showCheckIn = true;
        this.showCheckInTrans = false
      }, 300)
    }
  }

  faSearch = faSearch
  remarksValue = ''

  toggleShowCheckOut() {
    if (!this.showCheckInTrans && !this.showCheckoutSearch) {
      this.resetForm()
      this.data_is_checkout = false
      this.is_checkout = false
      this.showCheckOutTrans = true
      this.showCheckIn = false;
      this.is_pax = false
      this.is_allow_scan = false
      this.is_checkout_scan = false
      setTimeout(() => {
        this.showCheckoutSearch = true
        this.showCheckOut = true;
        this.showCheckOutTrans = false
      }, 300)
    }
  }

  checkoutForm = {
    identification_type: '',
    identification_number: '',
    contact_number: '',
    pass: '',
    passport: '',
  }

  showCheckoutSearch = false
  is_checkout = false
  data_is_checkout = false

  searchData(type: string) {
    let params = {}
    console.log(this.checkoutForm)
    this.mainVmsService.getApi({ identification_number: this.checkoutForm.identification_type == 'passport' ? this.checkoutForm.passport : this.checkoutForm.identification_number, contact_number: this.checkoutForm.contact_number, pass_number: this.checkoutForm.pass, project_id: this.project_id }, '/commercial/get/contractor_by_spec').subscribe({
      next: (response: any) => {
        console.log(response)
        if (response.result.response_code === 200) {
          if (response.result.response_result.length > 0) {
            let data = response.result.response_result[0]
            console.log(data)
            this.contractor_id = data.contractor_id
            this.selectedHost = data.host_id
            this.identificationType = data.identification_type
            this.formData = {
              contractor_name: data.contractor_name,
              contractor_vehicle: data.vehicle_number,
              company_name: data.company_name,
              contact_number: data.contact_number,
            };
            this.remarksValue = data.remarks
            this.nric_value = data.identification_number
            this.contractor_passport = data.identification_number
            this.paxCount = data.subcon_total
            this.contractor_pass_number = data.pass_number
            this.contractor_gate_pass_number = data.gate_pass
            this.contractor_expired_date = data.expired_date
            this.contractor_total_package = data.total_package ? data.total_package : '0'
            this.contractor_entry_purpose = data.purpose
            this.checkout_host_name = data.host_name ? data.host_name : ''
            this.data_is_checkout = data.is_checkout
            this.contractor_entry_date = this.functionMain.convertNewDateTZ(data.create_date).split(' ')[0]
            // console.log(this.contractor_entry_date)
            // this.contractor_entry_date = this.functionMain.convertToDDMMYYYY(this.contractor_entry_date.split(' ')[0])
            for (let i = 0; i < this.paxCount; i++) {
              this.nameIdentity[i] = data.subcon[i].contractor_name
              this.paxIdentity[i] = data.subcon[i].identification_number
              this.typeIdentity[i] = data.subcon[i].identification_type
            }
            console.log(this.identificationType)
            this.showCheckoutSearch = false
            setTimeout(() => {
              this.is_checkout = true
            }, 300)
          } else {
            this.presentToast('No contractor found', 'danger');
          }
        } else {
          this.presentToast('An error occurred while attempting to save contractor data', 'danger');
        }
      },
      error: (error) => {
        console.error('Error:', error.result.status_description);
        this.presentToast('An unexpected error has occurred!', 'danger');
      }
    });
  }

  checkoutSelected() {
    console.log(this.formData)
    this.mainVmsService.getApi({ id: this.contractor_id, remarks: this.remarksValue, total_package: this.contractor_total_package, pass_number: this.contractor_pass_number, project_id: this.project_id }, '/commercial/post/contractor_checkout').subscribe({
      next: (response: any) => {
        console.log(response)
        if (response.result.status_code === 200) {
          this.presentToast('Successfully checkout contractor', 'success');
          this.toggleShowCheckOut()
        } else {
          this.presentToast('An error occurred while attempting to checkout contractor data', 'danger');
        }
      },
      error: (error) => {
        console.error('Error:', error.result.status_description);
        this.presentToast('An error occurred while attempting to checkout contractor data!', 'danger');
      }
    });
  }

  contractor_pass_number = ''
  contractor_gate_pass_number = ''
  contractor_expired_date = ''
  contractor_total_package = 0
  contractor_entry_purpose = ''
  contractor_entry_date = ''
  contractor_id = 0
  checkout_host_name = ''

  onExpiredDateChange(event: any) {
    console.log(event.target.value)
    this.contractor_expired_date = event.target.value
  }

  is_allow_scan = false
  is_checkout_scan = false
  is_pax = false
  pax_id = ''

  nricFocus() {
    if (this.project_config.is_industrial && !this.is_allow_scan && !this.is_checkout) {
      console.log("FOCUS")
      let nric_temp = this.nric_value
      this.nric_value = ''
      this.is_allow_scan = true
      setTimeout(() => {
        if (this.nric_value == '') {
          this.nric_value = nric_temp
        }
        this.is_allow_scan = false
      }, 5000);
    }
  }

  nricCheckoutFocus(){
    if (this.project_config.is_industrial && !this.is_checkout_scan) {
      console.log("FOCUS CHECKOUT")
      let nric_temp = this.checkoutForm.identification_number
      this.checkoutForm.identification_number = ''
      this.is_checkout_scan = true
      setTimeout(() => {
        if (this.checkoutForm.identification_number == '') {
          this.checkoutForm.identification_number = nric_temp
        }
        this.is_checkout_scan = false
      }, 5000);
    }
  }

  nricPaxFocus(id: number){
    if (this.project_config.is_industrial && !this.is_pax && !this.is_checkout) {
      if (!this.paxIdentity[id]) {
        this.paxIdentity[id] = ''; // Inisialisasi jika belum ada
      }
      let nric_temp = this.paxIdentity[id]
      this.paxIdentity[id] = ''
      console.log("FOCUS PAX")
      this.is_pax = true
      this.pax_id = id.toString()
      setTimeout(() => {
        if (this.paxIdentity[id] == '') {
          this.paxIdentity[id] = nric_temp
        }
        this.is_pax = false
        this.pax_id = ''
      }, 5000);
    }
  }

  lastKeypressTime: number = 0;
  scanThreshold: number = 50;
  ignored_string = ''
  temp_nric = ''
  @HostListener('document:keydown', ['$event'])
  handleScannerInput(event: KeyboardEvent) {
    console.log(this.is_allow_scan,this.is_checkout_scan,this.is_pax)
    if (!this.is_allow_scan && !this.is_checkout_scan && !this.is_pax) return

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastKeypressTime;
    this.lastKeypressTime = currentTime;
    if (event.key === 'Shift') {
      return;
    } else if (event.key === 'Enter') {
      this.processNric(this.temp_nric)
      // if (this.is_allow_scan) {
      //   this.nric_value = this.temp_nric; 
      //   // this.nric_value += event.key
      // }
      // if (this.is_checkout_scan) {
      //   this.checkoutForm.identification_number = this.temp_nric; 
      //   // this.checkoutForm.identification_number += event.key
      // }
      // if (this.is_pax) {
      //   this.paxIdentity[parseInt(this.pax_id)] = this.temp_nric;
      //   // this.paxIdentity[parseInt(this.pax_id)] += event.key
      // }
      this.temp_nric = ''
      this.is_allow_scan = false
      this.is_checkout_scan = false
      this.is_pax = false
      this.pax_id = ''
    } else {
      if (timeDiff < this.scanThreshold) {
        this.temp_nric += this.ignored_string
        this.temp_nric += event.key
      
        this.ignored_string = ''
      } else {
        this.ignored_string = event.key
        console.log('Ignored human typing:', event.key);
      }
    }

  }

  processNric(nric_temp: string) {
    let is_allow_scan = this.is_allow_scan
    let is_checkout_scan = this.is_checkout_scan
    let is_pax = this.is_pax
    let pax_id = this.pax_id
    let min_digit = this.min_digit ? this.min_digit : 8
    let max_digit = this.max_digit ? this.max_digit : 9
    let nric = nric_temp;
    let nric_clear = nric.replace(/([A-Za-z]\d+)([A-Za-z])\d+/, '$1$2');
    console.log(nric, nric_clear, nric_clear.length)
    console.log(min_digit, max_digit)
    let nric_after = nric_clear.split('').map((char: any, index: number) => (index >= 1 && index <= nric_clear.length - 5 ? 'X' : char)).join('')
    if (is_allow_scan) {
      if (nric_clear.length > max_digit) {
        // this.presentToast(`NRIC / FIN cannot be more than ${max_digit} digits.`, 'danger');
        this.nric_value = ''
      } else if (nric_clear.length < min_digit) {
        // this.presentToast(`NRIC / FIN must be at least ${min_digit} digits.`, 'danger');
        this.nric_value = ''
      } else {
        this.nric_value = nric_after
        this.identificationType = /\d$/.test(nric) ? 'fin' : 'nric'   
      }
    }
    if (is_checkout_scan) {
      if (nric_clear.length > max_digit) {
        this.presentToast(`NRIC / FIN cannot be more than ${max_digit} digits.`, 'danger');
        this.checkoutForm.identification_number = ''
      } else if (nric_clear.length < min_digit) {
        this.presentToast(`NRIC / FIN must be at least ${min_digit} digits.`, 'danger');
        this.checkoutForm.identification_number = ''
      } else {
        this.checkoutForm.identification_type = /\d$/.test(nric) ? 'fin' : 'nric'   
        this.checkoutForm.identification_number = nric_after; 
      }
    }
    if (is_pax) {
      if (nric_clear.length > max_digit) {
        this.presentToast(`NRIC / FIN cannot be more than ${max_digit} digits.`, 'danger');
        this.paxIdentity[parseInt(pax_id)] = ''
      } else if (nric_clear.length < min_digit) {
        this.presentToast(`NRIC / FIN must be at least ${min_digit} digits.`, 'danger');
        this.paxIdentity[parseInt(pax_id)] = ''
      } else {
        this.typeIdentity[parseInt(pax_id)] = /\d$/.test(nric) ? 'fin' : 'nric' 
        this.paxIdentity[parseInt(pax_id)] = nric_after;
      }
    }
    if (is_checkout_scan) return
    this.mainVmsService.getApi({ nric: nric_after, project_id: this.project_id }, '/vms/get/contractor_by_nric').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.status_code === 200) {
          let data = results.result.result[0]
          if (is_pax) {
            this.paxIdentity[parseInt(pax_id)] = data.identification_number
            this.nameIdentity[parseInt(pax_id)] = data.contractor_name
          } 
          if (is_allow_scan) {
            this.formData.contractor_name = data.contractor_name
            this.formData.company_name = data.company_name
            this.formData.contact_number = data.contact_number
            this.formData.contractor_vehicle = data.vehicle_number
            this.nric_value = data.identification_number
          }
        } else {
          if (is_pax) {
            this.paxData[parseInt(pax_id)].contractor_name = this.paxData[parseInt(pax_id)].contractor_name ? this.paxData[parseInt(pax_id)].contractor_name : ''
          } 
          if (is_allow_scan) {
            this.formData.contractor_name = this.formData.contractor_name ? this.formData.contractor_name : ''
            this.formData.company_name = this.formData.company_name ? this.formData.company_name : ''
            this.formData.contact_number = this.formData.contact_number ? this.formData.contact_number : '65'
            this.formData.contractor_vehicle = this.formData.contractor_vehicle ? this.formData.contractor_vehicle : ''
          }
          this.functionMain.presentToast(`No data found in the system for ${nric_after}!`, 'warning')
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while searching for nric!', 'danger');
        console.error(error);
      }
    });
  }

  onNricInput(event: any) {
    if (!this.is_allow_scan) return
    console.log(this.nric_value)
    let min_digit = this.min_digit ? this.min_digit : 8
    let max_digit = this.max_digit ? this.max_digit : 9
    let nric = this.nric_value;
    let nric_clear = nric.replace(/([A-Za-z]\d+)([A-Za-z])\d+/, '$1$2');
    console.log(nric, nric_clear, nric_clear.length)
    console.log(min_digit, max_digit)
    // if (nric_clear.length > max_digit) {
    //   // this.presentToast(`NRIC / FIN cannot be more than ${max_digit} digits.`, 'danger');
    //   this.nric_value = ''
    // }
    // if (nric_clear.length < min_digit) {
    //   // this.presentToast(`NRIC / FIN must be at least ${min_digit} digits.`, 'danger');
    //   this.nric_value = ''
    // }
    this.nric_value = nric_clear.split('').map((char: any, index: number) => (index >= 1 && index <= nric_clear.length - 5 ? 'X' : char)).join('')
    this.identificationType = /\d$/.test(nric) ? 'fin' : 'nric'
  }

  onNricCheckoutInput(event: any) {
    if (!this.is_checkout_scan) return
    console.log(this.checkoutForm.identification_number)
    let min_digit = this.min_digit ? this.min_digit : 8
    let max_digit = this.max_digit ? this.max_digit : 9
    let nric = this.checkoutForm.identification_number;
    let nric_clear = nric.replace(/([A-Za-z]\d+)([A-Za-z])\d+/, '$1$2');
    console.log(nric, nric_clear, nric_clear.length)
    console.log(min_digit, max_digit)
    this.checkoutForm.identification_number = nric_clear.split('').map((char: any, index: number) => (index >= 1 && index <= nric_clear.length - 5 ? 'X' : char)).join('')
    this.checkoutForm.identification_type = /\d$/.test(nric) ? 'fin' : 'nric'    
  }

  nricPaxChange(event: any, i: any) {
    if (!this.is_pax) return
    console.log(this.paxIdentity[i])
    let min_digit = this.min_digit ? this.min_digit : 8
    let max_digit = this.max_digit ? this.max_digit : 9
    let nric = this.paxIdentity[i];
    let nric_clear = nric.replace(/([A-Za-z]\d+)([A-Za-z])\d+/, '$1$2');
    console.log(nric, nric_clear, nric_clear.length)
    console.log(min_digit, max_digit)
    this.paxIdentity[i] = nric_clear.split('').map((char: any, index: number) => (index >= 1 && index <= nric_clear.length - 5 ? 'X' : char)).join('')
  }

  min_digit = 0
  max_digit = 0

  async getMinMaxNric() {
    try {
      const results = await this.mainVmsService.getApi({ project_id: this.project_id }, '/vms/get/nric_constraint').toPromise();
      console.log(results.result);
      if (results.result.response_code === 200) {
        this.min_digit = results.result.result.min_nric_number_length
        this.max_digit = results.result.result.max_nric_number_length
      } else {
        this.functionMain.presentToast('Failed to get minimum and maximum digit of NRIC / FIN!', 'danger');
      }
    } catch (error) {
      this.functionMain.presentToast('Failed to get minimum and maximum digit of NRIC / FIN!', 'danger');
      console.error(error);
    }
  }

  changeType(i: number) {
    this.paxIdentity[i] = ''
    if (['nric', 'fin'].includes(this.typeIdentity[i]) ) {
      this.is_pax = false
      this.typeIdentity[i] = 'passport'
    } else {
      this.typeIdentity[i] = 'nric'
    }
  }

}
