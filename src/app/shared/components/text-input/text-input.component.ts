import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent  implements OnInit {

  @Input() placeholder: string='';
  @Input() type: string='text';
  @Input() customClasses: {[key:string]:boolean} = {};
  @Input() customInputClasses: {[key:string]:boolean} = {};
  // @Input() value: string = '';
  @Input() id: string = '';

  private _value: string = '';

  @Input()
  set value(val: string | Date) {
    if (val instanceof Date) {
      // Konversi Date ke string dalam format YYYY-MM-DD
      this._value = val.toISOString().split('T')[0];
    } else {
      this._value = val || '';
    }
  }

  get value(): string {
    return this._value;
  }

  @Output() keyupEvent = new EventEmitter<KeyboardEvent>();

  constructor() { }

  getFilteredClasses(classes: { [key: string]: boolean }) {
    return Object.keys(classes).filter(cls => classes[cls]);
  }

  ngOnInit() {}

  onKeyUp(event:KeyboardEvent){
    this.keyupEvent.emit(event);
  }

}
