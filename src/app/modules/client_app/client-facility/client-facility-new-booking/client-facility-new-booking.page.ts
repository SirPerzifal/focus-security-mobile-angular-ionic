import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { NewBookingService } from 'src/app/service/resident/facility-bookings/new-booking/new-booking.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-client-facility-new-booking',
  templateUrl: './client-facility-new-booking.page.html',
  styleUrls: ['./client-facility-new-booking.page.scss'],
})
export class ClientFacilityNewBookingPage implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private facilityService: NewBookingService,
    private storage: StorageService,
    private toastController: ToastController,
    private modalController: ModalController,
    private mainApi: MainApiResidentService,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService
  ) { }

  ngOnInit() {    // Ambil data unit yang sedang aktif
    this.functionMain.vmsPreferences().then((value: any) => {
      console.log(value)
      if ( value ) {
        this.partner_id = value.family_id;
        this.project_id = value.project_id
        this.loadFacilities()
      }
    })
  }

  partner_id: any = false;
  project_id: any = false

  @ViewChild('chooseDateModal', { static: false }) chooseDateModal!: IonModal;
  facilityId: any = false;
  minDate: any = new Date().toISOString();
  roomId: number = 1;
  selectedTimeSlot: any = null;
  facilityDetail: any;
  roomDetail: any;
  roomSchedule: any[] = [];
  isLoading = false;
  errorMessage: string = '';
  selectedDate: string = new Date().toISOString();
  isTermsAccepted: boolean = false; // Menyimpan status checkbox
  selectedRoom = '' ;

  onBack() {
    console.log("test");
    this.router.navigate(['/client-facility'], {
      queryParams :  {
        booking: true
      }
    });
  }

  onDateChange(event: any) {
    // Reset room selection saat tanggal diubah
    this.selectedRoom = ''; // Kembalikan ke opsi default
    this.loadRoomSchedule(event)

    // Tutup modal setelah tanggal dipilih
    if (this.chooseDateModal) {
      this.chooseDateModal.dismiss();
    }
  }

  Facilities: any = []
  selectedFacility = ''
  async loadFacilities() {
    this.clientMainService.getApi({}, '/client/get/facilities').subscribe({
      next: (results) => {
        this.isLoading = false
        if (results.result.length > 0) {
          this.Facilities = results.result
          console.log(this.Facilities)
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading facilities data!', 'danger');
        console.error(error);
      }
    });
  }
  
  Rooms: any = []
  onFacilityChange(event: any) {
    this.selectedRoom = ''
    this.roomId = 0
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id == this.selectedFacility)[0].room_ids
    console.log(this.Rooms)
  }

  isCloseForMaintenance: boolean = true;

  loadRoomSchedule(event: any) {
    this.isLoading = true
    // Jika event ada, ambil roomId dari event
    if (event) {
      this.selectedRoom = event.target.value; // Set the selectedRoom to the selected value
    }
    console.log(this.selectedRoom)
    let facility = this.Rooms.filter((item: any) => item.room_id == this.selectedRoom)
    console.log(facility)
    if (this.selectedRoom) {
      this.termsAndCOndition = facility.terms_and_conditions;
      const formattedDate = this.selectedDate.split('T')[0]; 

      if (facility.is_close_for_maintenance) {
        this.isCloseForMaintenance = true;
        this.roomSchedule = [];
        this.isLoading = false;
      } else {
        this.isCloseForMaintenance = false
        this.facilityService.getRoomById(Number(this.selectedRoom), formattedDate).subscribe({
          next: (response) => {
            this.roomSchedule = response.result.schedule;
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to load room schedule';
            console.error('Error loading room schedule', error);
          }
        });
      }
    }
    
  }

  getTimeSlotClass(timeSlot: any): string {
    if (timeSlot.isSelected) {
      return 'bg-[#C9CC3F]'; // Kelas untuk slot waktu yang dipilih
    }

    switch(timeSlot.status) {
      case 'booked':
        return 'bg-[#E3787E] text-white cursor-not-allowed';
      case 'active':
        return 'bg-[#D8ECCF] text-black cursor-pointer hover:bg-[#C9CC3F]';
      default:
        return 'bg-[#D0D0D0] text-[#757575]';
    }
  }

  // Method untuk memilih slot waktu
  selectTimeSlot(timeSlot: any) {
    if (timeSlot.status === 'active') {
      this.selectedTimeSlot = timeSlot;
      // Tandai semua slot waktu sebagai tidak terpilih
      this.roomSchedule.forEach(slot => {
        slot.isSelected = false;
      });
      // Tandai slot waktu yang dipilih
      timeSlot.isSelected = true;
      // // console.log('Selected Time Slot:', this.selectedTimeSlot);
    }
  }

  uploadFacilityBooking() {
    if (!this.selectedTimeSlot) {
      // Tampilkan pesan error jika tidak ada slot yang dipilih
      this.errorMessage = 'Please select a time slot';
      return;
    }

    if (!this.isTermsAccepted) {
      this.functionMain.presentToast('Please click "I have read and agree to the Terms and Conditions for using this facility"', 'danger');
      return;
    }  

    // Format tanggal sesuai kebutuhan API
    const formattedDate = this.selectedDate.split('T')[0]; // Ambil tanggal saja
    const startTimeString = `${formattedDate} ${this.selectedTimeSlot.start_time}:00`;
    const endTimeString = `${formattedDate} ${this.selectedTimeSlot.end_time}:00`;

    this.clientMainService.getApi({
      room_id: Number(this.selectedRoom),
      start_time: startTimeString,
      end_time: endTimeString,
      is_client: true,
      host: this.partner_id,
    }, '/resident/post/facility_book').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.success) {
          this.onBack()
        } else {
          this.functionMain.presentToast('An error occurred while trying to add new booking!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to add new booking!', 'danger');
        console.error(error);
      }
    });
  }

  termsAndCOndition: string = '';

  async presentModalAgreement() {
    const modal = await this.modalController.create({
      component: TermsConditionModalComponent,
      cssClass: 'terms-condition-modal',
      componentProps: {
        terms_condition: this.termsAndCOndition
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {

      }
    });

    return await modal.present();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete()
    }, 300);
  }

}
