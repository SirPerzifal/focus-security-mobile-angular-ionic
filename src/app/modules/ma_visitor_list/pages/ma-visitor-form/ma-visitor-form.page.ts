import { Component, OnInit } from '@angular/core';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-ma-visitor-form',
  templateUrl: './ma-visitor-form.page.html',
  styleUrls: ['./ma-visitor-form.page.scss'],
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
export class MaVisitorFormPage implements OnInit {

  constructor() { }

  faUsers = faUsers

  ngOnInit() {
  }

  showWalk = true;
  showDrive = false;
  showWalkTrans = false;
  showDriveTrans = false;

  toggleShowWalk() {
    if (!this.showDriveTrans) {
      this.showWalkTrans = true
      this.showDrive = false;
      setTimeout(() => {
        this.showWalk = true;
        this.showWalkTrans = false
      }, 300)
    }
  }

  toggleShowDrive() {
    if (!this.showWalkTrans) {
      this.showDriveTrans = true
      this.showWalk = false;
      setTimeout(() => {
        this.showDrive = true;
        this.showDriveTrans = false
      }, 300)
    }
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
