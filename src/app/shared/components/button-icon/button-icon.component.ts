import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faLocationDot,
  faUserGroup,
  faUserShield,
  faHammer,
  faTruckPickup,
  faTruckMedical,
  faCar,
  faCouch,
  faUser,
  faCheck,
  faPersonWalking,
  faCarSide,
  faBoxesPacking,
  faQrcode,
  faPersonSwimming,
  faPeopleGroup,
  faCamera,
  faPersonWalkingLuggage,
  faTaxi,
  faMotorcycle,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss'],
})
export class ButtonIconComponent implements OnInit {

  @Input() text: string = '';
  @Input() isDoubleText: boolean = false;
  @Input() secondText: string = '';
  @Input() textOnly: boolean = false;
  @Input() extraClass: string = '';
  @Input() extraTextClass: string = '';
  @Input() extraImageClass: string = '';
  @Input() extraParentClass: string = '';
  @Input() customNameIcon: string = '';
  @Input() customImageIcon: string = '';
  @Input() params: string = '';
  @Input() isHomeButton: boolean = false;
  @Input() isWarning: number = 0;
  @Input() totalWarning: number = 0;
  @Input() disableClick: boolean = false; // Input baru untuk mengontrol event click
  @Input() isActive: boolean = false; // Tambahkan input untuk status aktif
  @Input() isClient: boolean = false

  @Output() buttonClick = new EventEmitter<{ text: string, isActive: boolean }>(); // Emit objek dengan teks dan status aktif

  icon: IconDefinition = faCar;
  showIcon: boolean = true;
  isMirrored: boolean = false;

  constructor() { }

  ngOnInit() {
    this.showIcon = !this.customImageIcon;
    if (this.showIcon) {
      this.setIcon();
    }
    if (this.isHomeButton) {
      this.showIcon = false
      this.setImage();
    }
  }

  setImage() {
    if (this.isHomeButton) {
      switch (this.text) {
        case 'PICK UP / DROP OFF':
          this.customImageIcon = 'assets/icon-vms/Homepage/Pick_Up.png';
          this.isDoubleText = true
          this.text = 'PICK UP /'
          this.secondText = 'DROP OFF'
          break;
        case 'VISITORS':
          this.customImageIcon = 'assets/icon-vms/Homepage/Visitors.png';
          this.extraImageClass = 'w-[100px] h-[90px] object-contain mt-[5px]'
          break;
        case 'CONTRACTORS':
          this.customImageIcon = 'assets/icon-vms/Homepage/Contractors.png';
          break;
        case 'MOVE IN / OUT':
          this.customImageIcon = 'assets/icon-vms/Homepage/Move_In.png';
          break;
        case 'RENOVATION':
          this.customImageIcon = 'assets/icon-vms/Homepage/Renovation.png';
          break;
        case 'DELIVERY':
          this.customImageIcon = 'assets/icon-vms/Homepage/Delivery.png';
          this.extraImageClass = 'w-[70px] h-[90px] object-contain mt-[5px]'
          break;
        case 'COLLECTION':
          this.customImageIcon = 'assets/icon-vms/Homepage/Collection.png';
          break;
        case 'COACHES':
          this.customImageIcon = 'assets/icon-vms/Homepage/Coaches.png';
          break;
        case 'EMERGENCY VEHICLES':
          this.customImageIcon = 'assets/icon-vms/Homepage/Emergency_Vehicle.png';
          break
        case 'MA VISITOR':
          this.customImageIcon = 'assets/icon-vms/Homepage/MA_Visitor.png';
          break;
        case 'UNREGISTERED RESIDENT CAR':
          if (this.isClient) {
            this.text = 'UNREGISTERED EMPLOYEE CAR'
          }
          this.customImageIcon = 'assets/icon-vms/Homepage/Unregistered_Resident_Car.png';
          break;
        case 'UNREGISTERED EMPLOYEE CAR':
          this.customImageIcon = 'assets/icon-vms/Homepage/Unregistered_Resident_Car.png';
          break;
        case 'OVERNIGHT PARKING':
          this.customImageIcon = 'assets/icon-vms/Homepage/Overnight_Parking.png';
          break;
        case 'SEARCH VEHICLE':
          this.showIcon = true
          this.icon = faSearch
          break
        case 'RECORDS':
          this.customImageIcon = 'assets/icon-vms/Homepage/Records.png';
          break;
        case 'ALERTS':
          this.customImageIcon = 'assets/icon-vms/Homepage/Alerts.png';
          break;
        default:
          this.icon = faCar;
      }
    }
  }

  setIcon() {
    switch (this.customNameIcon) {
      case 'faLocationDot':
        this.icon = faLocationDot;
        break;
      case 'faUserGroup':
        this.icon = faUserGroup;
        break;
      case 'faUserShield':
        this.icon = faUserShield;
        break;
      case 'faHammer':
        this.icon = faHammer;
        break;
      case 'faTruckPickup':
        this.icon = faTruckPickup;
        break;
      case 'faTruckMedical':
        this.icon = faTruckMedical;
        break;
      case 'faCouch':
        this.icon = faCouch;
        break;
      case 'faUser':
        this.icon = faUser;
        break;
      case 'faCheck':
        this.icon = faCheck;
        break;
      case 'faCar':
        this.icon = faCar;
        break;
      case 'faPersonWalking':
        this.icon = faPersonWalking;
        break;
      case 'faCarSide':
        this.icon = faCarSide;
        break;
      case 'faBoxesPacking':
        this.icon = faBoxesPacking;
        break;
      case 'faQrcode':
        this.icon = faQrcode;
        break;
      case 'faSwim':
        this.icon = faPersonSwimming;
        this.isMirrored = true
        break;
      case 'faPeopleGroup':
        this.icon = faPeopleGroup;
        break;
      case 'faCamera':
        this.icon = faCamera;
        break;
      case 'faPersonWalkingLuggage':
        this.icon = faPersonWalkingLuggage;
        break;
      case 'faTaxi':
        this.icon = faTaxi;
        break;
      case 'faMotorcycle':
        this.icon = faMotorcycle;
        break;
      // case 'faPeopleGroup':
      //   this.icon = faCars;
      //     break;
      default:
        this.icon = faCar;
    }

  }

  onButtonClick() {
    if (this.disableClick) {
      return; // Jika disableClick true, tidak lakukan apa-apa
    }
    this.isActive = !this.isActive; // Toggle status isActive
    this.buttonClick.emit({ text: this.text, isActive: this.isActive }); // Emit objek dengan teks dan status aktif
  }
}