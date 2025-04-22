import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { StorageService } from 'src/app/service/storage/storage.service';

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
    summaryReport: '',
    ticketAttachment: '',
  };
  extend_mb = false
  typeOfReport: any = []

  isReportApp: string = '1';
  allData: any = [];

  constructor(
    private router: Router,
    private mainApi: MainApiResidentService,
    private functionMain: FunctionMainService,
    private storage: StorageService
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
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      this.storage.decodeData(value).then((value: any) => {
        if ( value ) {
          const estate = JSON.parse(value);
          console.log(estate)
          this.reporterDetailsFrom = {
            requestorId: estate.family_id,
            blokId: estate.block_id,
            unitId: estate.unit_id,
            name: estate.family_name,
            contactNumber: estate.family_mobile_number,
            email: estate.family_email,
            blockAndUnit: estate.block_name + ', ' + estate.unit_name,
            placeOfResidence: '123 Main St, City',
            typeReport: 0,
            summaryReport: '',
            ticketAttachment: '',
          };
          this.record_type = estate.record_type
        }
      })
    })
  }

  record_type = 'residential'

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
      ir_attachment_datas: this.reporterDetailsFrom.ticketAttachment,
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


}
