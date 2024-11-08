import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visitor-input',
  templateUrl: './visitor-input.component.html',
  styleUrls: ['./visitor-input.component.scss'],
})
export class VisitorInputComponent  implements OnInit {

  @Input() placeholder: string='';
  @Input() extraClass: string='';
  
  constructor() { }

  ngOnInit() {}

}
