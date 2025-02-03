import { Component, OnInit,ViewChild } from '@angular/core';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';

@Component({
  selector: 'app-bills-history',
  templateUrl: './bills-history.page.html',
  styleUrls: ['./bills-history.page.scss'],
})
export class BillsHistoryPage implements OnInit {

  @ViewChild('billsStartDateHistory') billsStartDateInput!: TextInputComponent;

  constructor() { }

  ngOnInit() {
    this.groupBills();
  }

  historyData: Array<{
    violation_date: Date;
    paid_on: Date;
    status: string;
    desc_title: string;
    title:string;
    vehicle_number:string;
    total:string;
    id: number;
  }> = [{
    violation_date:new Date(2024, 8, 27),
    paid_on:new Date(2024, 8, 27, 8, 30, 0),
    status:'paid',
    desc_title:'Wheel Clamped',
    title:'Parking Violation',
    vehicle_number:'SBS1234A',
    total:'S$250.00',
    id:1
  },{
    violation_date:new Date(2024, 7,1),
    paid_on:new Date(2024, 7,25, 9, 0, 0),
    status:'paid',
    desc_title:'Monthly Maintenance Fee',
    title:'Maintenance Fee',
    vehicle_number:'SBS1234A',
    total:'S$450.00',
    id:2
  },{
    violation_date:new Date(2024, 7,1),
    paid_on:new Date(2024, 8,25, 8, 30, 0),
    status:'paid',
    desc_title:'Monthly Maintenance Fee',
    title:'Maintenance Fee',
    vehicle_number:'SBS1234A',
    total:'S$250.00',
    id:3
  }];

  groupedPayments: { [key: string]: any[] } = {};

  filteredData: any[] = [];
  startDateFilter = ''
  endDateFilter = ''
  usableFilterDate = ''
  showStartDate = ''
  showEndDate = ''
  typeFilter = 'All'
  isDatePickerOpen: boolean = false; // Menyimpan status modal
  viewDate: Date | null = null; // Tanggal yang akan ditampilkan
  viewDateForDatet: string | null = null; // Tanggal yang akan ditampilkan dalam

  // onChangeStartDate(value: Event) {
  //   const input = value.target as HTMLInputElement;
  //   this.startDateFilter = input.value;
  //   const dateParts = this.startDateFilter.split('-');
  //   this.showStartDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Format to dd/mm/yyyy
  //   console.log(this.showStartDate)
  //   console.log(typeof this.showStartDate)
  //   this.groupBills()
  // }

  onDateChange(event: any) {
    this.viewDate = new Date(event.detail.value);
    this.startDateFilter = event.detail.value;

    if (!this.startDateFilter) {
      // Handle clear scenario
      this.usableFilterDate = '';
      this.showStartDate = '';
      this.groupBills();
      return;
    }

    const day = String(this.viewDate.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const month = String(this.viewDate.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
    const year = this.viewDate.getFullYear();
    // const date = new Date(year, month, day);
    
    this.usableFilterDate = `${day}/${month}/${year}`;
    this.showStartDate = this.viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });
    this.groupBills();
  }

  openDatePicker() {
    this.isDatePickerOpen = true; // Membuka modal pemilih tanggal
  }

  onChangeStartDate(value: Event) {
    console.log(value);
    console.log('valuevaluevaluevaluevaluevaluevalue');
    
    const input = value.target as HTMLInputElement;
    this.startDateFilter = input.value;

    if (!this.startDateFilter) {
      // Handle clear scenario
      this.usableFilterDate = '';
      this.showStartDate = '';
      this.groupBills();
      return;
    }

    const dateParts = this.startDateFilter.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2] || "1", 10);
    const date = new Date(year, month, day);
    
    this.usableFilterDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    this.showStartDate = date.toLocaleString("en-US", { month: "long", year: "numeric" });
    this.groupBills();
    // const input = value.target as HTMLInputElement;
    // this.startDateFilter = input.value;
    // const dateParts = this.startDateFilter.split('-');
    // const year = parseInt(dateParts[0], 10);
    // const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based
    // const day = parseInt(dateParts[2] || "1", 10); // Default day is 1 if undefined
    // const date = new Date(year, month, day);
    // this.usableFilterDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    // this.showStartDate = date.toLocaleString("en-US", { month: "long", year: "numeric" });
    // this.groupBills();
  }

  onChangeEndDate(value: Event){
    const input = value.target as HTMLInputElement;
    this.endDateFilter = input.value;
    const dateParts = this.endDateFilter.split('-');
    this.showEndDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Format to dd/mm/yyyy
    console.log(this.showEndDate)
  }

  onChangePaymentHistoryType(event: Event) {
    const target = event.target as HTMLInputElement;
    this.typeFilter = target.value;
  
    this.groupBills();
  }

  groupBills() {
    console.log('groupBillsgroupBillsgroupBillsgroupBills');
    
    if(this.usableFilterDate!=''){
      const [_, month, year] = this.usableFilterDate.split('/');
      const filterMonth = parseInt(month) - 1; // Subtract 1 because JS months are 0-based
      const filterYear = parseInt(year);
  
      // Filter bills before grouping
      var filteredBills = this.historyData.filter(bill => {
        const billDate = new Date(bill.violation_date);
        const dateMatches = billDate.getMonth() === filterMonth && 
                           billDate.getFullYear() === filterYear;
        const typeMatches = this.typeFilter === 'All' || 
                           bill.desc_title.includes(this.typeFilter);
        return dateMatches && typeMatches;
      });
    }else{
      var filteredBills = this.historyData.filter(bill => {
        const typeMatches = this.typeFilter === 'All' || 
                           bill.desc_title.includes(this.typeFilter);
        return typeMatches;
      });
    }

    // Group the filtered bills
    this.groupedPayments = filteredBills.reduce((groups: { [key: string]: any[] }, bill) => {
      const date = bill.violation_date;
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(bill);
      return groups;
    }, {});
  }

  clearFilter() {
    console.log('clearFilterclearFilterclearFilterclearFilter');
    this.viewDate = null
    this.viewDateForDatet = '---- / -----'
    
    this.showStartDate = '';
    this.usableFilterDate = '';
    this.showEndDate = '';
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.typeFilter = 'All';

    if (this.billsStartDateInput) {
      this.billsStartDateInput.clearMonthInput();
    }

    this.groupBills();
  }

  getMonthGroups(): string[] {
    return Object.keys(this.groupedPayments).sort((a, b) => {
      // Fixed: Using getTime() for date comparison
      const dateA = new Date(this.groupedPayments[a][0].violation_date).getTime();
      const dateB = new Date(this.groupedPayments[b][0].violation_date).getTime();
      return dateB - dateA;
    });
  }

  formatDateTime(date: Date): string {
    return `${date.toLocaleDateString('en-SG')}, ${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}am`;
  }

  // applyFilters() {
  //   this.filteredData = this.historyData.filter(item => {
  //     const visitorDate = new Date(item.violation_date);
  //     visitorDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for date comparison
  
  //     // Convert the selected start and end dates to Date objects
  //     const selectedStartDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
  //     const selectedEndDate = this.endDateFilter ? new Date(this.endDateFilter) : null;
  
  //     // Set time to 00:00:00 for comparison
  //     if (selectedStartDate) {
  //       selectedStartDate.setHours(0, 0, 0, 0);
  //     }
  //     if (selectedEndDate) {
  //       selectedEndDate.setHours(0, 0, 0, 0);
  //     }
  
  //     const dateMatches = (!selectedStartDate || visitorDate >= selectedStartDate) &&
  //                         (!selectedEndDate || visitorDate <= selectedEndDate);
  //     const typeMatches = this.typeFilter ? item.desc_title === this.typeFilter : true;
  
  //     return dateMatches && typeMatches;
  //   });
  // }
  

}
