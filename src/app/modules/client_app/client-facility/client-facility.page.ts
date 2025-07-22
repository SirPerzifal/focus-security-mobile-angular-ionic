import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { NewBookingService } from 'src/app/service/resident/facility-bookings/new-booking/new-booking.service';
import { AlertController } from '@ionic/angular';

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
    private facilityService: NewBookingService,
    private alertController: AlertController,
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
    this.textSecond = 'History Bookings'
    this.loadBooking()
  }

  toggleShowBooking() {
    this.isFacility = false
    this.isHistory = false
    this.isBooking = true
    this.textSecond = 'Active Bookings'
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

  isModal = false
  
  openModal() {
    if (this.isFacility) {
      this.addLayerHistory()
      this.isModal = true
    } else {
      this.router.navigate(['/client-facility-new-booking'])
    }
  }
  
  closeModal() {
    this.isModal = false
    this.newFacilityForm = {}
    this.closeLayerHistory()
  }

  newFacilityForm: any = {}
  onSubmitNewFacility() {
    console.log(this.newFacilityForm)
    let errMsg = ''
    if (!this.newFacilityForm.facility_name) {
      errMsg += "Facility name is required! \n"
    }
    // if (!this.newFacilityForm.facility_banner) {
    //   errMsg += "Room name is required! \n"
    // }
    if (errMsg != '') {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    this.clientMainService.getApi(this.newFacilityForm, '/client/post/edit_facility').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast(this.newFacilityForm.facility_id ? `Successfully update facility!` : `Successfully add new facility!`, 'success');
          this.loadFacilities()
          this.closeModal()
        } else {
          this.functionMain.presentToast(`An error occurred while ${this.newFacilityForm.facility_id ? 'adding new' : 'updating'} facility!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast(`An error occurred while ${this.newFacilityForm.facility_id ? 'adding new' : 'updating'} facility!`, 'danger');
        console.error(error);
      }
    });
    
  }

  async onDeleteNewFacility() {
    const alertButtons = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: `Are you sure you want to delete ${this.newFacilityForm.facility_name}?`,
      message: '', 
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => {
            this.deleteFacility(this.newFacilityForm.facility_id)
          }
        },
        {
          text: 'Cancel',
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Canceled');
            // Logika pembatalan
          }
        },
      ]
    });
    await alertButtons.present();
  }

  async deleteFacility(facility_id: any) {
    console.log(facility_id)
    this.clientMainService.getApi({facility_id: facility_id}, '/client/post/remove_facility').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast(`Successfully delete the facility!`, 'success');
          this.loadFacilities()
          this.closeModal()
        } else {
          this.functionMain.presentToast(`An error occurred while trying to delete the facility!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast(`An error occurred while trying to delete the facility!`, 'danger');
        console.error(error);
      }
    });
  }

  editFacility(facility: any) {
    this.newFacilityForm = {
      facility_name: facility.facility_name,
      facility_banner: facility.facility_banner,
      facility_id: facility.facility_id,
    }
    this.openModal()
  }

  minDate: any = new Date().toISOString();
  selectedDate: string = new Date().toISOString();
  selectedRoom: any = false

  onDateChange(event: any) {
    this.selectedRoom = false; // Kembalikan ke opsi default
    // this.loadRoomSchedule(event)

    // if (this.chooseDateModal) {
    //   this.chooseDateModal.dismiss();
    // }
  }

  isModalSelectionOpen = false

  openModalSelection() {
    this.isModalSelectionOpen = true
  }

  closeModalSelection() {
    this.isModalSelectionOpen = false
  }

  @ViewChild('fileFacilityIconInput') fileInput!: ElementRef;
  openFile() {
    this.fileInput?.nativeElement.click();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file)
      let fileReady = await this.functionMain.convertFileToBase64(file)
      console.log(fileReady.split(',')[1])
      this.newFacilityForm.facility_banner = fileReady.split(',')[1]
      console.log(this.newFacilityForm)
      this.closeModalSelection()
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64
      });
      console.log(image.base64String)
      this.newFacilityForm.facility_banner = image.base64String;
      console.log(this.newFacilityForm)
      this.closeModalSelection()
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }
      
      this.newFacilityForm.facility_banner = false
      this.functionMain.presentToast('Error taking photo', 'danger')
      console.error(error)
    }
    
  };

  pushedModalState = false
  pushedSelectionModalState = false
  addLayerHistory() {
    if (!this.pushedModalState) {
      history.pushState(null, '', location.href);
      this.pushedModalState = true;
    }

    const closeModalOnBack = () => {
      this.pushedModalState = false
      this.isModal = false
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

  }

  closeLayerHistory() {
    this.closeModalSelection()
    if (this.pushedModalState) {
      this.pushedModalState = false;
      history.back(); // simulate the back button
    }
  }

}
