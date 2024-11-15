import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav-bar',
  templateUrl: './bottom-nav-bar.component.html',
  styleUrls: ['./bottom-nav-bar.component.scss'],
})
export class BottomNavBarComponent  implements OnInit {

  constructor(private router: Router,) { }

  routeTo() {
    this.router.navigate(['/resident-homepage']);
  }

  ngOnInit() {}

}
