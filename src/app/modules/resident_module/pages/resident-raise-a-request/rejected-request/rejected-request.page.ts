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
        applicationDate: '10-01-2023',
        vehicleNumber: 'B1234XYZ',
        startDate: '10-05-2023',
        endDate: '10-06-2023',
      },
      {
        statusBooked: 'Pending Approval',
        applicationDate: '10-02-2023',
        vehicleNumber: 'B5678ABC',
        startDate: '10-07-2023',
        endDate: '10-08-2023',
      },
      {
        statusBooked: 'Rejected',
        applicationDate: '10-03-2023',
        vehicleNumber: 'B9101DEF',
        startDate: '10-09-2023',
        endDate: '10-10-2023',
      },
      {
        statusBooked: 'Cancelled',
        applicationDate: '10-04-2023',
        vehicleNumber: 'B1121GHI',
        startDate: '10-11-2023',
        endDate: '10-12-2023',
      },
      {
        statusBooked: 'Requested',
        applicationDate: '10-05-2023',
        vehicleNumber: 'B3141JKL',
        startDate: '10-13-2023',
        endDate: '10-14-2023',
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
