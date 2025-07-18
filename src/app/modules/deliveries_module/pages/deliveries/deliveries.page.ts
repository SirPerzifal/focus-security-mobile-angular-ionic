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
    if (!this.showDrive && !this.showWalk){
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
    if (!this.pass_number && (this.project_config.is_industrial || this.project_config.is_allow_pass_number_resident)) {
      errMsg += 'Pass number is required! \n'
    }
    if(errMsg != ""){
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    try {
      let params = {
        contact_number: this.formData.contact_number,
        vehicle_number: this.showDrive ? this.formData.vehicle_number : '',
        delivery_type: 'food',
        food_delivery: {
          id: this.food_delivery_id === 'other' ? 0 : parseInt(this.food_delivery_id),
          other: this.food_delivery_id === 'other' ? 'Others Checked' : '',
          delivery_option: this.showDrive ? 'drive_in' : 'walk_in',
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
              this.functionMain.presentToast('Successfully Saved Food Delivery Record and Opened the Barrier', 'success');
            } else {
              this.functionMain.presentToast('Successfully Saved Food Delivery Record', 'success');
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
            this.functionMain.presentToast(res.result.status_description, 'danger');
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 407) {
            this.functionMain.presentToast(res.result.status_description, 'danger');
          } else if (res.result.status_code === 206) {
            this.functionMain.banAlert(res.result.status_description, this.formData.unit, this.selectedHost)
          } else {
            this.functionMain.presentToast('Failed To Saved Food Delivery Record', 'danger');
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
    this.is_id_disabled = false
  }

  resetFormFood() {
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
    this.selectedImage = ''
    this.selectedNric = ''
    this.contactUnit = ''
    this.contactHost = ''
    this.selectedHost = ''
    this.pass_number = ''
    this.showRemarks = false
    this.showPax = false
    this.showUnit = false
    this.is_id_disabled = false
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
    if (!this.showDrive && !this.showWalk){
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
    if (!this.formData.vehicle_number && this.showDrive){
      errMsg += 'Please insert visitor vehicle number!\n';
    }
    if (!this.pass_number && (this.project_config.is_industrial || this.project_config.is_allow_pass_number_resident)) {
      errMsg += 'Pass number is required! \n'
    }
    if (!this.package_delivery_type){
      errMsg += 'Please select a delivery option!\n';
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
        vehicle_number: this.showDrive ? this.formData.vehicle_number : '',
        delivery_type: 'package',
        food_delivery: {}, // Kosong karena bukan food delivery
        package_delivery: {
          id: this.package_delivery_id === 'other' ? 0 : parseInt(this.package_delivery_id),
          other: this.package_delivery_id === 'other' ? 'Others Checked' : '',
          delivery_option: this.package_delivery_type,
          delivery_type: this.showDrive ? 'drive_in' : 'walk_in',
        },
        block: this.package_delivery_type === 'multiple' ? '' : this.formData.block,
        unit: this.package_delivery_type === 'multiple' ? '' : this.formData.unit,
        multiple_unit: {
          pax: this.formData.pax,
          remarks: this.formData.remarks
        },
        project_id: this.project_id,
        camera_id: camera_id,
        host: this.package_delivery_type === 'multiple' ? false : this.selectedHost,
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
              console.log("Barrier Opened")
              this.functionMain.presentToast('Successfully Saved Package Delivery Record and Opened the Barrier', 'success');
            }else {
              this.functionMain.presentToast('Successfully Saved Package Delivery Record', 'success');
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
            this.functionMain.presentToast(res.result.status_description, 'danger');
            this.router.navigate(['home-vms'])
          } else if (res.result.status_code === 407) {
            this.functionMain.presentToast(res.result.status_description, 'danger');
          } else if (res.result.status_code === 206) {
            this.functionMain.banAlert(res.result.status_description, this.package_delivery_type === 'multiple' ? false : this.formData.unit, this.selectedHost)
          } else {
            this.functionMain.presentToast('Failed To Saved Package Delivery Record', 'danger');
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
    if (!this.bulkyItemDeliveriesTrans && !this.packageDeliveriesTrans && !this.otherDeliveriesTrans) {
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

      this.showDrive = false
      this.showWalk = false
      this.showForm = false

      setTimeout(() => {
        this.foodDeliveries = true;
        this.foodDeliveriesTrans = false
      }, 300)
    }
  }

  togglePackageDeliveries() {
    if (!this.foodDeliveriesTrans && !this.bulkyItemDeliveriesTrans && !this.otherDeliveriesTrans) {
      if (!this.packageDeliveries) {
        this.resetForm()
      }
      this.packageDeliveriesTrans = true
      this.bulkyItemDeliveries = false;
      this.foodDeliveries = false;
      this.otherDeliveries = false

      // Update status tombol
      this.buttonStates.foodDeliveries = false;
      this.buttonStates.packageDeliveries = true;
      this.buttonStates.bulkyItemDeliveries = false;
      this.buttonStates.OthersDeliveries = false;
      
      this.showDrive = false
      this.showWalk = false
      this.showForm = false

      setTimeout(() => {
        this.packageDeliveries = true;
        this.packageDeliveriesTrans = false
        this.refreshVehicle()
      }, 300)
    }
  }

  toggleBulkyItemDeliveries() {
    if (!this.foodDeliveriesTrans && !this.packageDeliveriesTrans && !this.otherDeliveriesTrans) {
      if (!this.bulkyItemDeliveries) {
        this.resetForm()
      }
      this.bulkyItemDeliveriesTrans = true
      this.packageDeliveries = false;
      this.foodDeliveries = false;
      this.otherDeliveries = false

      // Update status tombol
      this.buttonStates.foodDeliveries = false;
      this.buttonStates.packageDeliveries = false;
      this.buttonStates.bulkyItemDeliveries = true;
      this.buttonStates.OthersDeliveries = false;

      this.showDrive = false
      this.showWalk = false
      this.showForm = false

      setTimeout(() => {
        this.bulkyItemDeliveries = true;
        this.bulkyItemDeliveriesTrans = false
      }, 300)
    }
  }

  toggleOtherDeliveries() {
    if (!this.foodDeliveriesTrans && !this.bulkyItemDeliveriesTrans && !this.packageDeliveriesTrans) {
      if (!this.bulkyItemDeliveries) {
        this.resetForm()
      }
      this.otherDeliveriesTrans = true
      this.bulkyItemDeliveries = false;
      this.packageDeliveries = false;
      this.foodDeliveries = false;

      this.buttonStates.foodDeliveries = false;
      this.buttonStates.packageDeliveries = false;
      this.buttonStates.bulkyItemDeliveries = false;
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
      this.food_delivery_id = ''
      setTimeout(() => {
        if (this.food_delivery_id != String(selectedButton.id)){
          this.food_delivery_id = String(selectedButton.id)
        } 
      }, 300);
    }

    this.resetFormFood()

    if (this.packageDeliveries) {
      this.packageDeliveryButtons.forEach(button => button.isActive = false);
      this.package_delivery_id = ''
      setTimeout(() => {
        if(this.package_delivery_id != String(selectedButton.id)){
          this.package_delivery_id = String(selectedButton.id)
        }
      }, 300)
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
    this.foodDeliveryButtons.forEach(button => button.isActive = false);
    this.food_delivery_id = ''
    if (mark){
      this.food_delivery_type = ''
    } else {
      if (selectedButton.text == 'DRIVE IN') {
        this.resetFormFood()
        this.refreshVehicle()
      } else {
        this.resetFormFood()
      }
      this.food_delivery_type = ''
      setTimeout(() => {
        this.food_delivery_type = selectedButton.text == 'WALK IN' ? 'walk_in' : 'drive_in'
      }, 300)
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

  refreshVehicle(is_click: boolean = false) {
    this.functionMain.getLprConfig(this.project_id).then((value) => {
      console.log(value)
      if (value) {
        this.otherDeliveryForm.visitor_vehicle = value.vehicle_number ? value.vehicle_number : ''
        this.formData.vehicle_number = value.vehicle_number ? value.vehicle_number : ''
        if (!is_click) {
          if (this.otherDeliveries) {
            console.log("SHOW OTHER")
            this.otherDeliveryForm.visitor_contact_no = value.contact_number ? value.contact_number : ''
            this.otherDeliveryForm.visitor_name = value.visitor_name ? value.visitor_name  : ''
            this.selectedImage = value.visitor_image
            this.selectedNric = {type: value.identification_type ? value.identification_type : '', number: value.identification_number ? value.identification_number : '' }
            this.contactUnit = ''
            this.contactHost = ''
            if (value.industrial_host_id) {
              this.contactHost = value.industrial_host_id ? value.industrial_host_id : ''
            }
          } else {
            console.log("SHOW PACKAGE")
            this.formData.contact_number = value.contact_number ? value.contact_number : ''
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
        }
      }
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
        if (contactData.identification_type && contactData. identification_number) {
          this.is_id_disabled = true
        } else {
          this.is_id_disabled = false
        }
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

  is_id_disabled = false
  setFromScan(event: any) {
    console.log(event)
    this.nric_value = event.data.identification_number
    this.identificationType = event.type
    if (event.data.is_server) {
      this.selectedImage = event.data.visitor_image
      this.is_id_disabled = true
      if (this.project_config.is_industrial) {
        this.contactHost = event.data.industrial_host_id ? event.data.industrial_host_id : ''
      }
      this.formData.contact_number = event.data.contact_number ? event.data.contact_number : ''
      if (this.food_delivery_type == 'drive_in' || this.packageDeliveries) {
        this.formData.vehicle_number = event.data.vehicle_number ? event.data.vehicle_number : ''
      }
      if (this.otherDeliveries) {
        this.otherDeliveryForm.visitor_contact_no = event.data.contact_number ? event.data.contact_number : ''
        this.otherDeliveryForm.visitor_name = event.data.contractor_name ? event.data.contractor_name : ''
        this.selectedHost = event.data.industrial_host_id ? event.data.industrial_host_id : ''
        this.otherDeliveryForm.company_name = event.data.company_name ? event.data.company_name : ''
        if (this.showDrive) {
          this.otherDeliveryForm.visitor_vehicle = event.data.vehicle_number ? event.data.vehicle_number : ''
        }
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
    if (this.showWalk) {
      this.otherDeliveryForm.visitor_vehicle = ''
    }
    if (!this.selectedImage) {
      errMsg += 'Visitor image is required!\n';
    }
    // if ((!this.identificationType) && this.project_config.is_industrial) {
    //   errMsg += 'Identification type is required!\n';
    // }
    // if ((!this.nric_value) && this.project_config.is_industrial) {
    //   errMsg += 'Identification number is required!\n';
    // }
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
    if (!this.otherDeliveryForm.visitor_vehicle && this.showDrive) {
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
      ...this.otherDeliveryForm, project_id: this.project_id, pass_number: this.pass_number, identification_type: '', nric_value: '', host: this.selectedHost, visitor_image: this.selectedImage,
    }
    console.log(params)
    this.clientMainService.getApi(params, '/vms/post/add_deliveries_other').subscribe({
      next: (res) => {
        if (res.result.status_code === 200) {
          if (openBarrier){
            this.functionMain.presentToast('Successfully Saved New Delivery Data and Opened the Barrier!', 'success');
          } else {
            this.functionMain.presentToast('Successfully Saved New Delivery Data!', 'success');
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
          this.functionMain.presentToast(res.result.status_description, 'danger');
          this.router.navigate(['home-vms'])
        } else if (res.result.status_code === 407) {
          this.functionMain.presentToast(res.result.status_description, 'danger');
        } else if (res.result.status_code === 206) {
          this.functionMain.banAlert(res.result.status_description, false, this.selectedHost)
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
      this.selectedImage = contactData.visitor_image
      this.otherDeliveryForm.visitor_name = contactData.visitor_name ? contactData.visitor_name  : ''
      this.otherDeliveryForm.visitor_vehicle = contactData.vehicle_number ? contactData.vehicle_number  : ''
      if (this.project_config.is_industrial) {
        this.contactHost = contactData.industrial_host_id ? contactData.industrial_host_id : ''
        this.selectedNric = {type: contactData.identification_type ? contactData.identification_type : '', number: contactData.identification_number ? contactData.identification_number : '' }
        if (contactData.identification_type && contactData. identification_number) {
          this.is_id_disabled = true
        } else {
          this.is_id_disabled = false
        }
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
      if (!this.showDrive) {
        this.resetForm()
        this.refreshVehicle()
      }
      this.showDriveTrans = true
      this.showWalk = false;
      this.showForm = false
      setTimeout(() => {
        this.showForm = true
        this.showDrive = true;
        this.showDriveTrans = false
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