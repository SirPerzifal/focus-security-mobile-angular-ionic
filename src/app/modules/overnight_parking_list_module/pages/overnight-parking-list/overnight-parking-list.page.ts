import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { forkJoin, interval, Subject, Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

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

  parkingVehicles: any[] = [
    {
      id: 1,
      vehicleNumber: 'SBA 1234 A',
      block_id: '1',
      unit_id: '1',
      parking_date: '2024-12-24',
    },
    {
      id: 2,
      vehicleNumber: 'SBP 1818 T',
      block_id: '1',
      unit_id: '1',
      parking_date: '2024-12-24',
    },
    {
      id: 3,
      vehicleNumber: 'XB 1234 A',
      block_id: '1',
      unit_id: '1',
      parking_date: '2024-12-2',
    },
    {
      id: 4,
      vehicleNumber: 'SDN 7484 U',
      block_id: '1',
      unit_id: '1',
      parking_date: '2024-12-2',
    },
    {
      id: 5,
      vehicleNumber: 'SJD 6534 Y',
      block_id: '1',
      unit_id: '1',
      parking_date: '2024-12-2',
    },
  ];
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
    private mainVmsService: MainVmsService
  ) { }

  ngOnInit() {
    this.loadOvernight('today')
    this.loadBlock()
  }

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
    let url = ''
    if (type === 'today') { 
      url = '/vms/get/overnight_parking_list'
    } else if (type === 'upcoming') {
      url = '/vms/get/overnight_parking_list_upcoming'
    } else {
      url = '/vms/get/overnight_parking_list_history'
    }
    this.mainVmsService.getApi([], url ).subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          console.log(results.result.response_result)
          if (type === 'today') { 
            this.daySchedules = results.result.response_result
          } else if (type === 'upcoming') {
            this.upcomingSchedules = results.result.response_result
          } else {
            this.historySchedules = results.result.response_result
            this.filteredHistorySchedules = this.historySchedules
          }   
        } else {
          this.presentToast('There is no overnight parking data!', 'danger');
        }

        // this.isLoading = false;
      },
      error: (error) => {
        this.presentToast('An error occurred while loading overnight parking data!', 'danger');
        console.error(error);
        // this.isLoading = false;
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
      this.showDay = false;
      this.showHistory = false;
      this.showDayTrans = false;
      this.showHistoryTrans = false;
      this.showUpcoming = false;
      this.showUpcomingTrans = false;
      if (type == 'day') {
        this.showDayTrans = true
        if (this.daySchedules.length == 0) {
          this.loadOvernight('today')
        }
        setTimeout(() => {
          this.showDay = true;
          this.showDayTrans = false
        }, 300)
      }
      if (type == 'upcoming') {
        this.showUpcomingTrans = true
        if (this.upcomingSchedules.length == 0) {
          this.loadOvernight('upcoming')
        }
        setTimeout(() => {
          this.showUpcoming = true;
          this.showUpcomingTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.searchOption = ''
        this.startDateFilter = ''
        this.endDateFilter = ''
        this.choosenBlock = ''
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

      return typeMatches && dateMatches;
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
          // this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        // this.presentToast('An error occurred while loading block data!', 'danger');
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

}
