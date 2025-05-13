import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-records-contractor',
  templateUrl: './records-contractor.page.html',
  styleUrls: ['./records-contractor.page.scss'],
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
export class RecordsContractorPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService, 
    private toastController: ToastController, 
    private router: Router, 
    private modalController: ModalController,
    private route: ActivatedRoute,
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService
  ) { }

  todayDate = this.convertToDDMMYYYY(new Date().toISOString().split('T')[0])

  isLoading = false
  loadLogs(today: boolean = true) {
    this.isLoading = true;
    this.logsData = [];
    this.clientMainService.getApi({is_today: today, project_id: this.project_id}, '/vms/get/contractor_logs').subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.response_code === 200) {
          if (today){
            this.activeContractor = results.result.response_result;
            this.filteredActiveContractor = this.activeContractor
          } else {
            this.logsData = results.result.response_result;
            this.historyVehicles = this.logsData
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

  ngOnInit() {
    this.loadProjectName().then(() => {
      this.loadLogs(true)
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
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

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
        if (this.activeContractor.length == 0){
          this.loadLogs(true)
        }
        setTimeout(() => {
          this.showActive = true;
          this.showActiveTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.isRadioClicked = false
        this.selectedRadio = ''
        this.clearFilters()
        this.showHistoryTrans = true
        if (this.logsData.length == 0){
          this.loadLogs(false)
        }
        setTimeout(() => {
          this.showHistory = true;
          this.showHistoryTrans = false
        }, 300)
      }
    }
  }

  logsData: any[] = [];
  activeContractor: any[] = [];
  filteredActiveContractor: any[] = []
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
    this.loadUnit(); // Panggil method load unit
    this.applyFilters()
  }

  onUnitChange(event: any) {
    this.filter.unit = event[0];
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
    if (this.searchOption == event.target.value) return
    this.filter = {
      block: '',
      unit: '',
      vehicle_number: '',
      issue_date: '',
      end_issue_date: ''
    }
    this.contactHost = ''
    this.selectedHost = ''
    this.searchOption = event.target.value
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
    this.contactHost = ''
    this.selectedHost = ''
    this.applyFilters() 
  }

  applyFilters() {
    if (this.project_config.is_industrial) {
      this.historyVehicles = this.logsData.filter(item => {  
        const visitorDate = new Date(item.create_date);
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
        const hostMatches =  this.selectedHost ? item.industrial_host_ids.includes(parseInt(this.selectedHost)) : true;
        const unitMatches =  this.filter.unit ? item.unit_id == this.filter.unit : true;
        console.log(blockMatches, hostMatches, startDateMatches, unitMatches, endDateMatches)
        return blockMatches && hostMatches && startDateMatches && unitMatches && endDateMatches;
      });
    } else {
      this.historyVehicles = this.logsData.filter(item => {  
        const visitorDate = new Date(item.create_date);
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
        const unitMatches =  this.filter.unit ? item.unit_id == this.filter.unit : true;
        
        return blockMatches && startDateMatches && unitMatches && endDateMatches;
      });
    }
  }

  onArrowClick(logs: any[]){
    this.router.navigate(['records-contractor-detail'], {
      state: {
        record: logs,
      }
    });
  }

  onClickNew() {
    this.router.navigate(['records-wheel-clamped-new']);
  }
  
  isRadioClicked = false

  onRadioClick(value: string): void {
    if (this.selectedRadio === value) {
      this.selectedRadio = null;
    } else {
      this.filter = {
        block: '',
        unit: '',
        vehicle_number: '',
        issue_date: '',
        end_issue_date: ''
      }
      this.selectedRadio = value;
      this.searchOption = ''
    }
    console.log(this.selectedRadio)
    this.sortVehicle = this.logsData
    if (this.selectedRadio == 'sort_date') {
      this.isRadioClicked = true
      this.sortVehicle = Array.from(
        new Set(this.sortVehicle.map((record) => record.create_date ? new Date(record.create_date.split(' ')[0]).toISOString() : '-' ))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        schedule_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.sortVehicle.filter(item => item.create_date ? new Date(item.create_date).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0) : item.create_date == date ) ,            
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

  selectedTodayRadio = 'all'

  onTodayRadioClick(value: string): void {
    this.selectedTodayRadio = value
    if (value == 'checked_out') {
      this.filteredActiveContractor = this.activeContractor.filter((item: any) => item.check_out)
      console.log(this.sortVehicle)
    } else if (value == 'not_checked_out') {
      this.filteredActiveContractor = this.activeContractor.filter((item: any) => !item.check_out)
      console.log(this.sortVehicle)
    } else if (value == 'all') {
      this.filteredActiveContractor = this.activeContractor
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
    this.applyFilters()
  }

}
