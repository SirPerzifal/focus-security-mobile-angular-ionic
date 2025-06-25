import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

@Component({
  selector: 'app-client-facility',
  templateUrl: './client-facility.page.html',
  styleUrls: ['./client-facility.page.scss'],
})
export class ClientFacilityPage implements OnInit {

  constructor(
    private router: Router, 
    private clientMainService: ClientMainService, 
    public functionMain: FunctionMainService, 
    private route: ActivatedRoute,
    private getUserInfoService: GetUserInfoService
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_config = value.config
      this.project_id = value.id
    })
    this.loadFacilities()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const url = event['url']
        console.log(url);
        if (url == '/client-facility?facility=true') {
          this.loadFacilities()
          this.toggleShowFacility()
        }
        if (url == '/client-facility?booking=true') {
          this.toggleShowBooking()
        }
      }
    });
    
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
    this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
  }

  textSecond = ''

  isFacility = true
  isHistory = false
  isBooking = false
  isMain = true
  isDetail = false

  toggleShowFacility() {
    this.isHistory = false
    this.isFacility = true
    this.isBooking = false
    this.textSecond = ''
  }

  toggleShowHistory() {
    this.isFacility = false
    this.isHistory = true
    this.isBooking = false
    this.textSecond = 'History'
    this.loadBooking()
  }

  toggleShowBooking() {
    this.isFacility = false
    this.isHistory = false
    this.isBooking = true
    this.textSecond = 'Bookings'
    this.loadBooking()
  }

  facilities: any = []

  facilityDetail(facility: any) {
    console.log(facility)
    this.router.navigate(['/client-facility-detail'], {
      state: {
        facility: facility
      }
    })
  }
  
  showBookings: any = []
  historyBookings: any = []
  activeBookings: any = []

  getBookingStatusLabel(status: string): string {
    switch (status) {
      case 'Approved': return 'Booking Approved';
      case 'Requested': return 'Booking Requested';
      case 'Pending_approval': return 'Pending Approval';
      case 'Pending_payment': return 'Pending Payment';
      case 'Rejected': return 'Booking Rejected';
      case 'Cancel': return 'Booking Cancelled';
      default: return status;
    }
  }

  viewDetails(booking: any) {
    console.log(booking)
    this.router.navigate(['/client-facility-booking-detail'], {
      state: {
        booking: booking
      }
    })
  }

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
    // this.showBookings = this.historyBookings.filter((booking: any) => {
    //   const bookingDate = new Date(booking.start_datetime.split(' ')[0]);

    //   // Konversi startDate dan endDate ke Date object jika ada
    //   const startDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
    //   const endDate = this.endDateFilter ? new Date(this.endDateFilter) : null;

    //   // Cek kondisi filtering
    //   const isAfterStartDate = !startDate || bookingDate >= startDate;
    //   const isBeforeEndDate = !endDate || bookingDate <= endDate;

    //   return isAfterStartDate && isBeforeEndDate;
    // });
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
  async loadFacilities() {
    this.isLoading = true
    this.clientMainService.getApi({}, '/client/get/facilities').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        if (results.result.length > 0) {
          this.facilities = results.result

        } else {
        }
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading facilities data!', 'danger');
        console.error(error);
      }
    });
  }

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
    this.showBookings = []
    this.clientMainService.getApi(params, '/client/get/facility_book').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        if (results.result.response_code == 200) {
          this.showBookings = results.result.active_bookings
          this.pagination = results.result.pagination
          if (this.isBooking) {
            this.activeBookings = results.result.result
          } else {
            this.historyBookings = results.result.result
          }
        } else {
          this.pagination = {}
          this.functionMain.presentToast('An error occurred while loading booking data!', 'danger');
        }
      },
      error: (error) => {
        this.pagination = {}
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading booking data!', 'danger');
        console.error(error);
      }
    });
  }

  handleRefresh(event: any) {
    if (this.isHistory) {
      this.loadBooking().then(() => event.target.complete())
    } else if (this.isBooking) {
      this.loadBooking().then(() => event.target.complete())
    } else {
      this.loadFacilities().then(() => event.target.complete())
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
