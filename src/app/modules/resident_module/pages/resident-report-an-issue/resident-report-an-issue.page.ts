import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resident-report-an-issue',
  templateUrl: './resident-report-an-issue.page.html',
  styleUrls: ['./resident-report-an-issue.page.scss'],
})
export class ResidentReportAnIssuePage implements OnInit {
  reporterDetails = {
    name: 'John Doe',
    contactNumber: '1234567890',
    email: 'johndoe@example.com',
    blockAndUnit: 'Block 123, Unit 456',
    placeOfResidence: '123 Main St, City',
    summaryReport: ''
  };

  constructor() { }

  ngOnInit() {
    // You can fetch or set the reporter details here if needed
  }
}