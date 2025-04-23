import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

interface payment {
  id: number,
  title: string,
  description: string,
  total: number,
  date: string,
  overdue_in: string,
  overdue: string
}

interface fines {
  id : number,
  fines_references : string,
  fines_name : string,
  start_date : string,
  due_date : string,
  total_bill : number,
  is_pay : boolean,
  overdue: boolean, // Menentukan status overdue
  offence_data : [
      {
          id : number,
          vehicle_number : string,
      }
  ]
}

interface FinesResponse {
  id: number,
  fines_references: string,
  fines_name: string,
  start_date: string,
  total_bill: string,
  offence_data: [],
  is_pay : string,
  pay_date: string,
}

interface FinesData {
  id: number,
  finesReferences: string,
  finesName: string,
  startDate: string,
  totalBill: string,
  offenceData: [],
  isPay : string,
  payDate: string,
}

interface BillsResponse {
  id: number,
  bill_references: string,
  bill_name: string,
  total_bill: number,
  pay_date: string,
  is_pay : boolean,
  start_date: string, 
}

interface BillsData {
  id: number,
  billReferences: string,
  billName: string,
  totalBill: number,
  payDate: string,
  isPay : boolean,
  startDate: string, 
}

@Component({
  selector: 'app-bills-and-fines-page',
  templateUrl: './bills-and-fines-page.page.html',
  styleUrls: ['./bills-and-fines-page.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class BillsAndFinesPagePage implements OnInit {

  isLoading: boolean = true;
  navButtonsMain: any[] = [
    {
      text: 'My Bills',
      active: true,
      action: 'click',
    },
    {
      text: 'Fines',
      active: false,
      action: 'click',
    },
    {
      text: 'History',
      active: false,
      action: 'click',
    },
  ]
  showFines: boolean = false;
  showHistory: boolean = false;
  showBills: boolean = true;

  billsLoaded: payment[] = [];

  fines: fines[] = []

  groupedData: { [key: string]: any[] } = {};
  isFilterApplied: boolean = false;
  isDatePickerOpen: boolean = false;
  viewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  viewDateForDatet: string = this.viewDate.toISOString().split('T')[0]; // Tanggal yang akan ditampilkan dalam
  filterByTypeValue: string = '';
  historyFines: FinesData[] = [];
  bills: BillsData[] = [];
  mergeData: any[] = [];

  constructor(
    private mainApiResidentService: MainApiResidentService,
    public functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    this.loadBills();
  }

  onClick(event: any) {
    // Reset semua tombol menjadi tidak aktif
    this.navButtonsMain.forEach(button => {
      button.active = false;
    });

    // Aktifkan tombol yang sesuai
    const selectedButton = this.navButtonsMain.find(button => button.text === event[1]);
    if (selectedButton) {
      selectedButton.active = true;
    }
    if (event[1] === 'My Bills') {
      this.isLoading = true;
      this.showFines = false;
      this.showHistory = false;
      this.showBills = true;
      this.loadBills();
    } else if (event[1] === 'Fines') {
      this.isLoading = true;
      this.showHistory = false;
      this.showBills = false;
      this.showFines = true;
      this.loadFinesData();
    } else if (event[1] === 'History') {
      this.isLoading = true;
      this.showBills = false;
      this.showFines = false;
      this.showHistory = true;
      this.loadHistoryPayment();
    }
  }

  loadBills() {
    this.billsLoaded = []
    this.mainApiResidentService.endpointMainProcess({}, 'get/active_bills').subscribe((result: any) => {
      this.isLoading = false;
      // console.log(result);
      const paymentLoaded = result.result.response_result;

      this.billsLoaded = paymentLoaded.map((item: any) => {
        const isOverdue = item.start_date < new Date().toISOString().split('T')[0];
        return {
          id: item.id,
          title: item.bill_references,
          description: item.bill_name,
          total: Number(item.total_bill),
          date: item.start_date,
          overdue_in: item.due_date,
          overdue: isOverdue ? 'Yes' : 'No' // Menentukan status overdue
        } as payment; // Menyatakan bahwa objek ini sesuai dengan tipe payment
      });

    })
  }

  loadFinesData() {
    this.mainApiResidentService.endpointMainProcess({}, 'get/active_fines').subscribe((response: any) => {
      this.isLoading = false
      // console.log(response.result)
      const finesLoaded = response.result.response_result;

      this.fines = finesLoaded.map((fine: any) => {
        const isOverdue = fine.start_date < new Date().toISOString().split('T')[0];
        return {
          id : fine.id,
          fines_references : fine.fines_references,
          fines_name : fine.fines_name,
          start_date : fine.start_date,
          due_date : fine.due_date,
          total_bill : fine.total_bill,
          is_pay : fine.is_pay,
          overdue: isOverdue ? true : false, // Menentukan status overdue
          offence_data : fine.offence_data.map((offence_data: any) => {
            return {
              id : offence_data.id,
              vehicle_number : offence_data.vehicle_number,
            }
          })
        }
      })
    })
  }

  payNow(idPayment: number) {
    console.log(idPayment);
  }

  clearFilter() {
    this.filterByTypeValue = '';
    this.viewDate = new Date();
    this.isFilterApplied = false; // Reset filter
    this.loadHistoryPayment(); // Memuat ulang semua data
  }

  filterByType(event: any) {
    const value = event.target.value;
    this.filterByTypeValue = value;
    this.loadHistoryPayment();
  }

  onDateChange(event: any) {
    this.viewDate = new Date(event.detail.value);
    this.isFilterApplied = true; // Tandai bahwa filter telah diterapkan
    this.loadHistoryPayment(); // Memuat ulang data berdasarkan tanggal yang dipilih
  }

  openDatePicker() {
    this.isDatePickerOpen = true; // Membuka modal pemilih tanggal
  }

  loadHistoryPayment() {
    this.mergeData = [];
    // // console.log(this.unitId, this.projectId, this.blockId);
    this.mainApiResidentService.endpointMainProcess({}, 'get/payment_history').subscribe((response: any) => {
      const fines = response.result.response_result.fines;
      const bills = response.result.response_result.bills;
      this.historyFines = fines.map((fine: FinesResponse) => {
        return {
          id: fine.id,
          fines_references: fine.fines_references,
          fines_name: fine.fines_name,
          start_date: fine.start_date,
          total_bill: fine.total_bill,
          is_pay: fine.is_pay,
          offence_data: fine.offence_data.map((offence_data: any) => {
            return {
              id: offence_data.id,
              vehicle_number: offence_data.vehicle_number,
            }
          }),
          pay_date: fine.pay_date,
        }
      });
    
      this.bills = bills.map((bill: BillsResponse) => {
        return {
          id: bill.id,
          bill_references: bill.bill_references,
          bill_name: bill.bill_name,
          total_bill: bill.total_bill,
          is_pay: bill.is_pay,
          pay_date: bill.pay_date,
          start_date: bill.start_date,
        }
      });
    
      // Mengurutkan mergeData berdasarkan start_date
      this.mergeData.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA.getTime() - dateB.getTime(); // Convert to timestamps before subtraction
      });
      // Filter berdasarkan tanggal

      // Jika filter belum diterapkan, muat semua data
      if (!this.isFilterApplied) {
        if (this.filterByTypeValue === 'bills') {
          this.mergeData = this.bills;
          // Grouping the data by month and year
          this.groupedData = this.groupByMonthYear(this.mergeData);
          this.isLoading = false;
        } else if (this.filterByTypeValue === 'fines') {
          this.mergeData = this.historyFines;
          this.groupedData = this.groupByMonthYear(this.mergeData);
          this.isLoading = false;
        } else {
          this.mergeData = [...this.historyFines, ...this.bills];
          this.groupedData = this.groupByMonthYear(this.mergeData);
          this.isLoading = false;
        }
      } else {
        // Filter berdasarkan tanggal
        const selectedMonth = this.viewDate.getMonth();
        const selectedYear = this.viewDate.getFullYear();

        this.mergeData = this.mergeData.filter(item => {
          const date = new Date(item.pay_date || item.start_date);
          return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
        });
      }

      // Grouping the data by month and year
      this.groupedData = this.groupByMonthYear(this.mergeData);
      this.isLoading = false;
    
      // // console.log(this.mergeData);
    });
  }

  getMonthYears(): string[] {
    return Object.keys(this.groupedData);
  }

  groupByMonthYear(data: any[]) {
    return data.reduce((acc, item) => {
      const date = new Date(item.pay_date || item.start_date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
      return acc;
    }, {});
  }

}
