import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-collection-module',
  templateUrl: './collection-module.page.html',
  styleUrls: ['./collection-module.page.scss'],
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
export class CollectionModulePage implements OnInit {

  constructor() { }


  showWalk = false;
  showDrive = false;
  showWalkTrans = false;
  showDriveTrans = false;

  toggleShowWalk() {
    if (!this.showDriveTrans){
      this.showWalkTrans = true
      this.showDrive = false;
      setTimeout(()=>{
        this.showWalk = true;
        this.showWalkTrans = false
      }, 300)
    }
  }

  toggleShowDrive() {
    if (!this.showWalkTrans){
      this.showDriveTrans = true
      this.showWalk = false;
      setTimeout(()=>{
        this.showDrive = true;
        this.showDriveTrans = false
      }, 300)
    }
  }

  ngOnInit() {
  }

  vehicle_number = ''

  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.vehicle_number = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

}
