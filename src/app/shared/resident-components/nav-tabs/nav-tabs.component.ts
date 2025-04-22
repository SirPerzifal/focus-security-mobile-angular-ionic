import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
})
export class NavTabsComponent  implements OnInit {

  @Input() buttons: any[] = [];
  @Output() eventEmitter = new EventEmitter<any>()

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  onClickValue(event: any, button: any) {
    if (event && button.active === false) {
      this.eventEmitter.emit([true, button.text])
    }
  }

  routeTo(route: string) {
    this.router.navigate([`${route}`])
  }
}
