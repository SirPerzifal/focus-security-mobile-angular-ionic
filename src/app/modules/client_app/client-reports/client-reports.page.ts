import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-client-reports',
  templateUrl: './client-reports.page.html',
  styleUrls: ['./client-reports.page.scss'],
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
export class ClientReportsPage implements OnInit {

  constructor(private router: Router, private clientMainService: ClientMainService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    this.loadProject().then(() => {
      if (this.project_config.is_industrial) {
        this.menuItems = this.menuItems.filter((item: any) => item.permission[1] )
      } else {
        this.menuItems = this.menuItems.filter((item: any) => item.permission[0] )
      }
    })
  }

  async loadProject() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  project_id = 0
  project_config: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isHome = true
  isData = false
  textSecond = ''

  menuItems = [
    { src: 'assets/icon/exc-client/report.png', alt: 'Clocking Reports', model: '', params: {}, text: 'Clocking Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Security Attendance', model: '', params: {}, text: 'Security Attendance', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Cleaners Attendance', model: '', params: {}, text: 'Cleaners Attendance', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Landscape Attendance', model: '', params: {}, text: 'Landscape Attendance', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Contractor Records', model: 'fs.residential.contractor', params: {}, text: 'Contractor Records', permission: [true, true]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Visitor Records', model: 'fs.residential.visitors', params: {is_today: true, log_type: 'visitor', project_id: this.project_id}, text: 'Visitor Records', permission: [true, true]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Vehicle Records', model: 'fs.residential.vehicle', params: {is_today: true, log_type: 'vehicle', project_id: this.project_id}, text: 'Vehicle Records', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Facility Booking Report', model: 'room.booking', params: {}, text: 'Facility Booking Report', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Ticket Reports', model: 'helpdesk.ticket', params: {}, text: 'Ticket Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'OBA Reports', model: '', params: {}, text: 'OBA Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Polling Reports', model: 'fs.residential.polling', params: {}, text: 'Polling Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Incident Reports', model: '', params: {}, text: 'Incident Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Security Occurrence', model: '', params: {}, text: 'Security Occurrence', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Book Reports', model: '', params: {}, text: 'Book Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Key Movement Reports', model: '', params: {}, text: 'Key Movement Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Shift HOTO Reports', model: '', params: {}, text: 'Shift HOTO Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Renovation Work/Fines/Access card', model: '', params: {}, text: 'Renovation Work/Fines/Access card', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Overnight parking', model: 'fs.vms.overnight.parking.list', params: {}, text: 'Overnight parking', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Bicycle Tags', model: 'fs.residential.bicycle.tag', params: {}, text: 'Bicycle Tags/Pet Registration', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Pet Registration', model: 'fs.residential.pet', params: {}, text: 'Bicycle Tags/Pet Registration', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Move In/Out', model: 'fs.residential.schedule', params: {}, text: 'Move In/Out', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Coach Registration', model: 'fs.residential.registered.coaches', params: {}, text: 'Coach Registration', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Parking Appeal Reports', model: 'fs.vms.offence', params: {}, text: 'Parking Appeal Reports', permission: [true, false]},
  ];
  
  reportsData: any = []
  showReports: any = []

  onBack() {
    if (this.isHome) {
      this.router.navigate(['/client-main-app'])
    } else {
      this.checkedFields = []
      this.reportFields = []
      this.isData = false
      this.is_check_all = false
      setTimeout(() => {
        this.textSecond = ''
        this.isHome = true
      }, 300)
    }
  }

  onDateChange(event: any) {
    console.log(event.target.value)
    this.filter.issue_date = event.target.value;
    this.applyFilters()
  }

  onVehicleFilterChange(event: any) {
    this.filter.vehicle_number = event.target.value
    this.applyFilters()
  }

  onNameFilterChange(event: any) {
    this.filter.name = event.target.value
    this.applyFilters()
  }

  onContactFilterChange(event: any) {
    this.filter.contact = event.target.value
    console.log(this.filter.contact)
    this.applyFilters()
  }

  Block: any[] = []
  Unit: any[] = []

  filter = {
    name: '',
    vehicle_number: '',
    issue_date: '',
    contact: '',
  }

  searchOption = ''

  onSearchOptionChange(event: any) {
    this.searchOption = event.target.value
    console.log(event.target.value)
  }

  startDateFilter = ''

  clearFilters() {
    this.searchOption = ''
    this.filter.name = ''
    this.filter.vehicle_number = ''
    this.filter.contact = ''
    this.applyFilters() 
  }


  applyFilters() {
    this.showReports = this.reportsData.filter((item: any) => {
      const contactMatches = this.filter.contact ? item.contact_no.includes(this.filter.contact) : true;

      return contactMatches;
    });
  }

  reportFields: any = []
  isLoading = false

  checkedFields: any = []

  onClickMenu(report: any) {
    this.is_check_all = false
    this.reportFields = []
    this.checkedFields = []
    this.isHome = false
    setTimeout(() => {
      this.textSecond = 'Fields Selection'
      this.isData = true
    }, 300)
    if (report.model) {
      this.isLoading = true
      this.clientMainService.getApi({model_name: report.model}, '/get/model/fields').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.reportFields = results.result.result
          } else {
            this.functionMain.presentToast(`An error occurred while trying to get the fields!`, 'danger');
          }
          this.isLoading = false
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while trying to get the fields!', 'danger');
          console.error(error);
          this.isLoading = false
        }
      });
    }
  }

  checkInput(field: string) {
    let index = this.checkedFields.find((item: any) => item == field)
    if (index) {
      this.checkedFields = this.checkedFields.filter((item: any) => item != field)
    } else {
      this.checkedFields.push(field)
    }
    console.log(this.checkedFields)
  }
  
  is_check_all = false
  checkAll() {
    this.is_check_all = !this.is_check_all
    if (this.is_check_all) {
      this.checkedFields = this.reportFields.map((item: any) => item.field)
    } else {
      this.checkedFields = []
    }
  }

  returnCheckTrue(field: string) {
    let index = this.checkedFields.find((item: any) => item == field)
    if (index) {
      return true
    } else {
      return false
    }
  }

  onSubmit() {
    console.log(this.checkedFields)
  }
}
