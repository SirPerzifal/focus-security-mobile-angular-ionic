import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-vehicle-records-page',
  templateUrl: './vehicle-records-page.page.html',
  styleUrls: ['./vehicle-records-page.page.scss'],
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
export class VehicleRecordsPagePage implements OnInit {

  constructor() { }

  vehicleRecords = [
    { vehicle: 'SMK 5848D', purpose: 'Visiting', entry: '24/10/2024, 1404 Hrs', exit: '24/10/2024, 1434 Hrs' }
  ];
  showSearch = false;
  show48Hrs = false;
  show24Hrs = false;

  toggleShow48Hrs() {
    if (!this.show48Hrs) {
      // this.showQrTrans = true
      // this.showDrive = false;
      // this.showWalk = false;
      setTimeout(() => {
        this.show48Hrs = true;
        this.show24Hrs = false
      }, 300)
    }
  }

  toggleShow24Hrs() {
    if (!this.show24Hrs) {
      // this.showWalkTrans = true
      // this.showDrive = false;
      // this.showQr = false;
      setTimeout(() => {
        this.show24Hrs = true;
        this.show48Hrs = false
      }, 300)
    }
  }

  toggleShowSearch(){
    if (!this.showSearch) {
      setTimeout(() => {
        this.showSearch = true;
        this.show24Hrs = false;
        this.show48Hrs = false
      }, 300)
    }else{
      setTimeout(() => {
        this.showSearch = false;
        this.show24Hrs = false;
        this.show48Hrs = true
      }, 300)
    }
  }

  
  ngOnInit() {
  }


}
