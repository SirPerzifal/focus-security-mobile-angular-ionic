import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coaches-module',
  templateUrl: './coaches-module.page.html',
  styleUrls: ['./coaches-module.page.scss'],
})
export class CoachesModulePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  form() {
    this.router.navigate(['coaches-form']);
  }

}
