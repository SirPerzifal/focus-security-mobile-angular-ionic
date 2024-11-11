import { Component, OnInit, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { 
  faLocationDot, 
  faUserGroup, 
  faUserShield, 
  faHammer, 
  faTruckPickup, 
  faTruckMedical, 
  faCar,
  faCouch
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss'],
})
export class ButtonIconComponent implements OnInit {
  
  @Input() text: string = '';
  @Input() customNameIcon: string = '';
  @Input() customImageIcon: string = ''; 
  @Input() isActive: boolean = true; // Tambahkan input untuk status aktif
  
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
      case 'faCar':
        this.icon = faCar;
        break;
      default:
        this.icon = faCar;
    }
  }
}