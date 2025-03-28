import { Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Subscription } from 'rxjs';

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
  selector: 'app-bills-history',
  templateUrl: './bills-history.page.html',
  styleUrls: ['./bills-history.page.scss'],
})
export class BillsHistoryPage implements OnInit, OnDestroy {
  isLoading: boolean = true;
  groupedData: { [key: string]: any[] } = {};

  isFilterApplied: boolean = false;
  isDatePickerOpen: boolean = false;
  viewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  viewDateForDatet: string = this.viewDate.toISOString().split('T')[0]; // Tanggal yang akan ditampilkan dalam
  filterByTypeValue: string = '';

  fines: FinesData[] = [];
  bills: BillsData[] = [];
  mergeData: any[] = [];

  blockId: number = 0;
  unitId: number = 0;
  projectId: number = 0;

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

  constructor(private mainApiResidentService: MainApiResidentService, public functionMainService: FunctionMainService) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unitId = parseValue.unit_id; // Ambil data unit_id
        this.blockId = parseValue.block_id; // Ambil data block_id
        this.projectId = parseValue.project_id; // Ambil data project_id
        this.loadHistoryPayment()
      }
    })
  }

  loadHistoryPayment() {
    this.mergeData = [];
    // // console.log(this.unitId, this.projectId, this.blockId);
    this.mainApiResidentService.endpointProcess({
      unit_id: this.unitId,
      project_id: this.projectId,
      block_ids: this.blockId
    }, 'get/payment_history').subscribe((response: any) => {
      const fines = response.result.response_result.fines;
      const bills = response.result.response_result.bills;
      this.fines = fines.map((fine: FinesResponse) => {
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
          this.mergeData = this.fines;
          this.groupedData = this.groupByMonthYear(this.mergeData);
          this.isLoading = false;
        } else {
          this.mergeData = [...this.fines, ...this.bills];
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

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
