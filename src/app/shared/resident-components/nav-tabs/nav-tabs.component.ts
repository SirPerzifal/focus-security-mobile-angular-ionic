import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
})
export class NavTabsComponent  implements OnInit {

  @Input() buttons: any[] = [];

  constructor() { }

  ngOnInit() {}

}
