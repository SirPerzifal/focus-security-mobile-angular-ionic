import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resident-report-an-app-issue',
  templateUrl: './resident-report-an-app-issue.page.html',
  styleUrls: ['./resident-report-an-app-issue.page.scss'],
})
export class ResidentReportAnAppIssuePage implements OnInit {
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
