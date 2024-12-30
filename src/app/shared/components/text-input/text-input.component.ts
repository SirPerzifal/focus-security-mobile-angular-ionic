import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
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
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() labelText: string = '';
  @Input() labelResidentText: string = '';
  @Input() labelResidentClass: string = '';
  @Input() type: string = 'text';
  @Input() customClasses: {[key: string]: boolean} = {};
  @Input() customInputClasses: {[key: string]: boolean} = {};
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() isReadonly: boolean = false;
  @Input() min: string | null = null;

  @Output() valueChange = new EventEmitter<string>();
  @Output() keyupEvent = new EventEmitter<KeyboardEvent>();

  private _value: string = '';
  private _displayValue: string = '';
  showDatePicker: boolean = false;

  @Input()
  set value(val: string | Date) {
    if (this.type === 'date') {
      if (val instanceof Date) {
        this._value = this.formatDateForInput(val);
        this._displayValue = this.formatDateForDisplay(val);
      } else if (val) {
        const date = new Date(val);
        if (!isNaN(date.getTime())) {
          this._value = this.formatDateForInput(date);
          this._displayValue = this.formatDateForDisplay(date);
        }
      }
    } else {
      this._value = val?.toString() || '';
      this._displayValue = this._value;
    }
    
    this.onChange(this._value);
    this.valueChange.emit(this._value);
  }

  get value(): string {
    return this.type === 'date' ? this._displayValue : this._value;
  }

  get hiddenDateValue(): string {
    return this._value;
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatDateForDisplay(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onDateInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      const date = new Date(input.value);
      this._value = this.formatDateForInput(date);
      this._displayValue = this.formatDateForDisplay(date);
      this.onChange(this._value);
      this.valueChange.emit(this._value);
    }
  }

  onDisplayInputClick(): void {
    if (this.type === 'date' && !this.isReadonly) {
      this.showDatePicker = true;
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        const dateInput = document.getElementById(`${this.id}-date-picker`) as HTMLInputElement;
        if (dateInput) {
          dateInput.showPicker();
        }
      }, 0);
    }
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      this.value = value;
    } else {
      this._value = '';
      this._displayValue = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle input disabling if needed
  }

  constructor() { }

  getFilteredClasses(classes: { [key: string]: boolean }) {
    return Object.keys(classes).filter(cls => classes[cls]);
  }

  getFilteredCustomClasses(classes: { [key: string]: boolean }) {
    return Object.keys(classes).filter(cls => classes[cls]);
  }

  ngOnInit() {}

  onKeyUp(event: KeyboardEvent): void {
    if (this.type !== 'date') {
      const inputValue = (event.target as HTMLInputElement).value;
      this._value = inputValue;
      this._displayValue = inputValue;
      this.keyupEvent.emit(event);
      this.valueChange.emit(this._value);
      this.onChange(this._value);
    } else {
      this._value = (event.target as HTMLInputElement).value;
      this.keyupEvent.emit(event);
      // Emit value baru
      this.valueChange.emit(this._value);
      this.onChange(this._value); 
    }
  }
}