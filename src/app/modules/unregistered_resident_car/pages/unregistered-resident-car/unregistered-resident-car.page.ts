import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unregistered-resident-car',
  templateUrl: './unregistered-resident-car.page.html',
  styleUrls: ['./unregistered-resident-car.page.scss'],
})
export class UnregisteredResidentCarPage implements OnInit {

  constructor() { }

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
