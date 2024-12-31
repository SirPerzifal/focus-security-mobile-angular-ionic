import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoveInOutService } from 'src/app/service/vms/move_in_out_renovators/move_in_out/move-in-out.service';
import { RenovatorsService } from 'src/app/service/vms/move_in_out_renovators/renovators/renovators.service';
import { ToastController } from '@ionic/angular';
import { forkJoin, interval, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil, startWith } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

interface Schedule {
  id: number;
  block_name: string;
  unit_name: string;
  block_id: string;
  unit_id: string;
  schedule_date: string;
}

@Component({
  selector: 'app-move-home',
  templateUrl: './move-home.page.html',
  styleUrls: ['./move-home.page.scss'],
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
export class MoveHomePage implements OnInit, OnDestroy {
  moveInSchedules: Schedule[] = [];
  daySchedules: Schedule[] = [];
  historySchedules: Schedule[] = []
  filteredHistorySchedules: Schedule[] = []
  isLoading: boolean = true;

  // Subject untuk mengelola subscription
  private refreshInterval: any;

  constructor(
    private router: Router,
    private moveInOutService: MoveInOutService,
    private toastController: ToastController,
    private blockUnitService: BlockUnitService,
    private renovatorsService: RenovatorsService,
    private route: ActivatedRoute,
    private mainVmsService: MainVmsService
  ) { }

  pageType = 'move_in'

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['type']
      this.loadSchedulesHistory('today');
      this.loadBlock()
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  loadSchedulesHistory(type: string = 'today') {
    let url = ''
    this.historySchedules = []
    this.daySchedules = []
    console.log(this.pageType)
    this.isLoading = false;

    // Gunakan forkJoin untuk mengambil kedua jenis jadwal secara bersamaan
    if (this.pageType === 'move_in') {
      if (type === 'today') {
        this.moveInOutService.getMoveInOutSchedules().subscribe({
          next: (results) => {
            console.log(results.result.result)
            if (results.result.status_code === 200) {
              this.daySchedules = results.result.result;
              console.log(results)
            } else {
              this.presentToast('There is no move in data for today!', 'warning');
            }

            this.isLoading = false;
          },
          error: (error) => {
            this.presentToast('An error occurred while loading Move In / Out schedule!', 'danger');
            console.error(error);
            this.isLoading = false;
          }
        });
      } else {
        this.moveInOutService.getMoveInOutSchedulesHistory().subscribe({
          next: (results) => {
            console.log(results.result.result)
            if (results.result.status_code === 200) {
              this.historySchedules = results.result.result;
              this.filteredHistorySchedules = this.historySchedules
              console.log(results)
            } else {
              this.presentToast('There is no move in data!', 'warning');
            }

            this.isLoading = false;
          },
          error: (error) => {
            this.presentToast('An error occurred while loading Move In / Out schedule!', 'danger');
            console.error(error);
            this.isLoading = false;
          }
        });
      }
    } else if (this.pageType === 'renov') {
      if (type == 'today') {
        this.renovatorsService.getRenovationSchedules().subscribe({
          next: (results) => {
            console.log(results.result.result)
            if (results.result.status_code === 200) {
              this.daySchedules = results.result.result;
            } else {
              this.presentToast('There is no renovation data for today!', 'warning');
            }

            this.isLoading = false;
          },
          error: (error) => {
            this.presentToast('An error occurred while loading Renovations schedule!', 'danger');
            console.error(error);
            this.isLoading = false;
          }
        });
      } else {
        this.renovatorsService.getRenovationSchedulesHistory().subscribe({
          next: (results) => {
            console.log(results.result.result)
            if (results.result.status_code === 200) {
              this.historySchedules = results.result.result;
              this.filteredHistorySchedules = this.historySchedules
            } else {
              this.presentToast('There is no renovation data!', 'warning');
            }

            this.isLoading = false;
          },
          error: (error) => {
            this.presentToast('An error occurred while loading Renovations schedule!', 'danger');
            console.error(error);
            this.isLoading = false;
          }
        });
      }
    } else if (this.pageType === 'coach') {
      let url = ''
      if (type == 'today') {
        url = '/vms/get/coaches'
      } else {
        url = '/vms/get/coaches'
      }
      this.mainVmsService.getApi([], url).subscribe({
        next: (results) => {
          console.log(results.result)
          if (results.result.response_code === 200) {
            this.daySchedules = results.result.response_result
            this.historySchedules = results.result.response_result
            this.filteredHistorySchedules = this.historySchedules

          } else {
            this.presentToast('There is no coaches data!', 'danger');
          }

          // this.isLoading = false;
        },
        error: (error) => {
          this.presentToast('An error occurred while loading coaches data!', 'danger');
          console.error(error);
          // this.isLoading = false;
        }
      });
    } else if (this.pageType === 'ma_visitor') {
      this.historySchedules = [{
        id: 0,
        block_name: 'Block 1',
        unit_name: 'Unit 1',
        block_id: '',
        unit_id: '',
        schedule_date: '',
      }]
      this.daySchedules = this.historySchedules
      this.filteredHistorySchedules = this.historySchedules
    }
  }

  startDateFilter = ''
  endDateFilter = ''

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

  applyFilters() {
    this.filteredHistorySchedules = this.historySchedules.filter(item => {
      const visitorDate = new Date(item.schedule_date);
      visitorDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for date comparison

      // Convert the selected start and end dates to Date objects
      console.log(visitorDate, this.startDateFilter, this.endDateFilter)
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

  form(block: string, unit: string, block_id: string = '1', unit_id: string = '1') {
    if (this.pageType == 'ma_visitor') {
      this.router.navigate(['/ma-visitor-form'], {})
    } else if (this.pageType == 'coach') {
      this.router.navigate(['/coaches-form'], {})
    } else {
      // Navigasi ke halaman form dengan parameter
      console.log(block_id, unit_id)
      this.router.navigate(['move-form'], {
        queryParams: {
          block_id: block_id,
          unit_id: unit_id,
          block: block,
          unit: unit,
          schedule_type: this.pageType
        }
      });
    }
  }

  coachForm(schedule: any) {
    this.router.navigate(['/coaches-form'], {
      state: {
        schedule: schedule
      }
    })
  }

  renov_form(block: string, unit: string, block_id: string = '1', unit_id: string = '1') {
    // Navigasi ke halaman form renovasi dengan parameter
    console.log(block_id, unit_id)
    this.router.navigate(['renov-form'], {
      queryParams: {
        block_id: block_id,
        unit_id: unit_id,
        block: block,
        unit: unit,
        schedule_type: 'renovation'
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

  showDay = true;
  showHistory = false;
  showDayTrans = false;
  showHistoryTrans = false;
  choosenBlock = ''

  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showDayTrans) {
      this.showDay = false;
      this.showHistory = false;
      this.showDayTrans = false;
      this.showHistoryTrans = false;
      if (type == 'day') {
        this.showDayTrans = true
        if (this.daySchedules.length == 0) {
          this.loadSchedulesHistory('today')
        }
        setTimeout(() => {
          this.showDay = true;
          this.showDayTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.showHistoryTrans = true
        this.searchOption = ''
        this.startDateFilter = ''
        this.endDateFilter = ''
        this.choosenBlock = ''
        this.applyFilters()
        if (this.historySchedules.length == 0) {
          this.loadSchedulesHistory('history')
        } 
        setTimeout(() => {
          this.showHistory = true;
          this.showHistoryTrans = false
        }, 300)
      }
    }
  }

  Block: any[] = [];

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
          this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading block data!', 'danger');
      }
    });
  }

  onBlockChange(event: any) {
    this.choosenBlock = event.target.value;
    this.applyFilters()
  }

  onScheduleClick(id: number, schedule_date: string) {
    // if (this.pageType == 'ma_visitor') {
    //   this.router.navigate(['/ma-visitor-form'], {
    //     state: {
    //       id: id,
    //       schedule_date: schedule_date
    //     }
    //   })
    // } else if (this.pageType == 'coach') {
    //   this.router.navigate(['/coaches-form'], {})
    // } else {
    this.router.navigate(['/move-detail'], {
      state: {
        id: id,
        schedule_date: schedule_date
      },
      queryParams: {
        type: this.pageType
      }
    })
    // }

  }

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
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
