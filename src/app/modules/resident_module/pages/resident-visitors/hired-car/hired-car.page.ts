import { Component, OnInit } from '@angular/core';
import { faBedPulse, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hired-car',
  templateUrl: './hired-car.page.html',
  styleUrls: ['./hired-car.page.scss'],
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
export class HiredCarPage implements OnInit {

  constructor(private router: Router) {}

  faTaxi = faTaxi

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    // this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    this.router.navigate(['history']);
  }

  showPick = true;
  showDrop = false

  toggleShowPick() {
    this.showDrop = false;
    this.showPick = true;
  }

  toggleShowDrop() {
    this.showPick = false;
    this.showDrop = true;
  }

  phv_vehicle = true;
  taxi = false;
  private_car = false;

  usePhvVehicle() {
    this.phv_vehicle = true;
    this.taxi = false;
    this.private_car = false;
  }

  useTaxi() {
    this.phv_vehicle = false;
    this.taxi = true;
    this.private_car = false;
  }

  usePrivateCar() {
    this.phv_vehicle = false;
    this.taxi = false;
    this.private_car = true;
  }

  ngOnInit() {
  }

}
