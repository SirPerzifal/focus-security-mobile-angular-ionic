import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-small-bills-card-detailed',
  templateUrl: './small-bills-card-detailed.component.html',
  styleUrls: ['./small-bills-card-detailed.component.scss'],
})
export class SmallBillsCardDetailedComponent  implements OnInit {

  constructor() { }

  @Input() title: string=""
  @Input() desc_title: string=""
  @Input() vehicle_no: string=""
  @Input() violation_date: string=""
  @Input() paid_on: string=""
  @Input() total: string=""
  @Input() warning: boolean=false

  ngOnInit() {}

}
