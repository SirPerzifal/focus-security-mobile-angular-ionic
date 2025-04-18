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
    { src: 'assets/icon/exc-client/report.png', alt: 'Clocking Reports', route: '', params: {}, text: 'Clocking Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Security Attendance', route: '', params: {}, text: 'Security Attendance', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Cleaners Attendance', route: '', params: {}, text: 'Cleaners Attendance', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Landscape Attendance', route: '', params: {}, text: 'Landscape Attendance', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Contractor Records', route: '', params: {}, text: 'Contractor Records', permission: [true, true]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Visitor Records', route: '/vms/get/visitor_log', params: {is_today: true, log_type: 'visitor', project_id: this.project_id}, text: 'Visitor Records', permission: [true, true]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Vehicle Records', route: '/vms/get/visitor_log', params: {is_today: true, log_type: 'vehicle', project_id: this.project_id}, text: 'Vehicle Records', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Facility Booking Report', route: '', params: {}, text: 'Facility Booking Report', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Ticket Reports', route: '', params: {}, text: 'Ticket Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'OBA Reports', route: '', params: {}, text: 'OBA Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Polling Reports', route: '', params: {}, text: 'Polling Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Incident Reports', route: '', params: {}, text: 'Incident Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Security Occurrence', route: '', params: {}, text: 'Security Occurrence', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Book Reports', route: '', params: {}, text: 'Book Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Key Movement Reports', route: '', params: {}, text: 'Key Movement Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Shift HOTO Reports', route: '', params: {}, text: 'Shift HOTO Reports', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Renovation Work/Fines/Access card', route: '', params: {}, text: 'Renovation Work/Fines/Access card', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Overnight parking', route: '', params: {}, text: 'Overnight parking', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Bicycle Tags/Pet Registration', route: '', params: {}, text: 'Bicycle Tags/Pet Registration', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Move In/Out', route: '', params: {}, text: 'Move In/Out', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Coach Registration', route: '', params: {}, text: 'Coach Registration', permission: [true, false]},
    { src: 'assets/icon/exc-client/report.png', alt: 'Parking Appeal Reports', route: '', params: {}, text: 'Parking Appeal Reports', permission: [true, false]},
  ];
  
  reportsData: any = []
  showReports: any = []

  onClickMenu(menu: any) {
    // this.viewDetail(menu)
    // this.isHome = false
    // setTimeout(() => {
    //   this.isData = true
    //   this.textSecond = menu.text
    // }, 300)
    // if (menu.route == "") {
    //   this.reportsData = []
    //   this.showReports = this.reportsData
    // } else {
    //   console.log(menu.route)
    //   this.clientMainService.getApi(menu.params, '/vms/get/visitor_log').subscribe({
    //     next: (results) => {
    //       console.log(results)
    //       if (results.result.response_code === 200) {
    //         this.reportsData = results.result.response_result
    //       } else {
    //         this.reportsData = []
    //       }
    //       this.showReports = this.reportsData
    //     },
    //     error: (error) => {
    //       this.functionMain.presentToast('An error occurred while loading reports!', 'danger');
    //       console.error(error);
    //     }
    //   });
    // }
  }

  onBack() {
    if (this.isHome) {
      this.router.navigate(['/client-main-app'])
    } else {
      this.isData = false
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

  viewDetail(report: any) {
    // this.clientMainService.getApi({}, '/client/get/report').subscribe({
    //   next: (results) => {
    //     console.log(results)
    //     if (results.result.response_code === 200) {
    //       this.functionMain.downloadDocument(results.result.results, 'File Name')
    //       this.functionMain.presentToast(`Successfully get the report!`, 'success');
    //     } else {
    //       this.functionMain.presentToast(`An error occurred while trying to get the report!`, 'danger');
    //     }
    //   },
    //   error: (error) => {
    //     this.functionMain.presentToast('An error occurred while trying to get the report!', 'danger');
    //     console.error(error);
    //   }
    // });
    // this.router.navigate(['/client-Reports-details'], {
    //   state: {
    //     report: report
    //   }
    // })
  }

}
