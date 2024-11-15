import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multi-line-button',
  templateUrl: './multi-line-button.component.html',
  styleUrls: ['./multi-line-button.component.scss'],
})
export class MultiLineButtonComponent implements OnInit {

  @Input() text: string = '';
  @Input() extraClass: string = '';
  @Input() customStyle: string = '';

  constructor() { }

  ngOnInit() {}

}