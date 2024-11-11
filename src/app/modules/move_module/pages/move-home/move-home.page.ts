import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-move-home',
  templateUrl: './move-home.page.html',
  styleUrls: ['./move-home.page.scss'],
})
export class MoveHomePage implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
  }

  form() {
    this.router.navigate(['move-form']);
  }

  renov_form(){
    this.router.navigate(['renov-form']);
  }
}
