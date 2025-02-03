import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { RecordsWheelClampedNewPage } from './records-wheel-clamped-new/records-wheel-clamped-new.page'; 
import { Subscription } from 'rxjs';

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
    private route: ActivatedRoute
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
    this.loadRecordsWheelClamp()
    this.loadBlock()
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
      this.showActive = false;
      this.showHistory = false;
      this.showActiveTrans = false;
      this.showHistoryTrans = false;
      if (type == 'active') {
        this.is_active = true
        this.showActiveTrans = true
        if (this.activeVehicles.length == 0){
          this.loadRecordsWheelClamp()
        }
        setTimeout(() => {
          this.showActive = true;
          this.showActiveTrans = false
        }, 300)
      }
      if (type == 'history') {
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
    this.filter.unit = event.target.value;
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
          this.presentToast('Failed to load block data', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('Error loading block data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  loadUnit() {
    this.blockUnitService.getUnit(this.filter.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
        } else {
          this.presentToast('Failed to load unit data', 'danger');
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
    console.log(event.target.value)
  }

  startDateFilter = ''
  
  clearFilters() {
    this.filter.issue_date = ''
    this.filter.end_issue_date = ''
    this.filter.block = ''
    this.filter.vehicle_number = ''
    this.filter.unit = ''
    this.applyFilters() 
  }

  applyFilters() {
    this.historyVehicles = this.vehicleData.filter(item => {  
      const dateMatches = this.filter.issue_date ? item.issue_date >= this.filter.issue_date : true;
      const endDateMatches = this.filter.end_issue_date ? item.issue_date <= this.filter.end_issue_date : true;
      const blockMatches = this.filter.block ? item.block_id == this.filter.block : true;
      const unitMatches = this.filter.unit ? item.unit_name.toLowerCase().includes(this.filter.unit.toLowerCase()) && item.block_id == this.filter.block : true;
      const vehicleNumberMatches = this.filter.vehicle_number ? item.vehicle_number.toLowerCase().includes(this.filter.vehicle_number.toLowerCase()) : true;
      
      console.log(item.vehicle_number, this.filter.vehicle_number)
      return endDateMatches && blockMatches && dateMatches && unitMatches && vehicleNumberMatches;
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

  loadRecordsWheelClamp() {
    // this.isLoading = false;

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
          this.presentToast('There is no data in the system!', 'danger');
        }

        // this.isLoading = false;
      },
      error: (error) => {
        this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
        // this.isLoading = false;
      }
    });
  }
}
