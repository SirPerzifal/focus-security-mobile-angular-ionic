import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MoveInOutService } from 'src/app/service/vms/move_in_out_renovators/move_in_out/move-in-out.service';
import { RenovatorsService } from 'src/app/service/vms/move_in_out_renovators/renovators/renovators.service';
import { ToastController } from '@ionic/angular';
import { forkJoin, interval, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil, startWith } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

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
  moveInSchedules: any = [];
  daySchedules: any;
  historySchedules: any = []
  filteredHistorySchedules: any = []
  isLoading: boolean = true;

  // Subject untuk mengelola subscription
  private refreshInterval: any;

  todayDate = this.convertToDDMMYYYY(new Date().toISOString().split('T')[0])

  constructor(
    private router: Router,
    private moveInOutService: MoveInOutService,
    private toastController: ToastController,
    private blockUnitService: BlockUnitService,
    private renovatorsService: RenovatorsService,
    private route: ActivatedRoute,
    private mainVmsService: MainVmsService,
    private functionMain: FunctionMainService,
  ) { }

  pageType = 'move_in'

  private routerSubscription!: Subscription;
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadProjectName().then(() => {
        this.pageType = params['type']
        this.loadSchedulesHistory('today');
        this.loadSchedulesHistory('history');
        this.loadBlock()
      })
    })
  }
  
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id
    })
  }

  project_id = 0

  loadSchedulesHistory(type: string = 'today') {
    let url = ''
    this.historySchedules = []
    this.daySchedules = []
    console.log(this.pageType)
    this.isLoading = true;

    // Gunakan forkJoin untuk mengambil kedua jenis jadwal secara bersamaan
    if (this.pageType === 'move_in') {
      if (type === 'today') {
        this.moveInOutService.getMoveInOutSchedules(this.project_id).subscribe({
          next: (results) => {
            console.log(results.result.result)
            if (results.result.status_code === 200) {
              this.daySchedules = results.result.result;
              console.log(results)
            } else {
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
        this.moveInOutService.getMoveInOutSchedulesHistory(this.project_id).subscribe({
          next: (results) => {
            console.log(results.result.result)
            if (results.result.status_code === 200) {
              this.historySchedules = results.result.result;
              this.filteredHistorySchedules = this.historySchedules
              console.log(results)
            } else {
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
        this.renovatorsService.getRenovationSchedules(this.project_id).subscribe({
          next: (results) => {
            console.log(results.result.result)
            if (results.result.status_code === 200) {
              this.daySchedules = results.result.result;
            } else {
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
        this.renovatorsService.getRenovationSchedulesHistory(this.project_id).subscribe({
          next: (results) => {
            console.log(results.result.result)
            if (results.result.status_code === 200) {
              this.historySchedules = results.result.result;
              this.filteredHistorySchedules = this.historySchedules
            } else {
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
      if (type == 'today' && this.daySchedules.length >= 1) {
        return
      }
      if (type != 'today' && this.filteredHistorySchedules.length >= 1) {
        return
      }
      let url = '/vms/get/coaches'
      let params = {}
      if (type == 'today') {
        params = { is_today: true, project_id: this.project_id}
      } else {
        params = { is_today: false, project_id: this.project_id}
      }
      this.mainVmsService.getApi(params, url).subscribe({
        next: (results) => {
          console.log(results.result)
          if (results.result.response_code === 200) {
            if (type == 'today') {
              this.daySchedules = results.result.response_result
            } else {
              this.historySchedules = results.result.response_result
              this.filteredHistorySchedules = this.historySchedules
            }
          } else {
          }

          this.isLoading = false;
        },
        error: (error) => {
          this.presentToast('An error occurred while loading coaches data!', 'danger');
          console.error(error);
          this.isLoading = false;
        }
      });
    } else if (this.pageType === 'ma_visitor') {
      if (type == 'today' && this.daySchedules.length >= 1) {
        return
      }
      if (type != 'today' && this.filteredHistorySchedules.length >= 1) {
        return
      }
      let url = '/client/get/ma_visitor'
      let params = {}
      if (type == 'today') {
        params = { is_today: true}
      } else {
        params = { is_today: false}
      }
      this.mainVmsService.getApi(params, url).subscribe({
        next: (results) => {
          console.log(results.result)
          if (results.result.response_code === 200) {
            if (type == 'today') {
              this.daySchedules = results.result.response_result
            } else {
              this.historySchedules = results.result.response_result
              this.filteredHistorySchedules = this.historySchedules
            }
          } else {
          }

          this.isLoading = false;
        },
        error: (error) => {
          this.presentToast('An error occurred while loading visitor data!', 'danger');
          console.error(error);
          this.isLoading = false;
        }
      });
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

  clearFilters() {
    this.searchOption = ''
    this.startDateFilter = ''
    this.endDateFilter = ''
    this.choosenBlock = ''
    this.applyFilters() 
  }

  applyFilters() {
    console.log(this.historySchedules)
    this.filteredHistorySchedules = this.historySchedules.filter((item: any) => {
      const visitorDate = new Date(item.schedule_date);
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

      console.log(item.contractor_name ,visitorDate, selectedStartDate, selectedEndDate)

      // const dateMatches = (!selectedStartDate || visitorDate >= selectedStartDate) && (!selectedEndDate || visitorDate <= selectedEndDate);
      const startDateMatches = selectedStartDate ? visitorDate >= selectedStartDate : true
      const endDateMatches = selectedEndDate ? visitorDate <= selectedEndDate : true
      const typeMatches = this.choosenBlock ? item.block_id == this.choosenBlock : true;

      return typeMatches && startDateMatches && endDateMatches;
    });
    console.log(this.filteredHistorySchedules)
  }

  form(block: string, unit: string, block_id: string = '1', unit_id: string = '1', requestor_id: string) {
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
          schedule_type: this.pageType,
          requestor_id: requestor_id
        }
      });
    }
  }

  coachForm(schedule: any) {
    let url = this.pageType == 'ma_visitor' ? '/ma-visitor-form' : '/coaches-form'
    this.router.navigate([url], {
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
      if (type == 'day') {
        this.showHistory = false;
        this.showHistoryTrans = false;
        this.searchOption = ''
        this.startDateFilter = ''
        this.endDateFilter = ''
        this.choosenBlock = ''
        this.selectedRadio = ''
        this.isRadioClicked = false
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
        this.showDay = false;
      this.showDayTrans = false;
        this.showHistoryTrans = true
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

  onScheduleClick(record: any) {
    this.router.navigate(['/move-detail'], {
      state: {
        record: record
      },
      queryParams: {
        type: this.pageType
      }
    })
    // }

  }

  onClickHistory(record: any) {
    this.onScheduleClick(record)
    // if (this.pageType != 'ma_visitor'){
      
    // } else if (this.pageType == 'ma_visitor') {
    //   this.coachForm(record)
    // }
  }

  onClickDay(record: any) {
    if (this.pageType != 'coach' && this.pageType != 'ma_visitor'){
      this.form(record.block_name, record.unit_name, record.block_id, record.unit_id, record.requestor_id)
    } else if (this.pageType == 'coach' || this.pageType == 'ma_visitor') {
      this.coachForm(record)
    }
  }

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }

  searchOption = ''

  onSearchOptionChange(event: any) {
    this.searchOption = event.target.value
    if (this.searchOption == 'block') {
      this.startDateFilter = ''
      this.endDateFilter = ''
    } else if (this.searchOption == 'date') {
      this.choosenBlock = ''
    } else {}
    this.applyFilters()
    console.log(event.target.value)
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
    }
    console.log(this.selectedRadio)
    this.sortVehicle = this.historySchedules
    if (this.selectedRadio == 'sort_date') {
      this.isRadioClicked = true
      this.sortVehicle = Array.from(
        new Set(this.sortVehicle.map((record) => record.schedule_date ? new Date(record.schedule_date.split(' ')[0]).toISOString() : '-' ))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        schedule_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.sortVehicle.filter(item => item.schedule_date ? new Date(item.schedule_date).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0) : item.schedule_date == date ) ,            
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
      this.clearFilters()
    }
  }
}
