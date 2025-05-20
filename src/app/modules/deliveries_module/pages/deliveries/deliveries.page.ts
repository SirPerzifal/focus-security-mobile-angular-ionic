import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FoodPlatformService } from 'src/app/service/vms/food_platform/food-platform.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.page.html',
  styleUrls: ['./deliveries.page.scss'],
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
export class DeliveriesPage implements OnInit {

  deliveriesType = [
    { icon: 'faPersonWalking', text: 'WALK IN', isActive: false },
    { icon: 'faCarSide', text: 'DRIVE IN', isActive: false },
  ];
  foodDeliveryButtons = [
    { image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'Not Exist', isActive: false, id: '0' }
  ];
  packageDeliveryButtons = [
    { image: 'assets/icon/deliveries-icon/Package.webp', text: 'Not Exist', isActive: false, id: '0' },
  ];

  constructor(
    private foodPlatform: FoodPlatformService, 
    private router: Router, 
    private toastController: ToastController, 
    private blockUnitService: BlockUnitService, 
    private functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
  ) { }

  package_delivery_type = ""
  food_delivery_type = ""

  food_delivery_id = ''
  package_delivery_id = ''

  Block: any[] = [];
  Unit: any[] = [];

  formData = {
    contact_number: '', 
    vehicle_number: '', 
    delivery_type: '', 
    food_delivery: {
      id: 0,
      other: 'Test Others',
      delivery_option: 'walk_in'
    }, 
    package_delivery: {
      id: 0,
      other: 'Test Others',
      delivery_option: 'single'
    }, 
    block: '', 
    unit: '',
    pax:'0',
    remarks: ''
  };

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.Camera = value.config.lpr
      this.project_config = value.config
    })
  }
  
  Camera: any = []
  project_id = 0
  project_config: any = []

  getFoodPlatform() {
    this.foodDeliveryButtons = []
    this.foodPlatform.getFoodPlatForm(this.project_id).subscribe(
      res => {
        var result = res.result['result']
        console.log(result)
        if (result) {
          result.forEach((item: any) => {
            const base64Image = item['icon'];
            const formattedImage = base64Image ? `data:image/png;base64,${base64Image}` : 'assets/icon/deliveries-icon/FoodBar.webp'; 
            this.foodDeliveryButtons.push({image: formattedImage, text: item['name'], isActive: false, id: item['id']});
          });
        } 
        this.foodDeliveryButtons.push({image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'OTHERS', isActive: false, id: 'other'});
      },
      error => {
        console.log(error)
        this.foodDeliveryButtons.push({image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'OTHERS', isActive: false, id: 'other'});
      }
    )
  }

  getPackagePlatform() {
    this.packageDeliveryButtons = []
    this.foodPlatform.getPackagePlatForm(this.project_id).subscribe(
      res => {
        var result = res.result['result']
        console.log(result)
        if (result) {
          result.forEach((item: any) => {
            const base64Image = item['icon'];
            const formattedImage = base64Image ? `data:image/png;base64,${base64Image}` : 'assets/icon/deliveries-icon/Package.webp'; 
            console.log(formattedImage)
            this.packageDeliveryButtons.push({image: formattedImage, text: item['name'], isActive: false, id: item['id']});
            console.log(item)
          });
        }
        this.packageDeliveryButtons.push({image: 'assets/icon/deliveries-icon/Package.webp', text: 'OTHERS', isActive: false, id: 'other'});
      },
      error => {
        console.log(error)
        this.packageDeliveryButtons.push({image: 'assets/icon/deliveries-icon/Package.webp', text: 'OTHERS', isActive: false, id: 'other'});
      }
    )
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  onSubmitFood(openBarrier: boolean = false, camera_id: string = '') {
    console.log(openBarrier)
    console.log(this.formData)
    let errMsg = ""
    if (!this.food_delivery_id){
      errMsg += 'Please select a delivery platform!\n';
    }
    if (!this.food_delivery_type){
      errMsg += 'Please select a delivery type!\n';
    }
    if (!this.selectedImage) {
      errMsg += 'Visitor image is required!\n';
    }
    if ((!this.identificationType) && this.project_config.is_industrial) {
      errMsg += 'Identification type is required!\n';
    }
    if ((!this.nric_value) && this.project_config.is_industrial) {
      errMsg += 'Identification number is required!\n';
    }
    if (!this.formData.contact_number){
      errMsg += 'Please insert a contact number!\n';
    }
    if (this.formData.contact_number) {
      if (this.formData.contact_number.length <= 2 ) {
        errMsg += 'Please insert a contact number! \n'
      }
    }
    if (this.food_delivery_type == 'drive_in' && !this.formData.vehicle_number){
      errMsg += 'Please insert a vehicle number!\n';
    }
    if ((!this.formData.block || !this.formData.unit) && !this.project_config.is_industrial){
      errMsg += 'Please insert a block and unit!\n';
    }
    if ((!this.selectedHost) && this.project_config.is_industrial){
      errMsg += 'Please insert a host!\n';
    }
    if (!this.pass_number && this.project_config.is_industrial) {
      errMsg += 'Pass number is required! \n'
    }
    if(errMsg != ""){
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    try {
      let params = {
        contact_number: this.formData.contact_number,
        vehicle_number: this.food_delivery_type === 'drive_in' ? this.formData.vehicle_number : '',
        delivery_type: 'food',
        food_delivery: {
          id: this.food_delivery_id === 'other' ? 0 : parseInt(this.food_delivery_id),
          other: this.food_delivery_id === 'other' ? 'Others Checked' : '',
          delivery_option: this.food_delivery_type
        },
        package_delivery: {},
        block: this.formData.block,
        unit: this.formData.unit,
        multiple_unit: {},
        project_id: this.project_id,
        camera_id: camera_id,
        host: this.selectedHost,
        identification_type: this.identificationType,
        identification_number: this.nric_value,
        pass_number: this.pass_number,
        visitor_image: this.selectedImage,
      }
      this.clientMainService.getApi(params, '/vms/post/add_deliveries').subscribe(
        res => {
          console.log(res);
          if (res.result.status_code == 200){
            if (openBarrier){
              this.functionMain.presentToast('Successfully Insert Food Delivery Record and Opened the Barrier', 'success');
            } else {
              this.functionMain.presentToast('Successfully Insert Food Delivery Record', 'success');
            }
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 205) {
            if (openBarrier) {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
            } else {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
            }
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 405) {
            this.functionMain.presentToast('An error occurred while trying to create offence for this alerted visitor!', 'danger');
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 206) {
            this.functionMain.banAlert(res.result.status_description, this.formData.unit, this.selectedHost)
          } else {
            this.functionMain.presentToast('Failed To Insert Food Delivery Record', 'danger');
          }
        },
        error => {
          this.functionMain.presentToast('An error occurred while submitting delivery data!', 'danger');
          console.error('Error:', error);
        }
      );
    } catch (error){
      console.error('Unexpected error:', error);
      this.functionMain.presentToast(String(error), 'danger');
    }
    
  }

  resetForm() {
    this.formData = {
      contact_number: '', 
      vehicle_number: '', 
      delivery_type: '', 
      food_delivery: {
        id: 0,
        other: '',
        delivery_option: ''
      }, 
      package_delivery: {
        id: 0,
        other: '',
        delivery_option: ''
      }, 
      block: '', 
      unit: '',
      pax:'0',
      remarks: ''
    };
    this.food_delivery_id = ''
    this.package_delivery_id = ''
    this.food_delivery_type = ''
    this.package_delivery_type = ''
    this.foodDeliveryButtons.forEach(button => button.isActive = false);
    this.deliveriesType.forEach(button => button.isActive = false);
    this.packageDeliveryButtons.forEach(button => button.isActive = false);
    this.Unit = []
    this.selectedHost = ''
    this.contactHost = ''
    this.contactUnit = ''
    this.selectedNric = ''
    this.pass_number = ''
    this.otherDeliveryForm = {
      visitor_name: '',
      visitor_contact_no: '',
      visitor_vehicle: '',
      company_name: '',
      remarks: '',
    };
    this.pass_number = ''
    this.selectedImage = ''
    this.refreshVehicle()
  }

  onSubmitPackage(openBarrier: boolean = false, camera_id: string = '') {
    console.log(openBarrier)
    let mutiple_unit = {
      pax: '0',
      remarks: ''
    }
    console.log('PACKAGE')
    let errMsg = ""
    if (!this.package_delivery_id){
      errMsg += 'Please select a delivery platform!\n';
    }
    if (!this.package_delivery_type){
      errMsg += 'Please select a delivery type!\n';
    }
    if (!this.selectedImage) {
      errMsg += 'Visitor image is required!\n';
    }
    if (!this.formData.contact_number){
      errMsg += 'Please insert visitor contact number!\n';
    }
    if (this.formData.contact_number) {
      if (this.formData.contact_number.length <= 2 ) {
        errMsg += 'Please insert a contact number! \n'
      }
    }
    if ((!this.identificationType) && this.project_config.is_industrial) {
      errMsg += 'Identification type is required!\n';
    }
    if ((!this.nric_value) && this.project_config.is_industrial) {
      errMsg += 'Identification number is required!\n';
    }
    if (!this.formData.vehicle_number){
      errMsg += 'Please insert visitor vehicle number!\n';
    }
    if (this.package_delivery_type == "single" && (!this.formData.block || !this.formData.unit) && !this.project_config.is_industrial){
      errMsg += 'Please insert visitor block and unit!\n';
    }
    if (this.package_delivery_type == "single" && (!this.selectedHost) && this.project_config.is_industrial){
      errMsg += 'Please insert a visitor host!\n';
    }
    if (this.package_delivery_type == "multiple" && this.formData.pax == "0"){
      errMsg += 'Please insert number of Pax!\n';
    }
    if(errMsg != ""){
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    try{
      let params = {
        contact_number: this.formData.contact_number,
        vehicle_number: this.formData.vehicle_number,
        delivery_type: 'package',
        food_delivery: {}, // Kosong karena bukan food delivery
        package_delivery: {
          id: this.package_delivery_id === 'other' ? 0 : parseInt(this.package_delivery_id),
          other: this.package_delivery_id === 'other' ? 'Others Checked' : '',
          delivery_option: this.package_delivery_type
        },
        block: this.package_delivery_type === 'multiple' ? '' : this.formData.block,
        unit: this.package_delivery_type === 'multiple' ? '' : this.formData.unit,
        multiple_unit: {
          pax: this.formData.pax,
          remarks: this.formData.remarks
        },
        project_id: this.project_id,
        camera_id: camera_id,
        host: this.selectedHost,
        identification_type: this.identificationType,
        identification_number: this.nric_value,
        pass_number: '',
        visitor_image: this.selectedImage,
      }
      
      this.clientMainService.getApi(params, '/vms/post/add_deliveries').subscribe(
        res => {
          console.log(res);
          if (res.result.status_code == 200){
            if (openBarrier){
              console.log("Barrier Opened")
              this.functionMain.presentToast('Successfully Insert Package Delivery Record and Opened the Barrier', 'success');
            }else {
              this.functionMain.presentToast('Successfully Insert Package Delivery Record', 'success');
            }
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 205) {
            if (openBarrier) {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
            } else {
              this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
            }
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 405) {
            this.functionMain.presentToast('An error occurred while trying to create offence for this alerted visitor!', 'danger');
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 206) {
            this.functionMain.banAlert(res.result.status_description, this.package_delivery_type === 'multiple' ? false : this.formData.unit, this.selectedHost)
          } else {
            this.functionMain.presentToast('Failed To Insert Package Delivery Record', 'danger');
          }
        },
        error => {
          this.functionMain.presentToast('An error occurred while submitting delivery data!', 'danger');
          console.error('Error:', error);
        }
      );
    } catch (error){
      console.error('Unexpected error:', error);
      this.functionMain.presentToast(String(error), 'danger');
    }
    
  }

  // Tambahkan objek untuk status aktif tombol
  buttonStates = {
    foodDeliveries: false,
    packageDeliveries: false,
    bulkyItemDeliveries: false,
    OthersDeliveries: false,
  };

  foodDeliveries = false; // Ubah menjadi false secara default
  packageDeliveries = false;
  bulkyItemDeliveries = false;
  otherDeliveries = false

  foodDeliveriesTrans = false;
  packageDeliveriesTrans = false;
  bulkyItemDeliveriesTrans = false;
  otherDeliveriesTrans = false

  toggleFoodDeliveries() {
    if (!this.bulkyItemDeliveriesTrans && !this.packageDeliveriesTrans) {
      if (!this.foodDeliveries) {
        this.resetForm()
      }
      this.foodDeliveriesTrans = true
      this.bulkyItemDeliveries = false;
      this.packageDeliveries = false;
      this.otherDeliveries = false

      // Update status tombol
      this.buttonStates.foodDeliveries = true;
      this.buttonStates.packageDeliveries = false;
      this.buttonStates.bulkyItemDeliveries = false;
      this.buttonStates.OthersDeliveries = false

      setTimeout(() => {
        this.foodDeliveries = true;
        this.foodDeliveriesTrans = false
      }, 300)
    }
  }

  togglePackageDeliveries() {
    if (!this.foodDeliveriesTrans && !this.bulkyItemDeliveriesTrans) {
      if (!this.packageDeliveries) {
        this.resetForm()
      }
      this.packageDeliveriesTrans = true
      this.bulkyItemDeliveries = false;
      this.foodDeliveries = false;

      // Update status tombol
      this.buttonStates.foodDeliveries = false;
      this.buttonStates.packageDeliveries = true;
      this.buttonStates.bulkyItemDeliveries = false;

      setTimeout(() => {
        this.packageDeliveries = true;
        this.packageDeliveriesTrans = false
        this.refreshVehicle()
      }, 300)
    }
  }

  toggleBulkyItemDeliveries() {
    if (!this.foodDeliveriesTrans && !this.packageDeliveriesTrans) {
      if (!this.bulkyItemDeliveries) {
        this.resetForm()
      }
      this.bulkyItemDeliveriesTrans = true
      this.packageDeliveries = false;
      this.foodDeliveries = false;

      // Update status tombol
      this.buttonStates.foodDeliveries = false;
      this.buttonStates.packageDeliveries = false;
      this.buttonStates.bulkyItemDeliveries = true;

      setTimeout(() => {
        this.bulkyItemDeliveries = true;
        this.bulkyItemDeliveriesTrans = false
      }, 300)
    }
  }

  toggleOtherDeliveries() {
    if (!this.foodDeliveriesTrans) {
      if (!this.bulkyItemDeliveries) {
        this.resetForm()
      }
      this.otherDeliveriesTrans = true
      this.foodDeliveries = false;

      this.buttonStates.foodDeliveries = false;
      this.buttonStates.OthersDeliveries = true;

      this.showDrive = false
      this.showWalk = false
      this.showForm = false

      setTimeout(() => {
        this.otherDeliveries = true;
        this.otherDeliveriesTrans = false
      }, 300)
    }
  }

  showWalkIn = false;
  showDriveIn = false;

  toggleWalkIn() {
    this.showDriveIn = false;
    this.showWalkIn = true;
  }

  toggleDriveIn() {
    this.showWalkIn = false;
    this.showDriveIn = true;
  }

    // Metode untuk menangani klik tombol
  onButtonClick(event: { text: string, isActive: boolean }) {
    console.log(`Button clicked: ${event.text}, Active: ${event.isActive}`);
  }

  toggleDeliveryButton(selectedButton: any) {
    // Reset all buttons to inactive
    console.log(selectedButton)
    // Set the selected button to active
    console.log(this.food_delivery_id)
    if (this.foodDeliveries) {
      this.foodDeliveryButtons.forEach(button => button.isActive = false);
      if(this.food_delivery_id != String(selectedButton.id)){
        this.food_delivery_id = String(selectedButton.id)
      } else {
        this.food_delivery_id = ''
      }
    }

    if (this.packageDeliveries) {
      this.packageDeliveryButtons.forEach(button => button.isActive = false);
      if(this.package_delivery_id != String(selectedButton.id)){
        this.package_delivery_id = String(selectedButton.id)
      } else {
        this.package_delivery_id = ''
      }
    }
    console.log('new', this.food_delivery_id)

    selectedButton.isActive = !selectedButton.isActive;

    // Handle any additional logic needed for the button click
    console.log(`Button clicked: ${String(selectedButton.id)}, Active: ${selectedButton.isActive}`);
    
  }

  toggleDeliveryTypeButton(selectedButton: any) {
    // Reset all buttons to inactive
    let mark = false
    this.deliveriesType.forEach(button => button.isActive = false);
    // Set the selected button to active

    selectedButton.isActive = true;

    // Handle any additional logic needed for the button click
    if (this.food_delivery_type == 'walk_in' && selectedButton.text == 'WALK IN') {
      mark = true
    }
    if (this.food_delivery_type == 'drive_in' && selectedButton.text == 'DRIVE IN') {
      mark = true
    }
    if (mark){
      this.food_delivery_type = ''
    } else {
      this.food_delivery_type = selectedButton.text == 'WALK IN' ? 'walk_in' : 'drive_in'
      if (selectedButton.text == 'drive_in') {
        this.refreshVehicle()
      }
    }
    
    console.log(`Button clicked: ${selectedButton.text}, Active: ${selectedButton.isActive}`);
  }

  onBlockChange(event: any) {
    this.formData.block = event.target.value;
    console.log(this.formData.block)
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.formData.unit = event[0];
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
        this.functionMain.presentToast('Error loading block data', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  async loadUnit() {
    this.formData.unit = ''
    this.blockUnitService.getUnit(this.formData.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}))
          console.log(response)
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  ngOnInit() {
    // Semua tombol tidak aktif pada awalnya
    this.buttonStates = {
      foodDeliveries: false,
      packageDeliveries: false,
      bulkyItemDeliveries: false,
      OthersDeliveries: false,
    };
    this.loadProjectName().then(() => {
      this.foodDeliveryButtons.forEach(button => button.isActive = false);
      this.packageDeliveryButtons.forEach(button => button.isActive = false);
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
      this.getFoodPlatform()
      this.getPackagePlatform()
    })
    
  }

  selectedUnitType: string = ''; // To track the selected unit type
  showBlock: boolean = false; // To control the visibility of the block dropdown
  showUnit: boolean = false; // To control the visibility of the unit dropdown
  showRemarks: boolean = false; // To control the visibility of the remarks text area
  showPax:boolean=false;

  onUnitTypeChange(unitType: string) {
    this.selectedUnitType = unitType;

    if (unitType === 'multiple') {
      this.showBlock = false; // Show block dropdown for multiple units
      this.showUnit = false; // Show unit dropdown for multiple units
      this.showRemarks = true; // Show remarks text area for multiple units
      this.showPax = true
      this.package_delivery_type = 'multiple'
    } else if (unitType === 'single') {
      this.showBlock = true; // Hide block dropdown for single unit
      this.showUnit = true; // Show unit dropdown for single unit
      this.showRemarks = false; // Hide remarks text area for single unit
      this.showPax = false
      this.package_delivery_type = 'single'
    } else {
      this.showBlock = false; // Hide both if nothing is selected
      this.showUnit = false;
      this.showRemarks = false; // Hide remarks text area
      this.showPax = false
      this.package_delivery_type = ''
    }
  }

  vehicle_number = ''

  refreshVehicle() {
    // let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    // let front = ['SBA', 'SBS', 'SAA']
    // let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    // this.formData.vehicle_number = randomVhc
    // console.log("Vehicle Refresh", this.formData.vehicle_number)
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      this.otherDeliveryForm.visitor_vehicle = value.vehicle_number ? value.vehicle_number : ''
      this.formData.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
    })
  }

  contactUnit = ''
  getContactInfo(contactData: any){
    this.contactUnit = ''
    this.contactHost = ''
    if (contactData) {
      console.log(contactData)
      this.selectedImage = contactData.visitor_image
      if (this.otherDeliveries) {
        this.otherDeliveryForm.visitor_vehicle = contactData.vehicle_number ? contactData.vehicle_number  : ''
        this.otherDeliveryForm.visitor_name = contactData.visitor_name ? contactData.visitor_name  : ''
        this.otherDeliveryForm.company_name = contactData.company_name
      }
      this.formData.vehicle_number = contactData.vehicle_number ? contactData.vehicle_number  : ''
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

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  loadHost() {
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
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
      this.selectedImage = event.data.visitor_image
      if (this.project_config.is_industrial) {
        this.contactHost = event.data.industrial_host_id ? event.data.industrial_host_id : ''
      }
      this.formData.contact_number = event.data.contact_number ? event.data.contact_number : ''
      if (this.food_delivery_type == 'drive_in' || this.packageDeliveries) {
        this.formData.vehicle_number = event.data.vehicle_number ? event.data.vehicle_number : ''
      }
    } 
    console.log(this.nric_value, this.identificationType)
  }

  identificationType = ''
  nric_value = ''
  selectedNric: any = ''
  pass_number = ''

  otherDeliveryForm = {
    visitor_name: '',
    visitor_contact_no: '',
    visitor_vehicle: '',
    company_name: '',
    remarks: '',
  };

  onSubmitOther(openBarrier: boolean = true, camera_id: string = ''){
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
    if (!this.otherDeliveryForm.visitor_name) {
      errMsg += 'Visitor is required!\n';
    }
    if (!this.otherDeliveryForm.visitor_contact_no) {
      errMsg += 'Contact number is required!\n';
    }
    if (this.otherDeliveryForm.visitor_contact_no) {
      if (this.otherDeliveryForm.visitor_contact_no.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (!this.otherDeliveryForm.visitor_vehicle) {
      errMsg += 'Vehicle number is required!\n';
    }
    if ((!this.otherDeliveryForm.company_name) && this.project_config.is_industrial) {
      errMsg += 'Company name is required!\n';
    }
    if ((!this.selectedHost) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected!\n';
    }
    if (!this.pass_number && this.project_config.is_industrial) {
      errMsg += 'Pass number is required! \n'
    }
    if ((!this.otherDeliveryForm.remarks) && this.project_config.is_industrial) {
      errMsg += 'Remarks is required!\n';
    }
    if (errMsg != "") {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    if (openBarrier){
      console.log("OPEN BARRIER")
    } else {
      console.log("BARRIER NOT OPENED");
    }
    let params = {
      ...this.otherDeliveryForm, project_id: this.project_id, identification_type: this.identificationType, nric_value: this.nric_value, pass_number: this.pass_number, host: this.selectedHost, visitor_image: this.selectedImage,
    }
    console.log(params)
    this.clientMainService.getApi(params, '/vms/post/add_deliveries_other').subscribe({
      next: (results) => {
        if (results.result.status_code === 200) {
          if (openBarrier){
            this.functionMain.presentToast('Successfully Insert New Delivery Data and Opened the Barrier!', 'success');
          } else {
            this.functionMain.presentToast('Successfully Insert New Delivery Data!', 'success');
          }
          this.router.navigate(['home-vms'])
        } else if (results.result.status_code === 205) {
          if (openBarrier) {
            this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added. The barrier is now open!', 'success');
          } else {
            this.functionMain.presentToast('This data has been alerted on previous visit and offence data automatically added!', 'success');
          }
          this.router.navigate(['home-vms'])
        } else if (results.result.status_code === 405) {
          this.functionMain.presentToast('An error occurred while trying to create offence for this alerted visitor!', 'danger');
          this.router.navigate(['home-vms'])
        } else if (results.result.status_code === 206) {
          this.functionMain.banAlert(results.result.status_description, false, this.selectedHost)
        } else {
          this.functionMain.presentToast('An error occurred while creating new delivery data!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while creating new delivery data!', 'danger');
        console.error(error);
      }
    });
    
  }

  getDriveInContactInfo(contactData: any){
    this.contactUnit = ''
    if (contactData) {
      this.otherDeliveryForm.visitor_name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.otherDeliveryForm.visitor_vehicle = contactData.vehicle_number ? contactData.vehicle_number  : ''
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

  showWalk = false;
  showDrive = false;
  showWalkTrans = false;
  showDriveTrans = false;
  showForm = false

  toggleShowWalk() {
    if (!this.showDriveTrans) {
      if (this.showDrive) {
        this.resetForm() 
      }
      this.showWalkTrans = true
      this.showDrive = false;
      this.contactHost = ''
      this.showForm = false
      setTimeout(() => {
        this.showForm = true
        this.showWalk = true;
        this.showWalkTrans = false
      }, 300)
    }
  }

  toggleShowDrive() {
    if (!this.showWalkTrans) {
      if (this.showWalk) {
        this.resetForm() 
      }
      this.showDriveTrans = true
      this.showWalk = false;
      this.contactHost = ''
      this.showForm = false
      setTimeout(() => {
        this.showForm = true
        this.showDrive = true;
        this.showDriveTrans = false
        this.refreshVehicle()
      }, 300)
    }
  }

  selectedImage: any = ''

  handleRefresh(event: any) {
    if (this.project_config.is_industrial) {
      this.loadHost()
    } else {
      this.loadBlock()
    }
    if (this.foodDeliveries) {
      this.getFoodPlatform()
    } 
    if (this.packageDeliveries) {
      this.getPackagePlatform()
    }
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }
}