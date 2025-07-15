import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { RecordsWheelClampedNewPage } from './records-wheel-clamped-new/records-wheel-clamped-new.page'; 
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-records-wheel-clamped',
  templateUrl: './records-wheel-clamped.page.html',
  styleUrls: ['./records-wheel-clamped.page.scss'],
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

export class RecordsWheelClampedPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService, 
    private toastController: ToastController, 
    private router: Router, 
    private offensesService: OffensesService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService
  ) { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: RecordsWheelClampedNewPage,
      cssClass: 'record-modal',
      componentProps: {
        type: this.pageType
      }
    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if(result.data){
          this.loadRecordsWheelClamp()
        }
      }
    });

    return await modal.present();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'].split('?')[0] == '/records-wheel-clamped'){
          this.route.queryParams.subscribe(params => {
            console.log('first call', this.pageType)
            this.pageType = params['type']
            this.params = params
            this.vehicleData = []
            this.loadRecordsWheelClamp();
          })
        }
      }
    });

    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
    })
    console.log(this.pageType)
    this.loadProjectId().then(() => {
      this.loadRecordsWheelClamp()
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
  }

  project_id = 0
  project_config: any = []

  async loadProjectId() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }


  params: any
  pageType = 'wheel_clamp'
  showActive = true;
  showHistory = false;
  showActiveTrans = false;
  showHistoryTrans = false;

  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showActiveTrans) {
      if (type == 'active') {
        this.is_active = true
        this.showHistory = false;
        this.showHistoryTrans = false;
        this.showActiveTrans = true
        this.clearFilters()
        if (this.activeVehicles.length == 0){
          this.loadRecordsWheelClamp()
        }
        setTimeout(() => {
          this.showActive = true;
          this.showActiveTrans = false
        }, 300)
      }
      if (type == 'history') {
        if(!this.showHistory) {
          this.selectedRadio = ''
          this.clearFilters()
        }
        this.showActive = false;
        this.showActiveTrans = false;
        this.is_active = false
        this.showHistoryTrans = true
        if (this.historyVehicles.length == 0){
          this.loadRecordsWheelClamp()
        }
        setTimeout(() => {
          this.showHistory = true;
          this.showHistoryTrans = false
        }, 300)
      }
    }
  }

  vehicleData: any[] = [];
  activeVehicles: any[] = [];
  historyVehicles: any[] = [];
  sortVehicle: any[] = []
  selectedRadio: string | null = null
  searchOption: string | null = null
  is_active: boolean = true

  onRadioClick(value: string): void {
    let currentValue = this.selectedRadio
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
      this.loadRecordsWheelClamp()
    } else {
      this.applyRadio()
    }
  }

  applyRadio() {
    console.log(this.selectedRadio)
    if (this.selectedRadio == 'sort_date') {
      this.sortVehicle = Array.from(
        new Set(this.historyVehicles.map((record) => new Date(record.issue_date).toISOString()))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        issue_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.historyVehicles.filter(item => new Date(item.issue_date).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0)),            
      })).sort((a, b) => b.date.getTime() - a.date.getTime());;
      console.log(this.sortVehicle)
    }
    if (this.selectedRadio == 'sort_vehicle') {
      this.sortVehicle = Array.from(
        new Set(this.historyVehicles.map((record) => record.vehicle_number))
      ).map((vehicle_number) => ({
        vehicle_number: vehicle_number,
        date: new Date(),
        issue_date: '',
        data: this.historyVehicles.filter(item => item.vehicle_number == vehicle_number),            
      }));;
      console.log(this.sortVehicle)
    }
  }

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }

  onBlockChange(event: any) {
    this.filter.block = event.target.value;
    this.filter.unit = ''
    this.loadUnit(); // Panggil method load unit
    this.applyFilters()
  }

  onUnitChange(event: any) {
    this.filter.unit = event[0]
    this.applyFilters()
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
    this.filter.unit = ''
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
    this.filter = {
      block: '',
      unit: '',
      issue_date: '',
      end_issue_date: '',
      vehicle_number: ''
    }
    this.contactHost = ''
    this.selectedHost = ''
    this.vehicleNumberFilter = ''
    console.log(event.target.value)
    this.applyFilters()
  }

  startDateFilter = ''
  
  clearFilters() {
    this.Unit = []
    this.searchOption = ''
    this.filter.issue_date = ''
    this.filter.end_issue_date = ''
    this.filter.block = ''
    this.filter.vehicle_number = ''
    this.filter.unit = ''
    this.vehicleNumberFilter = ''
    this.contactHost = ''
    this.selectedHost = ''
  }

  applyFilters() {
    // this.historyVehicles = this.vehicleData.filter(item => {
    //   const visitorDate = new Date(item.issue_date);
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
    //   const unitMatches = this.filter.unit ? item.unit_id == this.filter.unit : true;
    //   const hostMatches =  this.selectedHost ? item.industrial_host_id == this.selectedHost : true;
    //   const vehicleNumberMatches = this.filter.vehicle_number ? item.vehicle_number.toLowerCase().includes(this.filter.vehicle_number.toLowerCase()) : true;
      
    //   console.log(item.vehicle_number, this.filter.vehicle_number)
    //   return endDateMatches && hostMatches && blockMatches && startDateMatches && unitMatches && vehicleNumberMatches;
    // });
    this.loadRecordsWheelClamp()
    console.log(this.historyVehicles)
  }

  onArrowClick(vehicle: any[]){
    this.router.navigate(['records-wheel-clamped-detail'], {
      state: {
        vehicle: vehicle,
      },
      queryParams: this.params
    });
  }

  onClickNew() {
    this.router.navigate(['records-wheel-clamped-new']);
  }

  isLoading = false
  loadRecordsWheelClamp() {
    this.isLoading = true;
    let params = this.is_active ? {is_active: this.is_active,  alert_type: this.pageType, project_id: this.project_id} : {...this.filter, is_active: this.is_active,  alert_type: this.pageType, project_id: this.project_id, host: this.selectedHost, limit: this.functionMain.limitHistory, page: this.currentPage} 
    this.activeVehicles = []
    this.historyVehicles = []
    this.vehicleData = [];
    this.pagination = []
    this.sortVehicle = []
    this.clientMainService.getApi(params, '/vms/get/offenses').subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.response_code === 200) {
          if (this.is_active){
            this.activeVehicles = results.result.response_result;
          } else {
            this.vehicleData = results.result.response_result;
            this.historyVehicles = this.vehicleData
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

        this.isLoading = false;
      },
      error: (error) => {
        this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
        this.pagination = {}
        this.total_pages = 0
        this.currentPage = 1
        this.inputPage = 1
        this.isLoading = false;
      }
    });
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
    this.applyFilters()
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}
  vehicleNumberFilter = ''

  changePage(page: number) {
    let tempPage = page
    console.log(tempPage, this.total_pages)
    if (tempPage > 0 && tempPage <= this.total_pages) {
      this.currentPage = tempPage
      this.loadRecordsWheelClamp()
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
    this.loadRecordsWheelClamp()
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }


}
