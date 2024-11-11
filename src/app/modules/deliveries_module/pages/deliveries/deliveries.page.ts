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

  // Variabel untuk mengontrol visibilitas dropdown
  isDropdownOpen: boolean = false;

  constructor() { }

  // Tambahkan objek untuk status aktif tombol
  buttonStates = {
    foodDeliveries: false,
    packageDeliveries: false,
    bulkyItemDeliveries: false
  };

  packageDeliveries = false;
  bulkyItemDeliveries = false;
  foodDeliveries = false; // Ubah menjadi false secara default
  packageDeliveriesTrans = false;
  bulkyItemDeliveriesTrans = false;
  foodDeliveriesTrans = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle dropdown
  }

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

  ngOnInit() {
    // Semua tombol tidak aktif pada awalnya
    this.buttonStates = {
      foodDeliveries: false,
      packageDeliveries: false,
      bulkyItemDeliveries: false
    };
  }
}