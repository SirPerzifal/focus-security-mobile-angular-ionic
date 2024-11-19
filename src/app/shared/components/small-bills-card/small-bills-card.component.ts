import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-small-bills-card',
  templateUrl: './small-bills-card.component.html',
  styleUrls: ['./small-bills-card.component.scss'],
})
export class SmallBillsCardComponent  implements OnInit {

  constructor() { }

  @Input() title: string=""
  @Input() description: string=""
  @Input() total: string=""
  @Input() warning: boolean=false


  ngOnInit() {}

}
