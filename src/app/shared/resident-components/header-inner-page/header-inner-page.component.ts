import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-inner-page',
  templateUrl: './header-inner-page.component.html',
  styleUrls: ['./header-inner-page.component.scss'],
})
export class HeaderInnerPageComponent  implements OnInit {

  constructor() { }

  @Input() text: string=""
  @Input() text_second: string=""

  ngOnInit() {}

}
