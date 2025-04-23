import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
// import { SignaturePadModule } from 'angular-signaturepad';

@Component({
  selector: 'app-records-facility',
  templateUrl: './records-facility.page.html',
  styleUrls: ['./records-facility.page.scss'],
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
export class RecordsFacilityPage implements OnInit {

  // renovationSchedules: any[] = [];
  isLoading: boolean = false;
  startDate: Date = new Date('2024-01-01')
  endDate: Date = new Date()

  // Subject untuk mengelola subscription
  private refreshInterval: any;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private blockUnitService: BlockUnitService,
    private mainVmsService: MainVmsService,
    public functionMain: FunctionMainService,
    // private signaturePad: SignaturePadModule
  ) { }

  ngOnInit() {
    this.loadProjectId().then(() => {
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
      this.getFacilities()
      this.getFacilityData()
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

  todayDate = this.convertToDDMMYYYY(new Date().toISOString().split('T')[0])
  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }
  
  facilityRecords: any[] = [];
  daySchedules: any[] = [];
  upcomingSchedules: any[] = [];
  historySchedules: any[] = []
  filteredHistorySchedules: any[] = []

  tempDataInit() {
    this.getFacilityData()
    // this.daySchedules = this.facilityRecords.filter(item => new Date(item.parking_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
    // this.upcomingSchedules = this.facilityRecords.filter(item => new Date(item.parking_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0))
    // this.historySchedules = this.facilityRecords
  }

  Facilities: any[] = []
  getFacilities(){
    this.mainVmsService.getApi({}, '/vms/get/get_room_facility' ).subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.Facilities = results.result.facility
        } else {
        }
      },
      error: (error) => {
        this.presentToast('Failed to load facility room!', 'danger');
        console.error(error);
      }
    });
  }

  getFacilityData(){
    if (this.showDay){
      if (this.daySchedules.length == 0){
        this.isLoading = true
        this.mainVmsService.getApi({project_id: this.project_id}, '/vms/get/facility_book' ).subscribe({
          next: (results) => {
            console.log(results)
            if (results.result.response_code == 200) {
              // this.presentToast('Coach data successfully submitted!', 'success');
              this.facilityRecords = results.result.active_bookings
              this.daySchedules = this.facilityRecords
              console.log(this.daySchedules)
            } else {
            }
            this.isLoading = false
          },
          error: (error) => {
            this.presentToast('An error occurred while loading booking data!', 'danger');
            console.error(error);
            this.isLoading = false
          }
        });
      }
    } else if (this.showUpcoming) {
      if (this.upcomingSchedules.length == 0){
        this.isLoading = true
        this.mainVmsService.getApi({project_id: this.project_id}, '/vms/get/facility_book_upcoming' ).subscribe({
          next: (results) => {
            if (results.result.response_code == 200) {
              // this.presentToast('Coach data successfully submitted!', 'success');
              this.facilityRecords = results.result.active_bookings
              this.upcomingSchedules = this.facilityRecords
              console.log(this.upcomingSchedules)
            } else {
            }
            this.isLoading = false
          },
          error: (error) => {
            this.presentToast('An error occurred while loading booking data!', 'danger');
            console.error(error);
            this.isLoading = false
          }
        });
      }
    } else if (this.showHistory) {
      console.log(this.historySchedules)
      if (this.historySchedules.length == 0) {
        this.isLoading = true
        this.mainVmsService.getApi({project_id: this.project_id}, '/vms/get/booking_history' ).subscribe({
          next: (results) => {
            console.log(results)
            if (results.result.success) {
              // this.presentToast('!', 'success');
              this.facilityRecords = results.result.booking
              this.historySchedules = this.facilityRecords
              this.filteredHistorySchedules = this.historySchedules
              console.log(this.historySchedules)
            } else {
            }
            this.isLoading = false
          },
          error: (error) => {
            this.presentToast('An error occurred while loading booking data!', 'danger');
            console.error(error);
            this.isLoading = false
          }
        });
      }
    }
  }

  showDay = true;
  showHistory = false;
  showDayTrans = false;
  showHistoryTrans = false;
  showUpcoming = false;
  showUpcomingTrans = false;
  choosenBlock = ''
  choosenUnit = ''
  choosenFacility = ''


  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showDayTrans && !this.showUpcomingTrans) {
      if (type == 'day') {
        if (!this.showDay){
          this.clearFilters()
          this.showHistory = false;
          this.showHistoryTrans = false;
          this.showUpcoming = false;
          this.showUpcomingTrans = false;
          this.showDayTrans = true
          setTimeout(() => {
            this.showDay = true;
            this.getFacilityData()
            this.showDayTrans = false
          }, 300)
        }
      }
      if (type == 'upcoming') {
        if(!this.showUpcoming){
          this.clearFilters()
          this.showDay = false;
          this.showDayTrans = false;
          this.showHistory = false;
          this.showHistoryTrans = false;
          this.showUpcomingTrans = true
          setTimeout(() => {
            this.showUpcoming = true;
            this.getFacilityData()
            this.showUpcomingTrans = false
          }, 300)
        }
      }
      if (type == 'history') {
        if(!this.showHistory){
          this.showDay = false;
          this.showDayTrans = false;
          this.showUpcoming = false;
          this.showUpcomingTrans = false;
          this.showHistoryTrans = true
          setTimeout(() => {
            this.showHistory = true;
            this.getFacilityData()
            this.showHistoryTrans = false
          }, 300)
        }
        
      }
      
    }
  }

  startDateFilter = ''
  endDateFilter = ''

  applyFilters() {
    this.filteredHistorySchedules = this.historySchedules.filter(item => {
      const visitorDate = new Date(item.parking_date);
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
      const unitMatches = this.choosenUnit ? item.unit_id == this.choosenUnit : true;
      const hostMatches =  this.selectedHost ? item.industrial_host_id == this.selectedHost : true;
      const facilityMatches = this.choosenFacility ? item.facility_id == this.choosenFacility : true;

      return hostMatches && typeMatches && unitMatches && facilityMatches && dateMatches;
    });
    console.log(this.filteredHistorySchedules)
  }

  Block: any[] = [];
  Unit: any[] = []

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
          // this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async loadUnit() {
    this.choosenUnit = ''
    // this.isLoadingUnit = true
    this.blockUnitService.getUnit(this.choosenBlock).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
          // this.isLoadingUnit = false
        } else {
          console.error('Error:', response.result);
          // this.isLoadingUnit = false
        }
      },
      error: (error) => {
        this.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
        // this.isLoadingUnit = false
      }
    });
  }

  onBlockChange(event: any) {
    this.choosenBlock = event.target.value;
    this.choosenUnit = ''
    this.loadUnit()
    this.applyFilters()
  }

  onFacilityChange(event: any) {
    this.choosenFacility = event.target.value;
    this.applyFilters()
  }

  onUnitChange(event: any) {
    this.choosenUnit = event[0];
    this.applyFilters()
  }


  onChangeDate(event: any) {
    this.startDateFilter = event.target.value
    this.applyFilters()
  }

  form(record: any) {
    // Navigasi ke halaman form dengan parameter
    this.router.navigate(['records-facility-detail'], {
      state: {
        record: record,
      }
    });
  }

  clearFilters() {
    this.searchOption = ''
    this.startDateFilter = ''
    this.endDateFilter = ''
    this.choosenBlock = ''
    this.choosenFacility = ''
    this.selectedRadio = ''
    this.isRadioClicked = false
    this.applyFilters() 
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
    this.choosenBlock = ''
    this.choosenUnit = ''
    this.choosenFacility = ''
    this.contactHost = ''
    this.selectedHost = ''
    console.log(event.target.value)
  }

  getBookingTime(record: any) {
    let start_date = this.functionMain.convertDateExtend(record.start_datetime)
    let stop_date = this.functionMain.convertDateExtend(record.stop_datettime)
    const startDate = start_date.split(' ')[0]; 
    return `${startDate} (${start_date.split(' ')[1]} - ${stop_date.split(' ')[1]})` 
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
      this.choosenBlock = ''
      this.choosenUnit = ''
      this.choosenFacility = ''
      this.contactHost = ''
      this.selectedHost = ''
    }
    console.log(this.selectedRadio)
    this.sortVehicle = this.historySchedules
    if (this.selectedRadio == 'sort_date') {
      this.isRadioClicked = true
      this.sortVehicle = Array.from(
        new Set(this.sortVehicle.map((record) => record.start_datetime ? new Date(record.start_datetime.split(' ')[0]).toISOString() : '-' ))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        schedule_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.sortVehicle.filter(item => item.start_datetime ? new Date(item.start_datetime).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0) : item.start_datetime == date ) ,            
      })).sort((a, b) => b.date.getTime() - a.date.getTime());;
      console.log(this.sortVehicle)
    } else {
      this.isRadioClicked = false
      this.searchOption = ''
    }
  }

  returnStatus(record: any) {
    return (record.resident_check_in && record.officer_check_in) ? ((record.resident_check_out && record.officer_check_out) ? '(CHECKED OUT)' : '(CHECKED IN)') : ''
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
