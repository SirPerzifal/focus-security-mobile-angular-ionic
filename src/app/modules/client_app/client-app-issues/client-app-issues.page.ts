import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { ReportIssueService } from 'src/app/service/resident/report-issue/report-issue.service';

@Component({
  selector: 'app-client-app-issues',
  templateUrl: './client-app-issues.page.html',
  styleUrls: ['./client-app-issues.page.scss'],
})
export class ClientAppIssuesPage implements OnInit {

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

  constructor(private reportIssueService: ReportIssueService, private toastController: ToastController, private router: Router, private getUserInfoService: GetUserInfoService, private authService: AuthService, private clientMainService: ClientMainService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    console.log("tes");
    this.loadType();
    this.loadTicketFromBackend();
    this.loadUserInfo()
  }

  userData = {
    name: '',
    name_condo: '',
    type: '',
    block: '',
    unit: '',
    email: '',
    contact: ''
  };

  loadUserInfo() {
    this.getUserInfoService.getPreferenceStorage(['user', 'family', 'type_family', 'block_name', 'unit_name']).then((value) => {
      const parse_user = this.authService.parseJWTParams(value.user);

      this.userData = {
        name: parse_user.name,
        name_condo: 'KingsMan Condo',
        type: value.type_family,
        block: value.block_name ? value.block_name : '-',
        unit: value.unit_name ? value.unit_name : '-',
        email: parse_user.email,
        contact: parse_user.email,
      }

      console.log(this.userData);
      
    })
  }

  onBack() {
    // if (this.isMain) {
      this.router.navigate(['/client-main-app'])
    // } else if (this.isNewReport) {
    //   this.toggleShowReport()
    // }
  }
  
  isMain = true
  isNewReport = false
  textSecond = 'Record of Report'

  toggleShowNew(){
    this.isMain = false
    this.isNewReport = true
    this.textSecond = 'Add App Report'
    // setTimeout(() => {
    //   this.isNewReport = true
    // }, 300)
  }

  toggleShowReport(){
    this.isNewReport = false
    this.isMain = true
    this.textSecond = 'Record of Report'
    // setTimeout(() => {
    //   this.isMain = true
    // }, 300)
  }

  loadType() {
    this.reportIssueService.getReportAppTypeOfIssues().subscribe(
      (response) => {
        // console.log(response);
        this.typeOfReport = response.result.result;
        // this.presentToast(response.result.message, 'success');
      },
      (error) => {
        // this.presentToast('Failed to load your report. Please try again later.', 'danger');
        console.error(error);
      }
    );
  }

  onTypeReportChange(event: any){
    // console.log(event.target.value);
    const type = event.target.value;
    this.reporterDetailsFrom.typeReport = parseInt(type);
  }

  onSubmit() {
    // Simpan data ke server
    this.reportIssueService.postReportIssue(
      this.reporterDetailsFrom.typeReport,
      this.reporterDetailsFrom.requestorId,
      this.reporterDetailsFrom.summaryReport,
      this.reporterDetailsFrom.unitId,
      this.reporterDetailsFrom.blokId,
    ).subscribe(
      (response) => {
        // console.log(response);
        if (response.result.response_code === 200) {
          this.toggleShowReport()
        } else {
          // this.presentToast(response.result.message, 'danger');
        }
      },
      (error) => {
        // this.presentToast('Failed to submit your report. Please try again later.', 'danger');
        console.error(error);
      }
    );
  }

  testAddMb(status: boolean = false) {
    this.extend_mb = status
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  unitId: number = 1;
  isReportApp: string = '1';
  allData: any = [];
  isLoading = false

  loadTicketFromBackend() {
    this.isLoading = true
    this.clientMainService.getApi({is_report_app: this.isReportApp}, '/client/get/report_issue').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          if (results.result.result.length > 0){
            this.allData = results.result.result;

          } else {
          }
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`Failed!`, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  seeDetail(ticket: any) {
    // console.log(ticket);
    this.router.navigate(['/client-ticket-detail'], {
      state: {
        ticket: {
          id: ticket.ticket_id,
          ticket_status: ticket.ticket_status,
        },
        issue: true
      },
    });
  }

}
