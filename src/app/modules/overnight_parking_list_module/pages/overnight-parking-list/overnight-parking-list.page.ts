import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { forkJoin, interval, Subject, Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-overnight-parking-list',
  templateUrl: './overnight-parking-list.page.html',
  styleUrls: ['./overnight-parking-list.page.scss'],
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
export class OvernightParkingListPage implements OnInit {

  isLoading: boolean = false;

  // Subject untuk mengelola subscription
  private refreshInterval: any;
  dateNow = new Date()
  todayDate = this.convertToDDMMYYYY(this.dateNow.toISOString().split('T')[0])
  todayTime = this.todayDate
  showTomorrowdate = ''

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }

  constructor(
    private router: Router,
    private toastController: ToastController,
    private blockUnitService: BlockUnitService,
    private clientMainService: ClientMainService,
    private functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    this.showTomorrowdate = this.convertToDDMMYYYY(tomorrowDate.toISOString().split('T')[0]);

    this.loadProjectName().then(() => {
      this.loadOvernight('today')
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  project_id = 0
  project_config: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  overnightSchedules: any[] = [];
  daySchedules: any[] = [];
  upcomingSchedules: any[] = [];
  historySchedules: any[] = []
  filteredHistorySchedules: any[] = []

  async loadOvernight(type: string = 'today') {
    this.isLoading = true
    let url = ''
    let params = {}
    if (type === 'today') { 
      this.daySchedules = []
      url = '/vms/get/overnight_parking_list'
      params = {project_id: this.project_id}
    } else if (type === 'upcoming') {
      this.upcomingSchedules = []
      url = '/vms/get/overnight_parking_list_upcoming'
      params = {project_id: this.project_id}
    } else {
      this.historySchedules = []
      this.filteredHistorySchedules = this.historySchedules
      this.sortVehicle = []
      url = '/vms/get/overnight_parking_list_history'
      params = {
        limit: this.functionMain.limitHistory, 
        page: this.currentPage, 
        project_id: this.project_id,
        block: this.choosenBlock,
        vehicle_number: this.vehicleNumberFilter,
        unit: this.choosenUnit,
        host: this.selectedHost,
        issue_date: this.startDateFilter,
        end_issue_date: this.endDateFilter
      }
    }
    this.clientMainService.getApi(params, url ).subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          console.log(results.result.response_result)
          if (type === 'today') { 
            this.daySchedules = results.result.response_result
          } else if (type === 'upcoming') {
            this.upcomingSchedules = results.result.response_result
          } else {
            this.historySchedules = results.result.response_result
            this.filteredHistorySchedules = this.historySchedules
            this.pagination = results.result.pagination
            this.total_pages = this.pagination.total_pages
            if (this.selectedRadio == 'sort_date' || this.selectedRadio == 'sort_vehicle') {
              this.applyRadio()
            }
          }   
        } else {
          this.resetPagination()
        }
        if (type === 'today') { 
          this.todayTime = this.functionMain.convertDateExtend(results.result.start_time)
          this.showTomorrowdate = this.functionMain.convertDateExtend(results.result.end_time)
        }
        this.isLoading = false;
        
      },
      error: (error) => {
        this.presentToast('An error occurred while loading overnight parking data!', 'danger');
        this.resetPagination()
        console.error(error);
        this.isLoading = false;
      }
    });
    console.log(this.overnightSchedules)
  }

  showDay = true;
  showHistory = false;
  showDayTrans = false;
  showHistoryTrans = false;
  showUpcoming = false;
  showUpcomingTrans = false;
  choosenBlock = ''
  choosenUnit = ''
  contactUnit = ''
  vehicleNumberFilter = ''

  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showDayTrans && !this.showUpcomingTrans) {
      if (type == 'day') {
        this.showHistory = false;
        this.showHistoryTrans = false;
        this.showUpcoming = false;
        this.showUpcomingTrans = false;
        this.clearFilters()
        this.showDayTrans = true
        this.selectedRadio = ''
        this.isRadioClicked = false
        if (this.daySchedules.length == 0) {
          this.loadOvernight('today')
        }
        setTimeout(() => {
          this.showDay = true;
          this.showDayTrans = false
        }, 300)
      }
      if (type == 'upcoming') {
        this.showDay = false;
        this.showDayTrans = false;
        this.showHistory = false;
        this.showHistoryTrans = false;
        this.clearFilters()
        this.vehicleNumberFilter = ''
        this.showUpcomingTrans = true
        this.selectedRadio = ''
        this.isRadioClicked = false
        if (this.upcomingSchedules.length == 0) {
          this.loadOvernight('upcoming')
        }
        setTimeout(() => {
          this.showUpcoming = true;
          this.showUpcomingTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.showDay = false;
        this.showDayTrans = false;
        this.showUpcoming = false;
        this.showUpcomingTrans = false;
        this.applyFilters()
        this.showHistoryTrans = true
        if (this.historySchedules.length == 0) {
          this.loadOvernight('history')
        }
        setTimeout(() => {
          this.showHistory = true;
          this.showHistoryTrans = false
        }, 300)
      }
    }
  }

  startDateFilter = ''
  endDateFilter = ''

  clearFilters() {
    this.searchOption = ''
    this.resetFilter()
    // this.applyFilters() 
  }

  applyFilters() {
    this.loadOvernight('history')
  }

  Block: any[] = [];
  Unit: any[] = [];

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  async loadUnit() {
    this.blockUnitService.getUnit(this.choosenBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}))
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  onBlockChange(event: any) {
    this.choosenBlock = event.target.value;
    this.applyFilters()
    this.loadUnit()
  }

  onUnitChange(event: any) {
    this.choosenUnit = event[0];
    this.applyFilters()
  }
  onChangeDate(event: any) {
    console.log(event.target.value)
    this.startDateFilter = event.target.value
    this.applyFilters()
  }

  form(vehicle: any) {
    // Navigasi ke halaman form dengan parameter
    this.router.navigate(['overnight-parking-detail'], {
      state: {
        vehicle: vehicle,
      }
    });
  }


  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });

    toast.present().then(() => {
    });
  }

  onDateStartChange(event: any) {
    console.log(event.target.value)
    this.startDateFilter = event.target.value
    this.applyFilters()
  }

  onDateEndChange(event: any) {
    console.log(event.target.value)
    this.endDateFilter = event.target.value
    this.applyFilters()
  }

  searchOption = ''

  onSearchOptionChange(event: any) {
    this.searchOption = event.target.value
    this.startDateFilter = ''
    this.endDateFilter = ''
    this.choosenBlock = ''
    this.vehicleNumberFilter = ''
    this.contactUnit = ''
    this.choosenUnit = ''
    this.applyFilters()
    console.log(event.target.value)
  }

  sortVehicle: any[] = []
  selectedRadio: string | null = null
  isRadioClicked = false

  onRadioClick(value: string): void {
    let currentValue = this.selectedRadio
    if (this.selectedRadio === value) {
      this.selectedRadio = null;
    } else {
      this.selectedRadio = value;
      this.searchOption = ''
    }
    console.log(this.selectedRadio)
    if (currentValue == 'search' && (this.selectedRadio == 'sort_date' || this.selectedRadio == 'sort_vehicle')) {
      this.resetFilter()
      this.loadOvernight('history')
    } else {
      this.applyRadio()
    }
    console.log(this.selectedRadio)
  }

  resetFilter() {
    this.choosenBlock = ''
    this.vehicleNumberFilter = ''
    this.choosenUnit = ''
    this.contactUnit = ''
    this.selectedHost = ''
    this.contactHost = ''
    this.startDateFilter = ''
    this.endDateFilter = ''
  }

  resetPagination() {
    this.pagination = {}
    this.total_pages = 0
    this.currentPage = 1
    this.inputPage = 1
  }


  applyRadio() {
    this.sortVehicle = this.historySchedules
    if (this.selectedRadio == 'sort_date') {
      this.isRadioClicked = true
      this.sortVehicle = Array.from(
        new Set(this.sortVehicle.map((record) => record.request_date ? this.functionMain.convertNewDateTZ(record.request_date).split(' ')[0] : '-' ))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        schedule_date: date,
        data: this.sortVehicle.filter(item => item.request_date ? this.functionMain.convertNewDateTZ(item.request_date).split(' ')[0] == date : item.request_date == date ) ,            
      })).sort((a, b) => b.date.getTime() - a.date.getTime());;
      console.log(this.sortVehicle)
    } else if (this.selectedRadio == 'sort_vehicle') {
      this.isRadioClicked = true
      this.sortVehicle = Array.from(
        new Set(this.sortVehicle.map((record) => record.vehicle_numbers != "" ? record.vehicle_numbers : false))
      ).map((vehicle_numbers) => ({
        vehicle_number: vehicle_numbers ? vehicle_numbers : 'Walk In',
        date: new Date(),
        schedule_date: '',
        data: this.sortVehicle.filter(item => item.vehicle_numbers == vehicle_numbers),            
      }));;
      console.log(this.sortVehicle)
    } else {
      this.isRadioClicked = false
      this.searchOption = ''
    }
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  loadHost() {
    this.contactHost = ''
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
      if (this.selectedHost) {
        this.contactHost = this.selectedHost
      }
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
  }

  handleRefresh(event: any) {
    if (this.project_config.is_industrial) {
      this.loadHost()
    } else {
      this.loadBlock()
    }
    let type = this.showHistory ? 'history' : (this.showUpcoming ? 'upcoming' : 'today')
    this.loadOvernight(type)
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  changePage(page: number) {
    let tempPage = page
    console.log(tempPage, this.total_pages)
    if (tempPage > 0 && tempPage <= this.total_pages) {
      this.currentPage = tempPage
      this.loadOvernight('history')
    } else {
    }
    this.inputPage = this.currentPage
  }

  onVehicleFilterChange(event: any) {
    this.vehicleNumberFilter = event.target.value
    this.applyFilters()
  }

}
