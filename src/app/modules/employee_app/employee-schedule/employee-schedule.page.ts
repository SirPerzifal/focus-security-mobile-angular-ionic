import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-employee-schedule',
  templateUrl: './employee-schedule.page.html',
  styleUrls: ['./employee-schedule.page.scss'],
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
export class EmployeeSchedulePage implements OnInit {

  constructor(
    private router: Router, 
    private clientMainService: MainVmsService, 
    public functionMain: FunctionMainService,
  ) { }

  ngOnInit() {
    this.loadBooking()
  }
  project_config: any = []
  project_id = 0

  unit_id = 1

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBack() {
    this.router.navigate(['/employee-main'])
  }

  textSecond = ''

  isHistory = false
  isBooking = true
  isShowForm = true
  isMain = true
  isDetail = false

  toggleShowHistory() {
    if (this.isHistory) return
    this.isBooking = false
    this.isHistory = true
    this.textSecond = 'Schedule History'
    this.isShowForm = false
    setTimeout(() => {
      this.isShowForm = true
    }, 300)
    this.loadBooking()
  }

  toggleShowBooking() {
    if (this.isBooking) return
    this.isHistory = false
    this.isBooking = true
    this.textSecond = 'Pending Schedule'
    this.isShowForm = false
    setTimeout(() => {
      this.isShowForm = true
    }, 300)
    setTimeout(() => {
    }, 300)
    this.loadBooking()
  }
  
  Schedules: any = []
  historyBookings: any = []
  activeBookings: any = []

  onStartDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.startDateFilter = input.value;
    this.applyDateFilter();
  }

  onEndDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.endDateFilter = input.value;
    this.applyDateFilter();
  }

  applyDateFilter() {
    this.currentPage = 1
    this.inputPage = 1
    this.loadBooking()
  }

  startDateFilter = ''
  endDateFilter = ''
  // Tambahkan method reset filter jika diperlukan
  resetFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyDateFilter()
  }

  isLoading = false

  async loadBooking() {
    this.isLoading = true
    let params = {}
    if (this.isBooking) {
      params = {page: this.currentPage, limit: this.functionMain.limitHistory, is_active: this.isBooking}
    } else {
      params = {page: this.currentPage, limit: this.functionMain.limitHistory, is_active: this.isBooking, issue_date: this.startDateFilter, end_issue_date: this.endDateFilter}
    }
    this.activeBookings = []
    this.historyBookings = []
    this.Schedules = []
    this.clientMainService.getApi(params, '/employee/get/schedule').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.status_code == 200) {
          this.Schedules = results.result.result
          this.pagination = results.result.pagination
          if (this.isBooking) {
            this.activeBookings = results.result.result
          } else {
            this.historyBookings = results.result.result
          }
        } else {
          this.pagination = {}
          this.functionMain.presentToast(results.result.status_message, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.pagination = {}
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading schedule data!', 'danger');
        console.error(error);
      }
    });
  }

  clickButton(action_type: string = 'approve') {
    if (action_type == 'reject') {
      this.openRejectModal()
    } else {
      this.actionSchedule(action_type)
    }
  }

  reject_reason = ''
  async actionSchedule(action_type: string = 'approve') {
    let errMsg = ''
    if (this.checkedFields.length == 0){
      errMsg += 'At least one field must checked! \n'
    }
    if (this.reject_reason == '' && action_type == 'reject'){
      errMsg += 'Reason for rejection is mandatory! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    this.clientMainService.getApi({schedule_ids: this.checkedFields, action_type: action_type}, '/employee/post/schedule_action').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.status_code == 200) {
          this.Schedules = this.Schedules.filter((item: any) => !this.checkedFields.includes(item.id))
          this.functionMain.presentToast(results.result.status_message, 'success')
          this.checkedFields = []
        } else {
          this.functionMain.presentToast(results.result.status_message, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast(`An error occurred while trying to ${action_type}!`, 'danger');
        console.error(error);
      }
    });
  }

  isRejectModal = false
  closeRejectModal() {
    this.isRejectModal = false
    this.reject_reason = ''
  }

  openRejectModal() {
    this.isRejectModal = true
    this.reject_reason = ''
  }

  handleRefresh(event: any) {
    if (this.isHistory) {
      this.loadBooking().then(() => event.target.complete())
    } else if (this.isBooking) {
      this.loadBooking().then(() => event.target.complete())
    }
  }

  checkedFields: any = []

  checkInput(field: any) {
    let index = this.checkedFields.find((item: any) => item == field.id)
    console.log(index)

    if (index) {
      this.checkedFields = this.checkedFields.filter((item: any) => item != field.id)
    } else {
      this.checkedFields.push(field.id)
    }
    console.log(this.checkedFields)
  }
  
  is_check_all = false
  checkAll() {
    this.is_check_all = !this.is_check_all
    if (this.is_check_all) {
      this.checkedFields = this.Schedules.map((item: any) => item.id)
    } else {
      this.checkedFields = []
    }
  }

  returnCheckTrue(field: any) {
    let index = this.checkedFields.find((item: any) => item == field.id)
    if (index) {
      return true
    } else {
      return false
    }
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  pageForward(page: number) {
    this.currentPage = page
    this.inputPage = page
    this.loadBooking()
  }

}
