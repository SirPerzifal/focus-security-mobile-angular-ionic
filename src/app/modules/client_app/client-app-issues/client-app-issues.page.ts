import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { ReportIssueService } from 'src/app/service/resident/report-issue/report-issue.service';

@Component({
  selector: 'app-client-app-issues',
  templateUrl: './client-app-issues.page.html',
  styleUrls: ['./client-app-issues.page.scss'],
})
export class ClientAppIssuesPage implements OnInit {

  reporterDetailsFrom: any = {
    requestorId: 1,
    block_d: '',
    unit_id: '',
    host: '',
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

  constructor(private reportIssueService: ReportIssueService, private toastController: ToastController, private router: Router, private getUserInfoService: GetUserInfoService, private authService: AuthService, private clientMainService: ClientMainService, public functionMain: FunctionMainService, private route: ActivatedRoute, private blockUnitService: BlockUnitService) { }

  ngOnInit() {
    console.log("tes");
    this.loadUserInfo()
  }

  userData = {
    name: '',
    name_condo: '',
    email: '',
    project_id: 1,
    contact: '',
    family_id: 0,
    user_id: 0,
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
        family_id: value.family_id,
        user_id: value.user_id
      }
      this.project_config = value.config
      this.loadType();
      this.loadTicketFromBackend();
      console.log(this.userData);
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
  }
  project_config: any = {}

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
    this.resetForm()
    // setTimeout(() => {
    //   this.isNewReport = true
    // }, 300)
  }

  toggleShowReport(){
    this.isNewReport = false
    this.isMain = true
    this.textSecond = 'Record of Report'
    this.resetFilter()
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
    if (!this.project_config.is_industrial && (!this.reporterDetailsFrom.block_id || !this.reporterDetailsFrom.unit_id)) {
      errMsg += 'Block and unit are required! \n'
    }
    if (this.project_config.is_industrial && (!this.reporterDetailsFrom.host)) {
      errMsg += 'Host is required! \n'
    }
    if (!this.reporterDetailsFrom.typeReport) {
      errMsg += 'Type of issue is required! \n'
    }
    if (!this.reporterDetailsFrom.summaryReport) {
      errMsg += 'Summary is required! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    let params = {
      ticket_type_id: this.reporterDetailsFrom.typeReport,
      requestor_id: this.reporterDetailsFrom.requestorId,
      summary: this.reporterDetailsFrom.summaryReport,
      unit_id: this.reporterDetailsFrom.unit_id,
      block_id: this.reporterDetailsFrom.block_id,
      host: this.reporterDetailsFrom.host,
      project_id: this.userData.project_id,
      ir_attachments: this.reporterDetailsFrom.ticketAttachment,
      family_id: this.userData.family_id,
      user_id: this.userData.user_id,
    }
    console.log(params)
    this.clientMainService.getApi(params, '/client/post/create_ticket').subscribe({
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
    this.reporterDetailsFrom.block_id = ''
    this.reporterDetailsFrom.unit_id = ''
    this.reporterDetailsFrom.host = ''
    this.Unit = []
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

  isReportApp: string = '1';
  allData: any = [];
  isLoading = false

  async loadTicketFromBackend() {
    this.isLoading = true
    let params = {}
    this.allData = []
    params = {
      is_report_app: true, 
      page: this.currentPage, 
      limit: this.functionMain.limitHistory, 
      issue_date: this.startDateFilter, 
      end_issue_date: this.endDateFilter
    }
    this.clientMainService.getApi(params, '/client/get/open_ticket_by_type_of_issue').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.allData = results.result.result;
          this.pagination = results.result.pagination
        } else {
          this.pagination = {}
          this.functionMain.presentToast(`An error occurred while trying to get report issue!`, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.pagination = {}
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while trying to get report issue!', 'danger');
        console.error(error);
      }
    });
  }

  seeDetail(ticket: any) {
    // console.log(ticket);
    this.router.navigate(['/client-ticket-detail'], {
      state: {
        ticket: ticket,
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

  handleRefresh(event: any) {
    this.loadTicketFromBackend().then(() => event.target.complete())
  }

  choosenBlock = ''
  Host: any = []
  Block: any = []
  Unit: any = []

  onBlockChange(event: any) {
    this.reporterDetailsFrom.block_id = event.target.value;
    this.choosenBlock = event.target.value
    this.Unit = []
    this.loadUnit()
    console.log(this.reporterDetailsFrom.block_id)
  }

  onUnitChange(event: any) {
    this.reporterDetailsFrom.unit_id = event[0];
    console.log(this.reporterDetailsFrom.unit_id)
  }

  onHostChange(event: any) {
    this.reporterDetailsFrom.host = event[0]
  }

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  async loadUnit() {
    this.reporterDetailsFrom.unit_id = ''
    this.blockUnitService.getUnit(this.choosenBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => {return {id: item.id, name: item.unit_name}});
          console.log(response)
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        console.error('Error:', error.result);
      }
    });
  }

  loadHost() {
    this.clientMainService.getApi({}, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onStartDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.startDateFilter = input.value;
    this.applyDateFilter();
  }

  onEndDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.endDateFilter = input.value;
    this.applyDateFilter();
  }

  startDateFilter = ''
  endDateFilter = ''

  applyDateFilter() {
    // this.showTicketList = this.closedTicket.filter((ticket: any) => {
    //   const ticketDate = new Date(ticket.issued_on.split(' ')[0]);

    //   const startDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
    //   const endDate = this.endDateFilter ? new Date(this.endDateFilter) : null;

    //   const isAfterStartDate = !startDate || ticketDate >= startDate;
    //   const isBeforeEndDate = !endDate || ticketDate <= endDate;
    //   return isAfterStartDate && isBeforeEndDate;
    // });
    this.currentPage = 1
    this.inputPage = 1
    this.loadTicketFromBackend()
  }

  resetFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyDateFilter()
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  pageForward(page: number) {
    this.currentPage = page
    this.inputPage = page
    this.loadTicketFromBackend()
  }

}
