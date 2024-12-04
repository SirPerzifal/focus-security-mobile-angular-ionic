import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';

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

  foodDeliveryButtons = [
    { image: 'assets/icon/deliveries-icon/FoodPanda.webp', text: 'FOODPANDA', isActive: false },
    { image: 'assets/icon/deliveries-icon/Grab.webp', text: 'GRABFOOD', isActive: false },
    { image: 'assets/icon/deliveries-icon/Deliveroo.webp', text: 'DELIVEROO', isActive: false },
    { image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'OTHERS', isActive: false },
    { image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'WALK IN', isActive: false },
    { icon: 'faCar', text: 'DRIVE IN', isActive: false },
  ];
  packageDeliveryButtons = [
    { image: 'assets/icon/deliveries-icon/NinjaVan.webp', text: 'NINJAVAN', isActive: false },
    { image: 'assets/icon/deliveries-icon/Grab.webp', text: 'GRABEXPRESS', isActive: false },
    { image: 'assets/icon/deliveries-icon/SingPos.webp', text: 'SINGPOST', isActive: false },
    { image: 'assets/icon/deliveries-icon/FoodBar.webp', text: 'OTHERS', isActive: false },
  ];

  constructor() { }

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
    if (!this.bulkyItemDeliveriesTrans && !this.packageDeliveriesTrans){
      this.foodDeliveriesTrans = true
      this.bulkyItemDeliveries = false;
      this.packageDeliveries = false;
      
      // Update status tombol
      this.buttonStates.foodDeliveries = true;
      this.buttonStates.packageDeliveries = false;
      this.buttonStates.bulkyItemDeliveries = false;

      setTimeout(()=>{
        this.foodDeliveries = true;
        this.foodDeliveriesTrans = false
      }, 300)
    }
  }

  togglePackageDeliveries() {
    if (!this.foodDeliveriesTrans && !this.bulkyItemDeliveriesTrans){
      this.packageDeliveriesTrans = true
      this.bulkyItemDeliveries = false;
      this.foodDeliveries = false;
      
      // Update status tombol
      this.buttonStates.foodDeliveries = false;
      this.buttonStates.packageDeliveries = true;
      this.buttonStates.bulkyItemDeliveries = false;

      setTimeout(()=>{
        this.packageDeliveries = true;
        this.packageDeliveriesTrans = false
      }, 300)
    }
  }

  toggleBulkyItemDeliveries() {
    if (!this.foodDeliveriesTrans && !this.packageDeliveriesTrans){
      this.bulkyItemDeliveriesTrans = true
      this.packageDeliveries = false;
      this.foodDeliveries = false;
      
      // Update status tombol
      this.buttonStates.foodDeliveries = false;
      this.buttonStates.packageDeliveries = false;
      this.buttonStates.bulkyItemDeliveries = true;

      setTimeout(()=>{
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
      this.showGrabExpress = true  }

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
    this.foodDeliveryButtons.forEach(button => button.isActive = false);
    this.packageDeliveryButtons.forEach(button => button.isActive = false);
    // Set the selected button to active
    selectedButton.isActive = true;

    // Handle any additional logic needed for the button click
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
  }

  selectedUnitType: string = ''; // To track the selected unit type
  showBlock: boolean = false; // To control the visibility of the block dropdown
  showUnit: boolean = false; // To control the visibility of the unit dropdown
  showRemarks: boolean = false; // To control the visibility of the remarks text area

  onUnitTypeChange(unitType: string) {
    this.selectedUnitType = unitType;

    if (unitType === 'multiple') {
      this.showBlock = false; // Show block dropdown for multiple units
      this.showUnit = true; // Show unit dropdown for multiple units
      this.showRemarks = true; // Show remarks text area for multiple units
    } else if (unitType === 'single') {
      this.showBlock = true; // Hide block dropdown for single unit
      this.showUnit = true; // Show unit dropdown for single unit
      this.showRemarks = false; // Hide remarks text area for single unit
    } else {
      this.showBlock = false; // Hide both if nothing is selected
      this.showUnit = false;
      this.showRemarks = false; // Hide remarks text area
    }
  }
}