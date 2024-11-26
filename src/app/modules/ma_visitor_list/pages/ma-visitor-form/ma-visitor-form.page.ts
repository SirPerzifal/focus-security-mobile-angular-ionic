import { Component, OnInit } from '@angular/core';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ma-visitor-form',
  templateUrl: './ma-visitor-form.page.html',
  styleUrls: ['./ma-visitor-form.page.scss'],
})
export class MaVisitorFormPage implements OnInit {

  constructor() { }

  faUsers = faUsers

  showWalk = false;
  showDrive = false;

  ngOnInit() {
  }

  toggleShowWalk() {
    this.showDrive = false;
    this.showWalk = true;
  }

  toggleShowDrive() {
    this.showWalk = false;
    this.showDrive = true;
  }

}
