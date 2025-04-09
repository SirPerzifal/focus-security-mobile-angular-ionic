import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio-check-input-case',
  templateUrl: './radio-check-input-case.component.html',
  styleUrls: ['./radio-check-input-case.component.scss'],
})
export class RadioCheckInputCaseComponent implements OnInit {

  @Input() type: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() checkedText: boolean = false;
  @Input() text: string = '';
  @Output() valueEmit = new EventEmitter<any>();
  
  @Input() check: boolean = false;
  @Input() classForLabelCheck: string = '';

  constructor() { }

  ngOnInit() {}

  onChange(event: any) {
    this.valueEmit.emit({
      click: event.target.checked,
      value: event.target.value
    });
  }

  onChangeCheck(event: any) {
    this.valueEmit.emit({
      click: event.target.checked,
      value: event.target.value
    });
  }
}