import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
    private blockUnitService: BlockUnitService
  ) { }

  ngOnInit() {
    this.tempDataInit()
    this.loadBlock()
  }

  facilityRecords: any[] = [];
  daySchedules: any[] = [];
  upcomingSchedules: any[] = [];
  historySchedules: any[] = []

  tempDataInit() {
    this.facilityRecords = [
      {
        id: 1,
        facility: 'Tennis Court 2',
        vehicleNumber: 'SBA 1234 A',
        block_id: '1',
        unit_id: '1',
        parking_date: '2024-12-27',
        show_date: '27/12/2024',
      },
      {
        id: 2,
        facility: 'Tennis Court 1',
        vehicleNumber: 'SBP 1818 T',
        block_id: '1',
        unit_id: '1',
        parking_date: '2024-12-27',
        show_date: '27/12/2024',
      },
      {
        id: 3,
        facility: 'Function Room 2',
        vehicleNumber: 'XB 1234 A',
        block_id: '1',
        unit_id: '1',
        parking_date: '2024-12-28',
        show_date: '28/12/2024',
      },
      {
        id: 4,
        facility: 'Swimming Pool 2',
        vehicleNumber: 'SDN 7484 U',
        block_id: '1',
        unit_id: '1',
        parking_date: '2024-12-28',
        show_date: '28/12/2024',
      },
      {
        id: 5,
        facility: 'Swimming Pool 1',
        vehicleNumber: 'SJD 6534 Y',
        block_id: '1',
        unit_id: '1',
        parking_date: '2024-12-28',
        show_date: '28/12/2024',
      },
    ]
    console.log(this.facilityRecords)
    this.daySchedules = this.facilityRecords.filter(item => new Date(item.parking_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
    this.upcomingSchedules = this.facilityRecords.filter(item => new Date(item.parking_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0))
    this.historySchedules = this.facilityRecords
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
          this.showDayTrans = false
        }, 300)
      }
      if (type == 'upcoming') {
        this.showUpcomingTrans = true
        setTimeout(() => {
          this.showUpcoming = true;
          this.showUpcomingTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.startDateFilter = ''
        this.choosenBlock = ''
        this.showHistoryTrans = true
        setTimeout(() => {
          this.showHistory = true;
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
          console.log(response)
        } else {
          // this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        // this.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
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

  // Penting: hapus interval saat komponen di destroy
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
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

}
