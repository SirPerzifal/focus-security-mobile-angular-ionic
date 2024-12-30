import { Component, OnInit } from '@angular/core';

interface HistoryRequest {
  statusBooked: string;
  applicationDate: string;
  vehicleNumber: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-rejected-request',
  templateUrl: './rejected-request.page.html',
  styleUrls: ['./rejected-request.page.scss'],
})
export class RejectedRequestPage implements OnInit {
  hisrotyRequests: HistoryRequest[] = [];

  constructor() { }

  ngOnInit() {
    this.loadHistoryRequests();
  }

  loadHistoryRequests() {
    this.hisrotyRequests = [
      {
        statusBooked: 'Approved',
        applicationDate: '2023-10-01',
        vehicleNumber: 'B1234XYZ',
        startDate: '2023-10-05',
        endDate: '2023-10-06',
      },
      {
        statusBooked: 'Pending Approval',
        applicationDate: '2023-10-02',
        vehicleNumber: 'B5678ABC',
        startDate: '2023-10-07',
        endDate: '2023-10-08',
      },
      {
        statusBooked: 'Rejected',
        applicationDate: '2023-10-03',
        vehicleNumber: 'B9101DEF',
        startDate: '2023-10-09',
        endDate: '2023-10-10',
      },
      {
        statusBooked: 'Cancelled',
        applicationDate: '2023-10-04',
        vehicleNumber: 'B1121GHI',
        startDate: '2023-10-11',
        endDate: '2023-10-12',
      },
      {
        statusBooked: 'Requested',
        applicationDate: '2023-10-05',
        vehicleNumber: 'B3141JKL',
        startDate: '2023-10-13',
        endDate: '2023-10-14',
      },
    ];
  }

  gethisrotyRequestStatusLabel(status: string): string {
    switch (status) {
      case 'Approved':
        return 'Approved';
      case 'Pending Approval':
        return 'Pending Approval';
      case 'Pending Payment':
        return 'Pending Payment';
      case 'Rejected':
        return 'Rejected';
      case 'Cancelled':
        return 'Cancelled';
      case 'Requested':
        return 'Requested';
      default:
        return 'Unknown Status';
    }
  }
}
