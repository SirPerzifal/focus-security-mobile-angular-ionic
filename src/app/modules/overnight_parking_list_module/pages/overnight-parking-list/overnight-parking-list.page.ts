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
    if (type === 'today') { 
      this.daySchedules = []
      url = '/vms/get/overnight_parking_list'
    } else if (type === 'upcoming') {
      this.upcomingSchedules = []
      url = '/vms/get/overnight_parking_list_upcoming'
    } else {
      this.historySchedules = []
      this.filteredHistorySchedules = this.historySchedules
      url = '/vms/get/overnight_parking_list_history'
    }
    this.clientMainService.getApi({project_id: this.project_id}, url ).subscribe({
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
            this.applyFilters()
          }   
        } else {
          
        }
        if (type === 'today') { 
          this.todayTime = this.functionMain.convertDateExtend(results.result.start_time)
          this.showTomorrowdate = this.functionMain.convertDateExtend(results.result.end_time)
        }
        this.isLoading = false;
        
      },
      error: (error) => {
        this.presentToast('An error occurred while loading overnight parking data!', 'danger');
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

  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showDayTrans && !this.showUpcomingTrans) {
      if (type == 'day') {
        this.showHistory = false;
        this.showHistoryTrans = false;
        this.showUpcoming = false;
        this.showUpcomingTrans = false;
        this.searchOption = ''
        this.contactHost = ''
        this.startDateFilter = ''
        this.endDateFilter = ''
        this.choosenBlock = ''
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
        this.searchOption = ''
        this.contactHost = ''
        this.startDateFilter = ''
        this.endDateFilter = ''
        this.choosenBlock = ''
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
    this.startDateFilter = ''
    this.endDateFilter = ''
    this.choosenBlock = ''
    this.contactHost = ''
    this.applyFilters() 
  }

  applyFilters() {
    this.filteredHistorySchedules = this.historySchedules.filter(item => {
      const visitorDate = new Date(item.approved_date.split(' ')[0]);
      visitorDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for date comparison

      // Convert the selected start and end dates to Date objects
      const selectedStartDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
      const selectedEndDate = this.endDateFilter ? new Date(this.endDateFilter) : null;

      // Set time to 00:00:00 for comparison
      if (selectedStartDate) {
        selectedStartDate.setHours(0, 0, 0, 0);
      }
      if (selectedEndDate) {
        selectedEndDate.setHours(0, 0, 0, 0);
      }

      const dateMatches = (!selectedStartDate || visitorDate >= selectedStartDate) && (!selectedEndDate || visitorDate <= selectedEndDate);
      const typeMatches = this.choosenBlock ? item.block_id == this.choosenBlock : true;
      const hostMatches = this.selectedHost ? item.industrial_host_id == this.selectedHost : true;

      return typeMatches && dateMatches && hostMatches;
    });
    console.log(this.filteredHistorySchedules)
  }

  Block: any[] = [];

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

  onBlockChange(event: any) {
    console.log(event.target.value)
    this.choosenBlock = event.target.value;
    console.log(this.choosenBlock)
    console.log(new Date('2024-12-24'))
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
    this.applyFilters()
    console.log(event.target.value)
  }

  sortVehicle: any[] = []
  selectedRadio: string | null = null
  isRadioClicked = false

  onRadioClick(value: string): void {
    if (this.selectedRadio === value) {
      this.selectedRadio = null;
    } else {
      this.selectedRadio = value;
      this.searchOption = ''
      this.selectedHost = ''
      this.choosenBlock = ''
      this.startDateFilter = ''
      this.endDateFilter = ''
    }
    console.log(this.selectedRadio)
    this.sortVehicle = this.historySchedules
    if (this.selectedRadio == 'sort_date') {
      this.isRadioClicked = true
      this.sortVehicle = Array.from(
        new Set(this.sortVehicle.map((record) => record.approved_date ? new Date(record.approved_date.split(' ')[0]).toISOString() : '-' ))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        schedule_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.sortVehicle.filter(item => item.approved_date ? new Date(item.approved_date).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0) : item.approved_date == date ) ,            
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
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
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

}
