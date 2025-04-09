import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss'],
})
export class SubmitButtonComponent  implements OnInit {

  @Input() text: string='';
  @Input() extraClass: string='';
  @Input() customStyle: string='';

  constructor() { }

  ngOnInit() {}
}
