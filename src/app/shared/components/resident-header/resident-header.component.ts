import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resident-header',
  templateUrl: './resident-header.component.html',
  styleUrls: ['./resident-header.component.scss'],
})
export class ResidentHeaderComponent  implements OnInit {

  constructor() { }

  @Input() text: string=""
  @Input() text_second: string=""
  @Input() secondClass: string=""

  ngOnInit() {}

}
