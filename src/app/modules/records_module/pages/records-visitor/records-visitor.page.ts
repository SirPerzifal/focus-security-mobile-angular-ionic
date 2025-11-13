import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-records-visitor',
  templateUrl: './records-visitor.page.html',
  styleUrls: ['./records-visitor.page.scss'],
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
  ],
})
export class RecordsVisitorPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService, 
    private toastController: ToastController, 
    private router: Router, 
    private modalController: ModalController,
    private route: ActivatedRoute,
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
  ) { }

  todayDate = this.convertToDDMMYYYY(new Date().toISOString().split('T')[0])
  isLoading = false
  async loadLogs(type: string, today: boolean = true) {
    this.isLoading = true
    this.logsData = [];
    this.historyVehicles = []
    this.activeVehicles = []
    this.sortVehicle = []
    this.pagination = {}
    let params = today ? {is_today: today,  log_type: type, project_id: this.project_id} : {...this.filter, is_today: today,  log_type: type, project_id: this.project_id, host: this.selectedHost, limit: this.functionMain.limitHistory, page: this.currentPage, not_checkout: ((this.searchOption == 'not_checkout' || this.searchOption == 'all') && this.project_config.is_industrial)} 
    console.log(params)
    this.clientMainService.getApi(params, '/vms/get/visitor_log').subscribe({
      next: (results) => {
        this.isLoading = false;
        console.log(results.result)
        if (results.result.response_code === 200) {
          if (today){
            this.logsData = results.result.response_result
            this.activeVehicles = results.result.response_result;
            this.onTodayRadioClick(this.selectedTodayRadio)
          } else {
            this.logsData = results.result.response_result;
            this.historyVehicles = this.logsData
            this.pagination = results.result.pagination
            this.total_pages = this.pagination.total_pages
            if (this.selectedRadio == 'sort_date' || this.selectedRadio == 'sort_vehicle') {
              this.applyRadio()
            }
          }
          
        } else {
          this.pagination = {}
          this.total_pages = 0
          this.currentPage = 1
          this.inputPage = 1
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
        this.pagination = {}
        this.total_pages = 0
        this.currentPage = 1
        this.inputPage = 1
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
      console.log(this.pageType)
    })
    this.loadProjectId().then(() => {
      this.loadLogs(this.pageType, true)
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  project_id = 0
  project_config: any = []

  async loadProjectId() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  params: any
  pageType = 'visitor'
  showActive = true;
  showHistory = false;
  showActiveTrans = false;
  showHistoryTrans = false;

  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showActiveTrans) {
      if (type == 'active') {
        this.showHistory = false;
        this.showHistoryTrans = false;
        this.showActiveTrans = true
        this.contactHost = ''
        this.selectedHost = ''
        this.clearFilters()
        this.loadLogs(this.pageType, true)
        setTimeout(() => {
          this.showActive = true;
          this.showActiveTrans = false
        }, 300)
      }
      if (type == 'history') {
        if(!this.showHistory) {
          this.clearFilters()
        }
        this.showActive = false;
        this.showActiveTrans = false;
        this.isRadioClicked = false
        this.selectedRadio = ''
        this.showHistoryTrans = true
        this.loadLogs(this.pageType, false)
        setTimeout(() => {
          this.showHistory = true;
          this.showHistoryTrans = false
        }, 300)
      }
    }
  }

  logsData: any[] = [];
  pagination: any = {}
  activeVehicles: any[] = [];
  historyVehicles: any[] = [];
  sortVehicle: any[] = []
  selectedRadio: string | null = null
  searchOption: string = ''

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }

  onBlockChange(event: any) {
    this.filter.block = event.target.value;
    this.filter.unit = ''
    if (this.filter.block){
      this.loadUnit(); // Panggil method load unit
      this.applyFilters()
    }
  }

  onUnitChange(event: any) {
    this.filter.unit = event[0];
    if (this.filter.unit) {
      this.applyFilters()
    }
  }

  onDateChange(event: any) {
    console.log(event.target.value)
    this.filter.issue_date = event.target.value;
    this.applyFilters()
  }

  onEndDateChange(event: any) {
    console.log(event.target.value)
    this.filter.end_issue_date = event.target.value;
    this.applyFilters()
  }

  onVehicleFilterChange(event: any) {
    this.filter.vehicle_number = event.target.value
    this.applyFilters()
  }

  Block: any[] = []
  Unit: any[] = []

  filter = {
    block: '',
    unit: '',
    vehicle_number: '',
    issue_date: '',
    end_issue_date: ''
  }
  vehicleNumberFilter = ''

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
        }
      },
      error: (error) => {
        this.presentToast('Error loading block data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async loadUnit() {
    this.filter.unit
    this.blockUnitService.getUnit(this.filter.block).subscribe({
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

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  onSearchOptionChange(event: any) {
    this.searchOption = event.target.value
    this.filter.issue_date = ''
    this.filter.end_issue_date = ''
    this.filter.block = ''
    this.filter.vehicle_number = ''
    this.vehicleNumberFilter = ''
    this.filter.unit = ''
    this.contactHost = ''
    this.selectedHost = ''
    this.total_pages = 0
    this.currentPage = 1
    this.inputPage = 1
    this.applyFilters()
    console.log(event.target.value)
  }

  startDateFilter = ''

  clearFilters() {
    this.Unit = []
    this.searchOption = ''
    this.filter.issue_date = ''
    this.filter.end_issue_date = ''
    this.filter.block = ''
    this.filter.vehicle_number = ''
    this.vehicleNumberFilter = ''
    this.filter.unit = ''
    this.contactHost = ''
    this.selectedHost = ''
  }

  applyFilters() {
    // this.historyVehicles = this.logsData.filter(item => {  
    //   const visitorDate = new Date(item.entry_datetime);
    //   visitorDate.setHours(0, 0, 0, 0); 

    //   const selectedStartDate = this.filter.issue_date ? new Date(this.filter.issue_date) : null;
    //   const selectedEndDate = this.filter.end_issue_date ? new Date(this.filter.end_issue_date) : null;

    //   if (selectedStartDate) {
    //     selectedStartDate.setHours(0, 0, 0, 0);
    //   }
    //   if (selectedEndDate) {
    //     selectedEndDate.setHours(0, 0, 0, 0);
    //   }
      
    //   const startDateMatches = selectedStartDate ? visitorDate >= selectedStartDate : true
    //   const endDateMatches = selectedEndDate ? visitorDate <= selectedEndDate : true

    //   const blockMatches = this.filter.block ? item.block_id == this.filter.block : true;
    //   const unitMatches =  this.filter.unit ? item.unit_id == this.filter.unit : true;
    //   const hostMatches =  this.selectedHost ? item.industrial_host_id == this.selectedHost : true;
    //   const vehicleMatches = this.filter.vehicle_number && this.pageType == 'vehicle' ? item.vehicle_number.toLowerCase().includes(this.filter.vehicle_number.toLowerCase()) : true;
      
    //   return hostMatches && blockMatches && startDateMatches && unitMatches && vehicleMatches && endDateMatches;
    // });
    this.loadLogs(this.pageType, false)
    console.log(this.historyVehicles)
  }

  onArrowClick(logs: any[]){
    this.router.navigate(['records-visitor-detail'], {
      state: {
        logs: logs,
      },
      queryParams: this.params
    });
  }

  onClickNew() {
    this.router.navigate(['records-wheel-clamped-new']);
  }
  
  isRadioClicked = false

  async onRadioClick(value: string) {
    let currentValue = this.selectedRadio
    console.log(this.selectedRadio)
    if (this.selectedRadio === value) {
      this.selectedRadio = null;
      this.clearFilters()
    } else {
      this.selectedRadio = value;
      this.searchOption = ''
      this.contactHost = ''
      this.selectedHost = ''
    }
    console.log(this.selectedRadio)
    if (currentValue == 'search' && (this.selectedRadio == 'sort_date' || this.selectedRadio == 'sort_vehicle')) {
      this.filter.issue_date = ''
      this.filter.end_issue_date = ''
      this.filter.block = ''
      this.filter.vehicle_number = ''
      this.vehicleNumberFilter = ''
      this.filter.unit = ''
      this.selectedHost = ''
      this.loadLogs(this.pageType, false)
    } else {
      this.applyRadio()
    }
  }

  applyRadio() {
    this.sortVehicle = this.historyVehicles
    if (this.selectedRadio == 'sort_date') {
      this.isRadioClicked = true
      this.sortVehicle = Array.from(
        new Set(this.sortVehicle.map((record) => record.entry_datetime ? new Date(record.entry_datetime.split(' ')[0]).toISOString() : '-' ))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        schedule_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.sortVehicle.filter(item => item.entry_datetime ? new Date(item.entry_datetime).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0) : item.entry_datetime == date ) ,            
      })).sort((a, b) => b.date.getTime() - a.date.getTime());;
      console.log(this.sortVehicle)
    } else if (this.selectedRadio == 'sort_vehicle') {
      this.isRadioClicked = true
      this.sortVehicle = Array.from(
        new Set(this.sortVehicle.map((record) => record.vehicle_number != "" ? record.vehicle_number : false))
      ).map((vehicle_number) => ({
        vehicle_number: vehicle_number ? vehicle_number : 'Walk In',
        date: new Date(),
        schedule_date: '',
        data: this.sortVehicle.filter(item => item.vehicle_number == vehicle_number),            
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
    if (this.selectedHost) {
      this.applyFilters()
    }
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0

  changePage(page: number) {
    let tempPage = page
    console.log(tempPage, this.total_pages)
    if (tempPage > 0 && tempPage <= this.total_pages) {
      this.currentPage = tempPage
      this.loadLogs(this.pageType, this.showActive)
    } else {
    }
    this.inputPage = this.currentPage
  }

  handleRefresh(event: any) {
    if (this.project_config.is_industrial) {
      this.loadHost()
    } else {
      this.loadBlock()
    }
    this.loadLogs(this.pageType, this.showActive)
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

  selectedTodayRadio = 'all'

  onTodayRadioClick(value: string): void {
    this.selectedTodayRadio = value
    if (value == 'checked_out') {
      this.activeVehicles = this.logsData.filter((item: any) => item.out_datetime)
      console.log(this.sortVehicle)
    } else if (value == 'not_checked_out') {
      this.activeVehicles = this.logsData.filter((item: any) => !item.out_datetime)
      console.log(this.sortVehicle)
    } else if (value == 'all') {
      this.activeVehicles = this.logsData
    }
  }

}
