import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FoodPlatformService } from 'src/app/service/vms/food_platform/food-platform.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

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
    { image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'Not Exist', isActive: false, id: 0 }
  ];
  packageDeliveryButtons = [
    { image: 'assets/icon/deliveries-icon/Package.webp', text: 'Not Exist', isActive: false, id: 0 },
  ];

  constructor(private foodPlatform: FoodPlatformService, private router: Router, private toastController: ToastController, private blockUnitService: BlockUnitService) { }

  package_delivery_type = ""
  food_delivery_type = ""

  food_delivery_id = 0
  package_delivery_id = 0

  Block: any[] = [];
  Unit: any[] = [];

  formData = {
    contact_number: '', 
    vehicle_number: '', 
    delivery_type: '', 
    food_delivery: {
      id: 1,
      other: 'Test Others',
      delivery_option: 'walk_in'
    }, 
    package_delivery: {
      id: 1,
      other: 'Test Others',
      delivery_option: 'single'
    }, 
    block: '1', 
    unit: '1',
    pax:'0',
    remarks: ''
  };

  getFoodPlatform() {
    this.foodDeliveryButtons.pop()
    this.foodPlatform.getFoodPlatForm().subscribe(
      res => {
        var result = res.result['result']
        console.log(result)
        result.forEach((item: any) => {
          const base64Image = item['icon'];
          const formattedImage = base64Image ? `data:image/png;base64,${base64Image}` : 'assets/icon/deliveries-icon/FoodBar.webp'; 
          this.foodDeliveryButtons.push({image: formattedImage, text: item['name'], isActive: false, id: item['id']});
        });
        this.foodDeliveryButtons.push({image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'OTHERS', isActive: false, id: 0});
      },
      error => {
        console.log(error)
      }
    )
  }

  getPackagePlatform() {
    this.packageDeliveryButtons.pop()
    this.foodPlatform.getPackagePlatForm().subscribe(
      res => {
        var result = res.result['result']
        console.log(result)
        result.forEach((item: any) => {
          const base64Image = item['icon'];
          const formattedImage = base64Image ? `data:image/png;base64,${base64Image}` : 'assets/icon/deliveries-icon/Package.webp'; 
          console.log(formattedImage)
          this.packageDeliveryButtons.push({image: formattedImage, text: item['name'], isActive: false, id: item['id']});
          console.log(item)
        });
        this.packageDeliveryButtons.push({image: 'assets/icon/deliveries-icon/Package.webp', text: 'OTHERS', isActive: false, id: 0});
      },
      error => {
        console.log(error)
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

  onSubmitFood(openBarrier: boolean = false) {
    console.log(openBarrier)
    console.log(this.formData)
    let errMsg = ""
    if (!this.food_delivery_id){
      errMsg += 'Please select a delivery platform!\n';
    }
    if (!this.food_delivery_type){
      errMsg += 'Please select a delivery type!\n';
    }
    if (!this.formData.contact_number){
      errMsg += 'Please insert a contact number!\n';
    }
    if (this.food_delivery_type == 'drive_in' && !this.formData.vehicle_number){
      errMsg += 'Please insert a vehicle number!\n';
    }
    if (!this.formData.block || !this.formData.unit){
      errMsg += 'Please insert a block and unit!\n';
    }
    if(errMsg != ""){
      this.presentToast(errMsg, 'danger')
      return
    }
    try {
      this.foodPlatform.pastAddDeliveries(
        this.formData.contact_number, 
        this.food_delivery_type == 'drive_in' ? this.formData.vehicle_number : '', 
        'food' , 
        this.formData.food_delivery= {
          id: this.food_delivery_id,
          other: this.food_delivery_id == 0 ? 'Others Checked' : '',
          delivery_option: this.food_delivery_type
        }, 
        {}, 
        this.formData.block, 
        this.formData.unit,
        {}
      ).subscribe(
        res => {
          console.log(res);
          if (res.result.status_code == 200){
            if (openBarrier){
              this.presentToast('Successfully Insert Food Delivery Record and Opened the Barrier', 'success');
            } else {
              this.presentToast('Successfully Insert Food Delivery Record', 'success');
            }
            this.router.navigate(['home-vms'])
          } else {
            this.presentToast('Failed To Insert Food Delivery Record', 'danger');
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
    } catch (error){
      console.error('Unexpected error:', error);
      this.presentToast(String(error), 'danger');
    }
    
  }

  onSubmitPackage(openBarrier: boolean = false) {
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
    if (!this.formData.contact_number){
      errMsg += 'Please insert your contact number!\n';
    }
    if (!this.formData.vehicle_number){
      errMsg += 'Please insert your vehicle number!\n';
    }
    if (this.package_delivery_type == "single" && (!this.formData.block || !this.formData.unit)){
      errMsg += 'Please insert your block and unit!\n';
    }
    if (this.package_delivery_type == "multiple" && this.formData.pax == "0"){
      errMsg += 'Please insert number of Pax!\n';
    }
    if(errMsg != ""){
      this.presentToast(errMsg, 'danger')
      return
    }
    try{
      this.foodPlatform.pastAddDeliveries(
        this.formData.contact_number, 
        this.formData.vehicle_number, 
        'package' , 
        {}, 
        this.formData.package_delivery= {
          id: this.package_delivery_id,
          other: this.package_delivery_id == 0 ? 'Others Checked' : '',
          delivery_option: this.package_delivery_type
        }, 
        this.package_delivery_type == 'multiple' ? '1' : this.formData.block, 
        this.package_delivery_type == 'multiple' ? '1' : this.formData.unit,
        mutiple_unit = {
          pax: this.formData.pax,
          remarks: this.formData.remarks
        }
      ).subscribe(
        res => {
          console.log(res);
          if (res.result.status_code == 200){
            if (openBarrier){
              console.log("Barrier Opened")
              this.presentToast('Successfully Insert Package Delivery Record and Opened the Barrier', 'success');
            }else {
              this.presentToast('Successfully Insert Package Delivery Record', 'success');
            }
            this.router.navigate(['home-vms'])
          } else {
            this.presentToast('Failed To Insert Package Delivery Record', 'danger');
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
    } catch (error){
      console.error('Unexpected error:', error);
      this.presentToast(String(error), 'danger');
    }
    
  }

  // Tambahkan objek untuk status aktif tombol
  buttonStates = {
    foodDeliveries: false,
    packageDeliveries: false,
    bulkyItemDeliveries: false
  };

  foodDeliveries = false; // Ubah menjadi false secara default
  packageDeliveries = false;
  bulkyItemDeliveries = false;
  foodDeliveriesTrans = false;
  packageDeliveriesTrans = false;
  bulkyItemDeliveriesTrans = false;

  toggleFoodDeliveries() {
    if (!this.bulkyItemDeliveriesTrans && !this.packageDeliveriesTrans) {
      this.foodDeliveriesTrans = true
      this.bulkyItemDeliveries = false;
      this.packageDeliveries = false;

      // Update status tombol
      this.buttonStates.foodDeliveries = true;
      this.buttonStates.packageDeliveries = false;
      this.buttonStates.bulkyItemDeliveries = false;

      setTimeout(() => {
        this.foodDeliveries = true;
        this.foodDeliveriesTrans = false
      }, 300)
    }
  }

  togglePackageDeliveries() {
    if (!this.foodDeliveriesTrans && !this.bulkyItemDeliveriesTrans) {
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
      }, 300)
    }
  }

  toggleBulkyItemDeliveries() {
    if (!this.foodDeliveriesTrans && !this.packageDeliveriesTrans) {
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

  showFoodPanda = false;
  showGrabFood = false;
  showDeliveroo = false;
  showFoodBar = false;

  toggleDeliveroo() {
    this.showGrabFood = false;
    this.showFoodPanda = false;
    this.showFoodBar = false
    this.showDeliveroo = true
  }

  toggleFoodPanda() {
    this.showGrabFood = false;
    this.showDeliveroo = false;
    this.showFoodBar = false
    this.showFoodPanda = true
  }

  toggleGrabFood() {
    this.showFoodPanda = false;
    this.showDeliveroo = false;
    this.showFoodBar = false
    this.showGrabFood = true
  }

  toggleFoodBar() {
    this.showGrabFood = false
    this.showFoodPanda = false;
    this.showDeliveroo = false;
    this.showFoodBar = true
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

  showNinjaVan = false;
  showGrabExpress = false;
  showSingPost = false;
  showPackagetOthers = false;

  toggleSingPost() {
    this.showGrabExpress = false;
    this.showNinjaVan = false;
    this.showPackagetOthers = false
    this.showSingPost = true
  }

  toggleNinjaVan() {
    this.showGrabExpress = false;
    this.showSingPost = false;
    this.showPackagetOthers = false
    this.showNinjaVan = true
  }

  toggleGrabExpress() {
    this.showNinjaVan = false;
    this.showSingPost = false;
    this.showPackagetOthers = false
    this.showGrabExpress = true
  }

  togglePackagetOthers() {
    this.showGrabExpress = false
    this.showNinjaVan = false;
    this.showSingPost = false;
    this.showPackagetOthers = true
  }

  // Metode untuk menangani klik tombol
  onButtonClick(event: { text: string, isActive: boolean }) {
    console.log(`Button clicked: ${event.text}, Active: ${event.isActive}`);
  }

  toggleDeliveryButton(selectedButton: any) {
    // Reset all buttons to inactive
    
    // Set the selected button to active
    console.log(this.food_delivery_id)
    if (this.foodDeliveries) {
      this.foodDeliveryButtons.forEach(button => button.isActive = false);
      if(this.food_delivery_id != selectedButton.id){
        this.food_delivery_id = selectedButton.id
      } else {
        this.food_delivery_id = 0
      }
    }

    if (this.packageDeliveries) {
      this.packageDeliveryButtons.forEach(button => button.isActive = false);
      if(this.package_delivery_id != selectedButton.id){
        this.package_delivery_id = selectedButton.id
      } else {
        this.package_delivery_id = 0
      }
    }

    selectedButton.isActive = !selectedButton.isActive;

    // Handle any additional logic needed for the button click
    console.log(`Button clicked: ${selectedButton.id}, Active: ${selectedButton.isActive}`);
    
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
    }
    
    console.log(`Button clicked: ${selectedButton.text}, Active: ${selectedButton.isActive}`);
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
          this.presentToast('Failed to load vehicle data', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('Error loading vehicle data', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  loadUnit() {
    this.blockUnitService.getUnit(this.formData.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          console.log(response)
        } else {
          this.presentToast('Failed to load unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  ngOnInit() {
    // Semua tombol tidak aktif pada awalnya
    this.buttonStates = {
      foodDeliveries: false,
      packageDeliveries: false,
      bulkyItemDeliveries: false
    };
    this.foodDeliveryButtons.forEach(button => button.isActive = false);
    this.packageDeliveryButtons.forEach(button => button.isActive = false);
    this.loadBlock()
    this.getFoodPlatform()
    this.getPackagePlatform()
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
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.formData.vehicle_number = randomVhc
    console.log("Vehicle Refresh", this.formData.vehicle_number)
  }
}