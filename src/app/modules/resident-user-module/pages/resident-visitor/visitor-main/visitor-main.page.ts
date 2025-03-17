import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitor-main',
  templateUrl: './visitor-main.page.html',
  styleUrls: ['./visitor-main.page.scss'],
})
export class VisitorMainPage implements OnInit {
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
  }

  navButtonsMain: any[] = [
    {
      text: 'Daily Invite',
    },
    {
      text: 'Hired Car',
    },
    {
      text: 'History',
    },
  ]
  navButtonsSub: any[] = [
    {
      text: 'New Invite',
    },
    {
      text: 'Active Invite',
    }
  ]

  selectedDate: string = '';

  constructor() { }

  ngOnInit() {
  }

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
      this.selectedDate = this.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      console.log(this.selectedDate); // Log the selected date
    } else {
      this.selectedDate = ''
    }
  }
}