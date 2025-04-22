import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-app-report-main',
  templateUrl: './app-report-main.page.html',
  styleUrls: ['./app-report-main.page.scss'],
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
export class AppReportMainPage implements OnInit {

  fromWhere: string = '';
  navButtons: any[] = [
    {
      text: 'Reported Issues',
      active: true,
      action: 'click'
    },
    {
      text: 'Report an Issues',
      active: false,
      action: 'click'
    },
  ]

  showBackButton: boolean = false;
  showRecord: boolean = true;
  showForm: boolean = false;

  reporterDetailsFrom = {
    requestorId: 1,
    blokId: 1,
    unitId: 1,
    name: 'John Doe',
    contactNumber: '1234567890',
    email: 'johndoe@example.com',
    blockAndUnit: 'Block 123, Unit 456',
    placeOfResidence: '123 Main St, City',
    typeReport: 0,
    summaryReport: ''
  };
  extend_mb = false
  typeOfReport: any = []

  isReportApp: string = '1';
  allData: any = [];

  constructor(
    private router: Router,
    private mainApi: MainApiResidentService
  ) {  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { fromWhere: string };
    if (state) {
      this.fromWhere = state.fromWhere;
      if (this.fromWhere === 'app-report') {
        this.loadTicketFromBackendFor(this.fromWhere);
        this.loadTypeFor(this.fromWhere);
      } else {
        this.loadTicketFromBackendFor(this.fromWhere);
        this.loadTypeFor(this.fromWhere);
      }
    }
  }

  onBack() {
    if (this.showBackButton === true) {
      this.showBackButton = false;
      this.showForm = false;
      this.showRecord = true;
      this.navButtons[0].active = true;
      this.navButtons[1].active = false;
      this.allData = [];
      this.loadTicketFromBackendFor(this.fromWhere);
      this.typeOfReport = [];
      this.loadTypeFor(this.fromWhere);
    } else {
      this.router.navigate(['/resident-home-page'])
    }
  }

  onClick(event: any) {
    if (event[1] === 'Report an Issues') {
      this.showBackButton = true;
      this.showRecord = false;
      this.showForm = true;
      this.navButtons[0].active = false;
      this.navButtons[1].active = true;
    }
  }

  loadTypeFor(whoIsThis: string) {
    console.log('tes');
    if (whoIsThis === 'app-report') {
      this.mainApi.endpointMainProcess({}, 'get/report_app_type_of_issues').subscribe((response: any) => {
        this.typeOfReport = response.result.result;
      })
    } else {
      this.mainApi.endpointMainProcess({}, 'get/report_condo_type_of_issue').subscribe((response: any) => {
        this.typeOfReport = response.result.result;
      })
    }
  }

  onTypeReportChange(event: any){
    // // console.log(event.target.value);
    const type = event.target.value;
    this.reporterDetailsFrom.typeReport = parseInt(type);
  }

  onSubmit() {
    this.mainApi.endpointMainProcess({
      type_of_issue: this.reporterDetailsFrom.typeReport,
      requestor_id: this.reporterDetailsFrom.requestorId,
      summary: this.reporterDetailsFrom.summaryReport,
    }, 'post/report_issue').subscribe((response: any) => {
      // // console.log(response);
      if (response.result.response_code === 200) {
        this.showBackButton = false;
        this.showForm = false;
        this.showRecord = true;
        this.navButtons[0].active = true;
        this.navButtons[1].active = false;
        this.loadTicketFromBackendFor(this.fromWhere);
        this.loadTypeFor(this.fromWhere);
      } else {
        // this.presentToast(response.result.message, 'danger');
      }
    })
  }

  testAddMb(status: boolean = false) {
    this.extend_mb = status
  }

  loadTicketFromBackendFor(whoIsThis: string) {
    console.log('tes');
    
    if (whoIsThis === 'app-report') {
      this.mainApi.endpointMainProcess({
        is_report_app: this.isReportApp,
        is_report_condo: '',
      }, 'get/report_issue').subscribe((response: any) => {
        // console.log(response);
        if (response.result.response_code === 200) {
          this.allData = response.result.result;
          // this.presentToast(response.result.message, 'success');
        } else {
          // this.presentToast(response.result.error_message, 'danger');
        }
      })
    } else {
      this.mainApi.endpointMainProcess({
        is_report_app: '',
        is_report_condo: this.isReportApp,
      }, 'get/report_issue').subscribe((response: any) => {
        // console.log(response);
        if (response.result.response_code === 200) {
          this.allData = response.result.result;
          // this.presentToast(response.result.message, 'success');
        } else {
          // this.presentToast(response.result.error_message, 'danger');
        }
      })
    }
  }

  seeDetail(ticket: any) {
    if (this.fromWhere === 'condo-report') {
      this.router.navigate(['/issue-app-detail-new'], {
        state: {
          ticketDetail: ticket,
          fromWhere: 'fromCondo'
        }
      });
    } else {
      this.router.navigate(['/issue-app-detail-new'], {
        state: {
          ticketDetail: ticket,
        }
      });
    }
    // // console.log(ticket);
  }

}
