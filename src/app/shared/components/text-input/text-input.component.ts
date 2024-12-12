import { Component, OnInit, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]

})
export class TextInputComponent  implements OnInit {

  @Input() placeholder: string='';
  @Input() type: string='text';
  @Input() customClasses: {[key:string]:boolean} = {};
  @Input() customInputClasses: {[key:string]:boolean} = {};
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() isReadonly: boolean = false;

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
    this.onChange(this._value);
    this.valueChange.emit(this._value);
  }

  get value(): string {
    return this._value;
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this._value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: Handle input disabling
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
    this.onChange(this._value); 
  }
}