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
  faQrcode
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss'],
})
export class ButtonIconComponent implements OnInit {
  
  @Input() text: string = '';
  @Input() textOnly: boolean = false;
  @Input() extraClass: string = ''; 
  @Input() extraTextClass: string = ''; 
  @Input() customNameIcon: string = '';
  @Input() customImageIcon: string = '';
  @Input() disableClick: boolean = false; // Input baru untuk mengontrol event click
  @Input() isActive: boolean = false; // Tambahkan input untuk status aktif

  @Output() buttonClick = new EventEmitter<{ text: string, isActive: boolean }>(); // Emit objek dengan teks dan status aktif
  
  icon: IconDefinition = faCar;
  showIcon: boolean = true;

  constructor() { }

  ngOnInit() {
    this.showIcon = !this.customImageIcon;
    if (this.showIcon) {
      this.setIcon();
    }
  }

  setIcon() {
    switch(this.customNameIcon) {
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