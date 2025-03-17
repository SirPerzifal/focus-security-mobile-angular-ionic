import { Component, OnInit, Output, Input, output } from '@angular/core';

@Component({
  selector: 'app-input-component',
  templateUrl: './input-component.component.html',
  styleUrls: ['./input-component.component.scss'],
})
export class InputComponentComponent  implements OnInit {
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
  }

  @Input() id: string = ''; 
  @Input() type: string = ''; 
  @Input() typeAction: string = ''; 
  @Input() labelParent: string = ''; 
  @Input() labelChild1: string = ''; 
  @Input() labelChild2: string = ''; 

  @Output() value: string = '';

  constructor() { }

  ngOnInit() {}

  clickDate(id: string) {
    setTimeout(() => {
      const dateInput = document.getElementById(id) as HTMLInputElement;
      if (dateInput) {
        dateInput.showPicker();
      }
    }, 0);
  }

  onDateChange(event: any) {
    console.log(event.target.value);
    if (event.target.value) {
      const date = new Date(event.target.value);
      this.value = this.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      console.log(this.value); // Log the selected date
    } else {
      this.value = ''
    }
  }

}
