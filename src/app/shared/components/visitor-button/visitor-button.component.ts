import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visitor-button',
  templateUrl: './visitor-button.component.html',
  styleUrls: ['./visitor-button.component.scss'],
})
export class VisitorButtonComponent  implements OnInit {

  @Input() text: string='';
  @Input() extraClass: string='';

  constructor() { }

  ngOnInit() {}

}
