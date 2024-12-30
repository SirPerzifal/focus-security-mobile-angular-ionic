import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bills-history',
  templateUrl: './bills-history.page.html',
  styleUrls: ['./bills-history.page.scss'],
})
export class BillsHistoryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  startDateFilter = ''
  showStartDate = ''

  onChangeStartDate(value: Event) {
    const input = value.target as HTMLInputElement;
    this.startDateFilter = input.value;
    const dateParts = this.startDateFilter.split('-');
    this.showStartDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Format to dd/mm/yyyy
    console.log(this.showStartDate)
  }
  

}
