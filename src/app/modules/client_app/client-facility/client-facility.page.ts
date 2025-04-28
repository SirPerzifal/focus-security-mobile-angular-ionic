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
    this.getUserInfoService.getPreferenceStorage(
      ['unit',]
    ).then((value) => {
      console.log(value)
      this.unit_id = value.unit != null ? value.unit : 1;
    })
    this.loadFacilities()
    this.loadBooking()
    this.loadHistoryBooking()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const url = event['url']
        console.log(url);
        if (url == '/client-facility?facility=true') {
          this.loadFacilities()
          this.toggleShowFacility()
        }
        if (url == '/client-facility?booking=true') {
          this.loadBooking()
          this.toggleShowBooking()
        }
      }
    });
    
  }

  unit_id = 1

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBack() {
    this.router.navigate(['/client-main-app'])
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
    this.textSecond = 'Booking History'
    this.resetFilter()
  }

  toggleShowBooking() {
    this.isFacility = false
    this.isHistory = false
    this.isBooking = true
    this.textSecond = 'Booking Facility'
    this.showBookings = this.activeBookings
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
    this.showBookings = this.historyBookings.filter((booking: any) => {
      const bookingDate = new Date(booking.start_datetime.split(' ')[0]);

      // Konversi startDate dan endDate ke Date object jika ada
      const startDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
      const endDate = this.endDateFilter ? new Date(this.endDateFilter) : null;

      // Cek kondisi filtering
      const isAfterStartDate = !startDate || bookingDate >= startDate;
      const isBeforeEndDate = !endDate || bookingDate <= endDate;

      return isAfterStartDate && isBeforeEndDate;
    });
  }

  startDateFilter = ''
  endDateFilter = ''
  // Tambahkan method reset filter jika diperlukan
  resetFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.showBookings = this.historyBookings;
  }

  isLoading = false
  loadFacilities() {
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

  loadBooking() {
    this.isLoading = true
    this.clientMainService.getApi({unit_id: this.unit_id}, '/client/get/facility_book').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        if (results.result.response_code == 200) {
          if (results.result.active_bookings.length > 0) {
            this.activeBookings = results.result.active_bookings
          } else {
          }
        } else {
          this.functionMain.presentToast('An error occurred while loading booking data!', 'danger');
        }
        
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading booking data!', 'danger');
        console.error(error);
      }
    });
  }

  loadHistoryBooking() {
    this.isLoading = true
    this.clientMainService.getApi({unit_id: this.unit_id}, '/client/get/booking_history').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        if (results.result.success) {
          if (results.result.booking.length > 0) {
            this.historyBookings = results.result.booking
          } else {
          }
        } 
        // else {
        //   this.functionMain.presentToast('An error occurred while loading booking data!', 'danger');
        // }
        
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading booking data!', 'danger');
        console.error(error);
      }
    });
  }

}
