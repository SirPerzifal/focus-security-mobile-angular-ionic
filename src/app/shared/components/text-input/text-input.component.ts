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
  @Input() id: string = '';

  // Tambahkan decorator @Output untuk value
  @Output() valueChange = new EventEmitter<string>();

  private _value: string = '';

  @Input()
  set value(val: string | Date) {
    if (val instanceof Date) {
      this._value = val.toISOString().split('T')[0];
    } else {
      this._value = val || '';
    }
    // Emit perubahan value
    this.valueChange.emit(this._value);
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
    // Konversi event target value ke string
    this._value = (event.target as HTMLInputElement).value;
    this.keyupEvent.emit(event);
    // Emit value baru
    this.valueChange.emit(this._value);
  }
}