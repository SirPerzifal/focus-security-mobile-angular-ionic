import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-emergency-module',
  templateUrl: './emergency-module.page.html',
  styleUrls: ['./emergency-module.page.scss'],
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
export class EmergencyModulePage implements OnInit {

  constructor() { }

  showAmbulance = false;
  showPolice = false;
  showSCDF = false;
  showAmbulanceTrans = false;
  showPoliceTrans = false;
  showSCDFTrans = false;

  toggleShowSCDF() {
    if (!this.showPoliceTrans && !this.showAmbulanceTrans){
      this.showSCDFTrans = true
      this.showPolice = false;
      this.showAmbulance = false;
      setTimeout(()=>{
        this.showSCDF = true;
        this.showSCDFTrans = false
      }, 300)
    }
  }

  toggleShowAmbulance() {
    if (!this.showSCDFTrans && !this.showPoliceTrans){
      this.showAmbulanceTrans = true
      this.showPolice = false;
      this.showSCDF = false;
      setTimeout(()=>{
        this.showAmbulance = true;
        this.showAmbulanceTrans = false
      }, 300)
    }
  }

  toggleShowPolice() {
    if (!this.showSCDFTrans && !this.showAmbulanceTrans){
      this.showPoliceTrans = true
      this.showAmbulance = false;
      this.showSCDF = false;
      setTimeout(()=>{
        this.showPolice = true;
        this.showPoliceTrans = false
      }, 300)
    }
  }

  ngOnInit() {
  }

}
