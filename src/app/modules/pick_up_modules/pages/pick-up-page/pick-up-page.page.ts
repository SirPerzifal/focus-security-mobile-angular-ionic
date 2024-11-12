import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { faTaxi } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pick-up-page',
  templateUrl: './pick-up-page.page.html',
  styleUrls: ['./pick-up-page.page.scss'],
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
export class PickUpPagePage implements OnInit {

  faTaxi = faTaxi

  constructor() { }

  showPick = false;
  showDrop = false
  showForm = false

  toggleShowPick() {
    this.showForm = true;
    this.showDrop = false;
    this.showPick = true;
  }

  toggleShowDrop() {
    this.showForm = true;
    this.showPick = false;
    this.showDrop = true;
  }

  ngOnInit() {
  }

}
