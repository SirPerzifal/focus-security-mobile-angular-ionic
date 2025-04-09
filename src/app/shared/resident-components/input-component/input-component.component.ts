import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

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
  @Input() minDate: string = ''; 
  @Output() eventEmitter = new EventEmitter<any>()

  @Output() value: string = '';

  constructor(
    private functionMain: FunctionMainService
  ) { }

  ngOnInit() {}

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

}
