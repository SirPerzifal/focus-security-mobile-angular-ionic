import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

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
    private mainVmsService: MainVmsService
  ) { }

  todayDate = this.convertToDDMMYYYY(new Date().toISOString().split('T')[0])

  loadLogs(type: string, today: boolean = true) {
    this.logsData = [];
    if (type === 'visitor') {
      
    } else if (type === 'vehicle') {
      
    }
    this.mainVmsService.getApi({is_today: today, log_type: type}, '/vms/get/visitor_log').subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.response_code === 200) {
          if (today){
            this.activeVehicles = results.result.response_result;
          } else {
            this.logsData = results.result.response_result;
            this.historyVehicles = this.logsData
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

  ngOnInit() {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     console.log(event.url, 'from record visitoorrrrr')
    //     if (event.url.split('?')[0] == '/records-visitor'){
    //       this.route.queryParams.subscribe(params => {
    //         this.pageType = params['type']
    //         this.params = params
    //         console.log(this.pageType)
    //       })
    //       this.loadLogs(this.pageType, true)
    //       this.loadBlock()
    //     } else {
    //       console.log("THIS WORK")          
    //     }
    //   } 
    // });
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.params = params
      console.log(this.pageType)
    })
    this.loadLogs(this.pageType, true)
    this.loadBlock()
    
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  params: any
  pageType = 'visitor'
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
        this.showActiveTrans = true
        if (this.activeVehicles.length == 0){
          this.loadLogs(this.pageType, true)
        }
        setTimeout(() => {
          this.showActive = true;
          this.showActiveTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.showHistoryTrans = true
        if (this.logsData.length == 0){
          this.loadLogs(this.pageType, false)
        }
        setTimeout(() => {
          this.showHistory = true;
          this.showHistoryTrans = false
        }, 300)
      }
    }
  }

  logsData: any[] = [];
  activeVehicles: any[] = [];
  historyVehicles: any[] = [];
  sortVehicle: any[] = []
  selectedRadio: string | null = null
  searchOption: string | null = null

  onRadioClick(value: string): void {
    if (this.selectedRadio === value) {
      this.selectedRadio = null;
    } else {
      this.selectedRadio = value;
    }
    console.log(this.selectedRadio)
    if (this.selectedRadio == 'sort_date') {
      this.sortVehicle = Array.from(
        new Set(this.logsData.map((record) => new Date(record.issue_date).toISOString()))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        issue_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.logsData.filter(item => new Date(item.issue_date).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0)),            
      })).sort((a, b) => b.date.getTime() - a.date.getTime());;
      console.log(this.sortVehicle)
    }
    if (this.selectedRadio == 'sort_vehicle') {
      this.sortVehicle = Array.from(
        new Set(this.logsData.map((record) => record.vehicle_number))
      ).map((vehicle_number) => ({
        vehicle_number: vehicle_number,
        date: new Date(),
        issue_date: '',
        data: this.logsData.filter(item => item.vehicle_number == vehicle_number),            
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
    this.searchOption = ''
    this.filter.issue_date = ''
    this.filter.end_issue_date = ''
    this.filter.block = ''
    this.filter.vehicle_number = ''
    this.filter.unit = ''
    this.applyFilters() 
  }

  applyFilters() {
    this.historyVehicles = this.logsData.filter(item => {  
      const dateMatches = this.filter.issue_date ? item.entry_datetime >= this.filter.issue_date : true;
      const endDateMatches = this.filter.end_issue_date ? item.entry_datetime <= this.filter.end_issue_date : true;
      const blockMatches = this.filter.block ? item.block_id == this.filter.block : true;
      const unitMatches = this.filter.unit ? item.unit_name.toLowerCase().includes(this.filter.unit.toLowerCase()) : true;
      const vehicleMatches = this.filter.vehicle_number && this.pageType == 'vehicle' ? item.vehicle_number.toLowerCase().includes(this.filter.vehicle_number.toLowerCase()) : true;
  
      return blockMatches && dateMatches && unitMatches && vehicleMatches && endDateMatches;
    });
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

  loadRecordsWheelClamp() {
    // this.isLoading = false;

    // this.offensesService.getOfffenses(this.pageType).subscribe({
    //   next: (results) => {
    //     if (results.result.response_code === 200) {
    //       this.logsData = results.result.response_result;
    //       console.log(this.logsData)
    //       this.activeVehicles = this.logsData.filter(item => new Date(item.issue_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
    //       this.historyVehicles = this.logsData
    //     } else {
    //       this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
    //     }

    //     // this.isLoading = false;
    //   },
    //   error: (error) => {
    //     this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
    //     console.error(error);
    //     // this.isLoading = false;
    //   }
    // });
  }

}
