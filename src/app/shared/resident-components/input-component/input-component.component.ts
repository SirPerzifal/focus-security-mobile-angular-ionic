import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { IonDatetime, Platform } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-input-component',
  templateUrl: './input-component.component.html',
  styleUrls: ['./input-component.component.scss'],
})
export class InputComponentComponent  implements OnInit {
  
  @Input() id: string = ''; 
  @Input() type: string = ''; 
  @Input() typeAction: string = ''; 
  @Input() labelParent: string = ''; 
  @Input() labelChild1: string = ''; 
  @Input() labelChild2: string = ''; 
  @Input() fontInBoxClass: string = '';
  @Input() minDate: string = ''; 
  @Output() eventEmitter = new EventEmitter<any>()

  @Input() value: string = '';

  @ViewChild('dateTimePicker') dateTimePicker!: IonDatetime;
  
  isoStringValue: string = '';
  isOpen: boolean = false;

  constructor(
    private functionMain: FunctionMainService,
    private platform: Platform
  ) { }

  ngOnInit() {}

  openDateTimePicker() {
    // Fix 2: Instead of open(), use isOpen property with modal presentation
    this.isOpen = true;
  }
  
  cancelDateChange() {
    this.isOpen = false;
  }
  
  confirmDateChange() {
    this.isOpen = false;
    // Handle confirmation if needed
  }

  clickDate(id: string) {
    setTimeout(() => {
      const dateInput = document.getElementById(id) as HTMLInputElement;
      if (dateInput) {
        dateInput.showPicker();
      }
    }, 0);
  }

  onValueChange(event: any, type: string) {
    if (event.target.type === 'text') {
      const value = event.target.value;
      this.eventEmitter.emit(value)
    } else {
      if (event.target.value) {
        const date = new Date(event.target.value);
        this.value = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
        this.eventEmitter.emit(this.value)
      } else {
        this.value = ''
      }
    }
  }

  onDateTimeChange(event: any) {
    const isoDate = event.detail.value;
    if (isoDate) {
      const date = new Date(isoDate);
      this.isOpen = false;
      this.eventEmitter.emit(date);
    }
  }

  public changeDateFormatToDefault(date: any) {
    const [ day, month, year ] = date.split('/');
    if (month && year) {
      return `${year}-${month}-${day}`
    } else {
      return date
    }
  }

}
