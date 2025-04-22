import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { RecordsWheelClampedNewPage } from './records-wheel-clamped-new/records-wheel-clamped-new.page'; 
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

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
    private mainVmsService: MainVmsService
  ) { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: RecordsWheelClampedNewPage,
      cssClass: 'record-modal',
      componentProps: {
        type: this.pageType
      }
    });

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
    if (this.selectedRadio === value) {
      this.selectedRadio = null;
    } else {
      this.selectedRadio = value;
      this.clearFilters()
    }
    console.log(this.selectedRadio)
    if (this.selectedRadio == 'sort_date') {
      this.sortVehicle = Array.from(
        new Set(this.vehicleData.map((record) => new Date(record.issue_date).toISOString()))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        issue_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.vehicleData.filter(item => new Date(item.issue_date).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0)),            
      })).sort((a, b) => b.date.getTime() - a.date.getTime());;
      console.log(this.sortVehicle)
    }
    if (this.selectedRadio == 'sort_vehicle') {
      this.sortVehicle = Array.from(
        new Set(this.vehicleData.map((record) => record.vehicle_number))
      ).map((vehicle_number) => ({
        vehicle_number: vehicle_number,
        date: new Date(),
        issue_date: '',
        data: this.vehicleData.filter(item => item.vehicle_number == vehicle_number),            
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
    this.filter.unit = ''
    this.contactHost = ''
    this.selectedHost = ''
    this.applyFilters() 
  }

  applyFilters() {
    this.historyVehicles = this.vehicleData.filter(item => {
      const visitorDate = new Date(item.issue_date);
      visitorDate.setHours(0, 0, 0, 0); 

      const selectedStartDate = this.filter.issue_date ? new Date(this.filter.issue_date) : null;
      const selectedEndDate = this.filter.end_issue_date ? new Date(this.filter.end_issue_date) : null;

      if (selectedStartDate) {
        selectedStartDate.setHours(0, 0, 0, 0);
      }
      if (selectedEndDate) {
        selectedEndDate.setHours(0, 0, 0, 0);
      }
      
      const startDateMatches = selectedStartDate ? visitorDate >= selectedStartDate : true
      const endDateMatches = selectedEndDate ? visitorDate <= selectedEndDate : true

      const blockMatches = this.filter.block ? item.block_id == this.filter.block : true;
      const unitMatches = this.filter.unit ? item.unit_id == this.filter.unit : true;
      const hostMatches =  this.selectedHost ? item.industrial_host_id == this.selectedHost : true;
      const vehicleNumberMatches = this.filter.vehicle_number ? item.vehicle_number.toLowerCase().includes(this.filter.vehicle_number.toLowerCase()) : true;
      
      console.log(item.vehicle_number, this.filter.vehicle_number)
      return endDateMatches && hostMatches && blockMatches && startDateMatches && unitMatches && vehicleNumberMatches;
    });
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

    this.offensesService.getOfffenses(this.pageType, this.is_active).subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.response_code === 200) {
          if (this.is_active){
            this.activeVehicles = results.result.response_result;
          } else {
            this.vehicleData = results.result.response_result;
            this.historyVehicles = this.vehicleData
          }
          
        } else {
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  loadHost() {
    this.mainVmsService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
    this.applyFilters()
  }

}
