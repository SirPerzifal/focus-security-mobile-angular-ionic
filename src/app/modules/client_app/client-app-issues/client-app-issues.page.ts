import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    name: '',
    contactNumber: '',
    email: '',
    blockAndUnit: '',
    placeOfResidence: '',
    typeReport: 0,
    summaryReport: '',
    ticketAttachment: '',
  };
  extend_mb = false
  typeOfReport: any = []

  constructor(private reportIssueService: ReportIssueService, private toastController: ToastController, private router: Router, private getUserInfoService: GetUserInfoService, private authService: AuthService, private clientMainService: ClientMainService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    console.log("tes");
    this.loadUserInfo()
  }

  userData = {
    name: '',
    name_condo: '',
    email: '',
    project_id: 1,
    contact: ''
  };

  loadUserInfo() {
    this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.userData = {
        name: value.name,
        name_condo: value.project_name,
        project_id: value.project_id,
        email: value.email,
        contact: value.contact_number,
      }
      this.loadType();
      this.loadTicketFromBackend();
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
    this.resetForm()
    // setTimeout(() => {
    //   this.isMain = true
    // }, 300)
  }

  loadType() {
    this.reportIssueService.getReportAppTypeOfIssues(this.userData.project_id).subscribe(
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
    let errMsg = ''
    if (!this.reporterDetailsFrom.typeReport) {
      errMsg += 'Type of issue is required!'
    }
    if (!this.reporterDetailsFrom.summaryReport) {
      errMsg += 'Summary is required!'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    let params = {
      type_of_issue: this.reporterDetailsFrom.typeReport,
      requestor_id: this.reporterDetailsFrom.requestorId,
      summary: this.reporterDetailsFrom.summaryReport,
      unit_id: 0,
      block_id: 0,
      project_id: this.userData.project_id,
      ir_attachments: this.reporterDetailsFrom.ticketAttachment
    }
    console.log(params)
    this.clientMainService.getApi(params, '/resident/post/report_issue').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMain.presentToast('Successfully report new issue!')
          this.loadTicketFromBackend()
          this.toggleShowReport()
          this.resetForm()
        } else {
          this.functionMain.presentToast('An error occurred while trying to submit new ticket!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Failed to create new issue!', 'danger');
        console.error(error);
      }
    });
  }

  resetForm() {
    this.reporterDetailsFrom.summaryReport = ''
    this.reporterDetailsFrom.ticketAttachment = ''
    this.fileName = ''
    this.reporterDetailsFrom.typeReport = 0
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

  @ViewChild('clientIssueNewAttachment') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }
  fileName = ''

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file)
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.selectedFile = file;
        this.fileName = file.name
        console.log(file.name)
  
        // Konversi file ke base64
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Hapus prefix data URL jika ada
          const base64 = e.target.result.split(',')[1] || e.target.result;
          this.reporterDetailsFrom.ticketAttachment = base64;
        };
        reader.readAsDataURL(file);
        
      } else {
        this.fileName = ''
        this.functionMain.presentToast("Can only receive png, jpg, and jpg files!", 'danger')
      }
      
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      this.functionMain.presentToast(`File ${this.selectedFile.name} ready to upload`, 'success');
    } else {
      this.functionMain.presentToast('Choose your file first', 'danger');
    }
  }

  onUploadImage(file: any): void {
    if (file){
      this.reporterDetailsFrom.ticketAttachment = file.map((data: any) => {return {ir_attachment_name: data.name, ir_attachment_datas: data.image, ir_attachment_mimetype: data.type }});
      console.log(this.reporterDetailsFrom)
    }
  }

}
