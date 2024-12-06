import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FoodPlatformService } from 'src/app/services/food_platform/food-platform.service';

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
    { image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'WALK IN', isActive: false },
    { icon: 'faCar', text: 'DRIVE IN', isActive: false },
  ];
  foodDeliveryButtons = [
    { image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'Not Exist', isActive: false, id: 0 }
  ];
  packageDeliveryButtons = [
    { image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'Not Exist', isActive: false, id: 0 },
  ];

  constructor(private foodPlatform: FoodPlatformService) { }

  package_delivery_type = ""
  food_delivery_type = ""

  food_delivery_id = 0
  package_delivery_id = 0

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
    block: 'Block 1', 
    unit: 'Unit 1',
    pax:'0'
  };

  getFoodPlatform() {
    this.foodDeliveryButtons.pop()
    this.foodPlatform.getFoodPlatForm().subscribe(
      res => {
        var result = res.result['result']
        console.log(result)
        result.forEach((item: any) => {
          this.foodDeliveryButtons.push({image: 'assets/icon/deliveries-icon/FoodBar.webp', text: item['name'], isActive: false, id: item['id']});
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
          this.packageDeliveryButtons.push({image: 'assets/icon/deliveries-icon/FoodBar.webp', text: item['name'], isActive: false, id: item['id']});
          console.log(item)
        });
        this.packageDeliveryButtons.push({image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'OTHERS', isActive: false, id: 0});
      },
      error => {
        console.log(error)
      }
    )
  }

  onSubmitFood() {
    console.log(this.formData)
    this.foodPlatform.pastAddDeliveries(
      this.formData.contact_number, 
      '', 
      'food' , 
      this.formData.food_delivery= {
        id: this.food_delivery_id,
        other: this.food_delivery_id == 0 ? 'Others Checked' : '',
        delivery_option: this.food_delivery_type
      }, 
      {}, 
      this.formData.block, 
      this.formData.unit
    ).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  onSubmitPackage() {
    console.log('PACKAGE')
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
      this.formData.block, 
      this.formData.unit
    ).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.error('Error:', error);
      }
    );
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
    
    if (this.foodDeliveries) {
      this.foodDeliveryButtons.forEach(button => button.isActive = false);
      this.food_delivery_id = selectedButton.id
    }

    if (this.packageDeliveries) {
      this.packageDeliveryButtons.forEach(button => button.isActive = false);
      this.package_delivery_id = selectedButton.id
    }

    selectedButton.isActive = true;

    // Handle any additional logic needed for the button click
    console.log(`Button clicked: ${selectedButton.id}, Active: ${selectedButton.isActive}`);
  }

  toggleDeliveryTypeButton(selectedButton: any) {
    // Reset all buttons to inactive
    this.deliveriesType.forEach(button => button.isActive = false);
    // Set the selected button to active
    selectedButton.isActive = true;

    // Handle any additional logic needed for the button click
    this.food_delivery_type = selectedButton.text == 'WALK IN' ? 'walk_in' : 'drive_in'
    console.log(`Button clicked: ${selectedButton.text}, Active: ${selectedButton.isActive}`);
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
}