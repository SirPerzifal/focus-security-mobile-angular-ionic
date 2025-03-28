import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Preferences } from '@capacitor/preferences';

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
  selector: 'app-payment-deposits',
  templateUrl: './payment-deposits.page.html',
  styleUrls: ['./payment-deposits.page.scss'],
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
export class PaymentDepositsPage implements OnInit {

  showMainContent = true;
  showDepositHistory = false;
  showMainContentTrans = false;
  showDepositHistoryTrans = false;

  unitId: number = 0;
  projectId: number = 0;

  activeDeposit: ActiveDeposit[] = []
  totalCurrentDeposit: number = 0;

  historyDeposit: HistoryDeposit[] = []
  totalRefundedDeposit: number = 0;

  constructor(
    private mainApiresident: MainApiResidentService,
    public functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unitId = parseValue.unit_id; // Ambil data unit_id
        this.projectId = parseValue.project_id; // Ambil data project_id
        this.loadActiveDeposit();
        this.loadHistoryDeposit();
      }
    })
  }

  // Metode untuk menampilkan halaman deposit history
  showDepositHistoryPage() {
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
    if (!this.showMainContent) {
      this.showDepositHistoryTrans = true;
      this.showDepositHistory = false;
      setTimeout(() => {
        this.showMainContent = true;
      }, 300);
    }
  }

  loadActiveDeposit() {
    this.mainApiresident.endpointProcess({
      unit_id: this.unitId,
      project_id: this.projectId
    }, 'get/active_deposit').subscribe((response: any) => {
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
    this.mainApiresident.endpointProcess({
      unit_id: this.unitId,
      project_id: this.projectId
    }, 'get/deposit_history').subscribe((response: any) => {
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
      // console.log(this.historyDeposit, this.totalRefundedDeposit);
    })
  }
}
