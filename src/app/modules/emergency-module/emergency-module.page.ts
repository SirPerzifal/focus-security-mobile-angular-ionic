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
  showOthers = false;
  showAmbulanceTrans = false;
  showPoliceTrans = false;
  showSCDFTrans = false;
  showOthersTrans = false;

  toggleShowSCDF() {
    if (!this.showPoliceTrans && !this.showAmbulanceTrans){
      this.showSCDFTrans = true
      this.showPolice = false;
      this.showAmbulance = false;
      this.showOthers = false
      setTimeout(()=>{
        this.showSCDF = true
        this.showSCDFTrans = false
      }, 300)
    }
    console.log(this.showAmbulanceTrans, this.showPoliceTrans, this.showSCDFTrans, this.showAmbulance, this.showPolice, this.showSCDF)
  }

  toggleShowAmbulance() {
    if (!this.showSCDFTrans && !this.showPoliceTrans){
      this.showAmbulanceTrans = true
      this.showPolice = false;
      this.showSCDF = false;
      this.showOthers = false
      setTimeout(()=>{
        this.showAmbulance = true
        this.showAmbulanceTrans = false;
      }, 300)
    }
    console.log(this.showAmbulanceTrans, this.showPoliceTrans, this.showSCDFTrans, this.showAmbulance, this.showPolice, this.showSCDF)
  }

  toggleShowPolice() {
    if (!this.showSCDFTrans && !this.showAmbulanceTrans){
      this.showPoliceTrans = true
      this.showAmbulance = false;
      this.showSCDF = false;
      this.showOthers = false
      setTimeout(()=>{
        this.showPolice = true
        this.showPoliceTrans = false;
      }, 300)
    }
    console.log(this.showAmbulanceTrans, this.showPoliceTrans, this.showSCDFTrans, this.showAmbulance, this.showPolice, this.showSCDF)
  }

  toggleShowOthers() {
    if (!this.showSCDFTrans && !this.showAmbulanceTrans){
      this.showOthersTrans = true
      this.showPolice = false
      this.showAmbulance = false;
      this.showSCDF = false;
      setTimeout(()=>{
        this.showOthers = true
        this.showOthersTrans = false;
      }, 300)
    }
    console.log(this.showAmbulanceTrans, this.showPoliceTrans, this.showSCDFTrans, this.showAmbulance, this.showPolice, this.showSCDF)
  }

  ngOnInit() {
  }

}
