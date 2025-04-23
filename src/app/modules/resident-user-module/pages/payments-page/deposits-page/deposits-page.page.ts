import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

interface ActiveDeposit {
  depositAmount: number,
  depositDate: string,
  eventDate: string,
  expectedReturnDepositDate: string, 
  facility: string,
  id: number
}

interface ActiveDepositResponse {
  deposit_amount: number,
  deposit_date: string,
  event_date: string,
  expected_return_deposit_date: string, 
  facility: string,
  id: number
}

interface HistoryDeposit {
  depositAmount: number,
  depositDate: string,
  eventDate: string,
  returnDepositDate: string, 
  facility: string,
  id: number
}

interface HistoryDepositResponse {
  deposit_amount: number,
  deposit_date: string,
  event_date: string,
  return_deposit_date: string, 
  facility: string,
  id: number
}

@Component({
  selector: 'app-deposits-page',
  templateUrl: './deposits-page.page.html',
  styleUrls: ['./deposits-page.page.scss'],
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
export class DepositsPagePage implements OnInit {

  pageName: string = 'Active Deposits'

  showMainContent = true;
  showDepositHistory = false;
  showMainContentTrans = false;
  showDepositHistoryTrans = false;

  activeDeposit: ActiveDeposit[] = []
  totalCurrentDeposit: number = 0;

  historyDeposit: HistoryDeposit[] = []
  totalRefundedDeposit: number = 0;

  filteredData: any[] = [];

  startDateFilter = '';
  endDateFilter = '';
  showDate = ''
  dateFilter = ''

  constructor(
    private mainApiresident: MainApiResidentService,
    public functionMain: FunctionMainService,
  ) { }

  ngOnInit() {
    this.loadActiveDeposit();
  }

  // Metode untuk menampilkan halaman deposit history
  showDepositHistoryPage() {
    this.activeDeposit = [];
    this.historyDeposit = [];
    this.loadHistoryDeposit();
    if (!this.showDepositHistory) {
      this.showMainContentTrans = true;
      this.showMainContent = false;
      setTimeout(() => {
        this.showDepositHistory = true;
      }, 300);
    }
  }

  // Metode untuk kembali ke halaman utama deposits
  backToMainDeposits() {
    this.activeDeposit = [];
    this.historyDeposit = [];
    this.loadActiveDeposit();
    if (!this.showMainContent) {
      this.showDepositHistoryTrans = true;
      this.showDepositHistory = false;
      setTimeout(() => {
        this.showMainContent = true;
      }, 300);
    }
  }

  loadActiveDeposit() {
    this.mainApiresident.endpointMainProcess({}, 'get/active_deposit').subscribe((response: any) => {
      // console.log('active', response.result);
      this.activeDeposit = response.result.response_result.map((activeDeposit: ActiveDepositResponse) => {
        this.totalCurrentDeposit += activeDeposit.deposit_amount;
        return {
          depositAmount: activeDeposit.deposit_amount,
          depositDate: activeDeposit.deposit_date,
          eventDate: activeDeposit.event_date,
          expectedReturnDepositDate: activeDeposit.expected_return_deposit_date, 
          facility: activeDeposit.facility,
          id: activeDeposit.id
        }
      })
      // console.log(this.activeDeposit, this.totalCurrentDeposit);
    })
  }

  loadHistoryDeposit() {
    this.mainApiresident.endpointMainProcess({}, 'get/deposit_history').subscribe((response: any) => {
      // console.log('history', response.result);
      this.historyDeposit = response.result.response_result.map((historyDeposit: HistoryDepositResponse) => {
        this.totalRefundedDeposit += historyDeposit.deposit_amount;
        return {
          depositAmount: historyDeposit.deposit_amount,
          depositDate: historyDeposit.deposit_date,
          eventDate: historyDeposit.event_date,
          returnDepositDate: historyDeposit.return_deposit_date, 
          facility: historyDeposit.facility,
          id: historyDeposit.id
        }
      })
      this.filteredData = [...this.historyDeposit];
      // console.log(this.historyDeposit, this.totalRefundedDeposit);
    })
  }

  onChangeStartDate(value: any) {
    const date = new Date(value);
    this.startDateFilter = this.functionMain.formatDate(date);
    this.applyFilters();
  }

  onChangeEndDate(value: any) {
    const date = new Date(value);
    this.endDateFilter = this.functionMain.formatDate(date);
    this.applyFilters();
  }

  clearDateFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.dateFilter = '';
    this.showDate = '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData = this.historyDeposit.filter(item => {
      const visitorDate = new Date(item.returnDepositDate);
      visitorDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for date comparison
      
      const [ dayStart, monthStart, yearStart ] = this.startDateFilter.split('/');
      const setDefaultValueDateStart = `${yearStart}-${monthStart}-${dayStart}`
      const [ dayEnd, monthEnd, yearEnd ] = this.endDateFilter.split('/');
      const setDefaultValueDateEnd = `${yearEnd}-${monthEnd}-${dayEnd}`
      
      // Convert the selected start and end dates to Date objects
      const selectedStartDate = this.startDateFilter ? new Date(setDefaultValueDateStart) : null;
      const selectedEndDate = this.endDateFilter ? new Date(setDefaultValueDateEnd) : null;
  
      // Set time to 00:00:00 for comparison
      if (selectedStartDate) {
        selectedStartDate.setHours(0, 0, 0, 0);
      }
      if (selectedEndDate) {
        selectedEndDate.setHours(0, 0, 0, 0);
      }
      const dateMatches = (!selectedStartDate || visitorDate >= selectedStartDate) && (!selectedEndDate || visitorDate <= selectedEndDate);
  
      return dateMatches;
    });
  }
}
