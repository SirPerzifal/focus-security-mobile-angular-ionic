import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { Subscription } from 'rxjs';
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
    // private signaturePad: SignaturePadModule
  ) { }

  ngOnInit() {
    this.loadBlock()
    this.getFacilityData()
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

  tempDataInit() {
    this.getFacilityData()
    // this.daySchedules = this.facilityRecords.filter(item => new Date(item.parking_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
    // this.upcomingSchedules = this.facilityRecords.filter(item => new Date(item.parking_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0))
    // this.historySchedules = this.facilityRecords
  }

  getFacilityData(){
    if (this.showDay){
      if (this.daySchedules.length == 0){
        this.mainVmsService.getApi({unit_id: 1}, '/resident/get/facility_book' ).subscribe({
          next: (results) => {
            if (results.result.response_code == 200) {
              // this.presentToast('Coach data successfully submitted!', 'success');
              this.facilityRecords = results.result.active_bookings
              this.daySchedules = this.facilityRecords
              console.log(this.daySchedules.length)
            } else {
              this.presentToast('There is no active booking data!', 'danger');
            }
          },
          error: (error) => {
            this.presentToast('An error occurred while loading booking data!', 'danger');
            console.error(error);
          }
        });
      }
    } else if (this.showUpcoming) {

    } else if (this.showHistory) {
      console.log(this.historySchedules)
      if (this.historySchedules.length == 0) {
        this.mainVmsService.getApi({unit_id: 1}, '/resident/get/booking_history' ).subscribe({
          next: (results) => {
            console.log(results)
            if (results.result.success) {
              // this.presentToast('!', 'success');
              this.facilityRecords = results.result.booking
              this.historySchedules = this.facilityRecords
            } else {
              this.presentToast('There is no booking data!', 'danger');
            }
          },
          error: (error) => {
            this.presentToast('An error occurred while loading booking data!', 'danger');
            console.error(error);
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

  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showDayTrans && !this.showUpcomingTrans) {
      this.showDay = false;
      this.showHistory = false;
      this.showDayTrans = false;
      this.showHistoryTrans = false;
      this.showUpcoming = false;
      this.showUpcomingTrans = false;
      if (type == 'day') {
        this.showDayTrans = true
        setTimeout(() => {
          this.showDay = true;
          this.getFacilityData()
          this.showDayTrans = false
        }, 300)
      }
      if (type == 'upcoming') {
        this.showUpcomingTrans = true
        setTimeout(() => {
          this.showUpcoming = true;
          this.getFacilityData()
          this.showUpcomingTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.startDateFilter = ''
        this.choosenBlock = ''
        this.showHistoryTrans = true
        setTimeout(() => {
          this.showHistory = true;
          this.getFacilityData()
          this.showHistoryTrans = false
        }, 300)
      }
      
    }
  }

  startDateFilter = ''
  endDateFilter = ''

  applyFilters() {
    this.historySchedules = this.facilityRecords.filter(item => {
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

      return typeMatches && dateMatches;
    });
    console.log(this.historySchedules)
  }

  Block: any[] = [];

  loadBlock() {
    console.log('hey this is block')
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
    console.log(this.Block)
  }

  onBlockChange(event: any) {
    this.choosenBlock = event.target.value;
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
    console.log(event.target.value)
  }

  getBookingTime(record: any) {
    let [year, month, day] = record.start_datetime.split(' ')[0].split('-'); 
    const startDate = `${day}/${month}/${year}`; 
    return `${startDate} (${record.start_datetime.split(' ')[1]} - ${record.stop_datettime.split(' ')[1]})` 
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
