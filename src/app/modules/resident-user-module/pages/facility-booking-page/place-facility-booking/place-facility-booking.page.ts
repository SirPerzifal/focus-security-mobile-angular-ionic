import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { NewBookingService } from 'src/app/service/resident/facility-bookings/new-booking/new-booking.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-place-facility-booking',
  templateUrl: './place-facility-booking.page.html',
  styleUrls: ['./place-facility-booking.page.scss'],
})
export class PlaceFacilityBookingPage implements OnInit {
  facilityId: number = 1;
  minDate: any = new Date().toISOString();
  roomId: number = 1;
  selectedTimeSlot: any = null;
  unitId: number = 1; // Sesuaikan dengan unit ID pengguna
  partnerId: number = 1;
  facilityDetail: any;
  roomDetail: any;
  roomSchedule: any[] = [];
  isLoading = false;
  errorMessage: string = '';
  selectedDate: string = new Date().toISOString();
  isTermsAccepted: boolean = false; // Menyimpan status checkbox
  selectedRoom: string = 'default' ;
  isRequirePayment: boolean = false; // Menyimpan status checkbox

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private facilityService: NewBookingService,
    private storage: StorageService,
    private toastController: ToastController,
    private modalController: ModalController,
    private mainApi: MainApiResidentService
  ) { }

  ngOnInit() {    // Ambil data unit yang sedang aktif
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.unitId = estate.unit_id;
            this.partnerId = estate.family_id;
            this.loadFacilityDetail();
          }
        })
      }
    })
    this.route.queryParams.subscribe(params => {
      this.facilityId = +params['facilityId'] || 1;
      this.loadFacilityDetail();
    });
  }

  onDateChange(event: any) {
    // Reset room selection saat tanggal diubah
    this.selectedRoom = 'default'; // Kembalikan ke opsi default
    this.loadRoomSchedule(event)
  }
  

  loadFacilityDetail() {
    this.facilityService.getFacilityById(this.facilityId).subscribe({
      next: (response) => {
        this.facilityDetail = response.result;
        
        // // console.log('Facility Detail:', this.facilityDetail);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load facility details';
        console.error('Error loading facility detail', error);
      }
    });
  }

  isCloseForMaintenance: boolean = true;

  loadRoomSchedule(event: any) {
    this.isLoading = true
    // Jika event ada, ambil roomId dari event
    if (event) {
      this.roomId = event.target.value; // Set the roomId to the selected value
    }

    if (this.roomId) {
      // Pastikan facilityDetail dan facility_detail ada
      if (this.facilityDetail && Array.isArray(this.facilityDetail.facility_detail)) {
          // Mengonversi this.roomId ke number
          const roomIdAsNumber = Number(this.roomId);
          
          // Mencari objek yang sesuai dengan roomIdAsNumber
          const facility = this.facilityDetail.facility_detail.find((facility: any) => {
              return facility.room_id === roomIdAsNumber;
          });

          const formattedDate = this.selectedDate.split('T')[0]; // Ambil tanggal saja
  
          if (facility || formattedDate) {
            if (facility) {
              this.termsAndCOndition = facility.terms_and_conditions;
              // // console.log(this.termsAndCOndition);
              
              // Jika ditemukan, ambil is_close_for_maintenance
              const isCloseForMaintenance = facility.is_close_for_maintenance;
              if (isCloseForMaintenance) {
                this.isCloseForMaintenance = true;
                // console.log(isCloseForMaintenance, "tes");
                this.roomSchedule = [];
                this.isRequirePayment = facility.is_require_payment;
                this.isLoading = false;
              } else {
                this.isCloseForMaintenance = false;
                this.facilityService.getRoomById(this.roomId, formattedDate).subscribe({
                  next: (response) => {
                    this.roomSchedule = response.result.schedule;
                    this.isRequirePayment = facility.is_require_payment;
                    this.isLoading = false;
                  },
                  error: (error) => {
                    this.errorMessage = 'Failed to load room schedule';
                    console.error('Error loading room schedule', error);
                  }
                });
              }
            } else {
              this.facilityService.getRoomById(this.roomId, formattedDate).subscribe({
                next: (response) => {
                  this.roomSchedule = response.result.schedule;
                  this.isRequirePayment = facility.is_require_payment;
                  this.isLoading = false;
                },
                error: (error) => {
                  this.errorMessage = 'Failed to load room schedule';
                  console.error('Error loading room schedule', error);
                }
              });
            }
          } else {
              // console.log(this.facilityDetail.facility_detail); // Menampilkan seluruh array facility_detail
              // console.log('Room not found');
          }
      } else {
          console.error('facility_detail is not an array or facilityDetail is undefined:', this.facilityDetail);
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
    const formattedDate = this.selectedDate.split('T')[0]; // Ambil tanggal saja
    const startTimeString = `${formattedDate} ${this.selectedTimeSlot.start_time}:00`;
    const endTimeString = `${formattedDate} ${this.selectedTimeSlot.end_time}:00`;

    if (this.isRequirePayment) {
      if (!this.selectedTimeSlot) {
        // Tampilkan pesan error jika tidak ada slot yang dipilih
        this.errorMessage = 'Please select a time slot';
        return;
      }
  
      if (!this.isTermsAccepted) {
        this.presentToast('Please click "I have read and agree to the Terms and Conditions for using this facility"', 'danger');
        return;
      }  
  
      // Format tanggal sesuai kebutuhan API
      const formattedDate = this.selectedDate.split('T')[0]; // Ambil tanggal saja
      const startTimeString = `${formattedDate} ${this.selectedTimeSlot.start_time}:00`;
      const endTimeString = `${formattedDate} ${this.selectedTimeSlot.end_time}:00`;
  
      this.mainApi.endpointMainProcess({
        room_id: Number(this.roomId),
        start_time: startTimeString,
        end_time: endTimeString,
      }, 'post/facility_book').subscribe(
        (response: any) => {
          this.router.navigate(['/facility-process-to-payment'], {
            state: {
              type: 'FromPlaceBooking',
              amount_deposit: response.result.booking_detail.amount_deposit,
              amount_taxed: response.result.booking_detail.amount_taxed,
              amount_total: response.result.booking_detail.amount_total,
              amount_untaxed: response.result.booking_detail.amount_untaxed,
              booked_by: response.result.booking_detail.booked_by,
              booking_date: response.result.booking_detail.booking_date,
              bookingId: response.result.booking_detail.booking_id,
              facility_name: response.result.booking_detail.facility_name,
              start_datetime: response.result.booking_detail.start_datetime,
              stop_datettime: response.result.booking_detail.stop_datettime,
            }
          })
        }
      )
    } else {
      if (!this.selectedTimeSlot) {
        // Tampilkan pesan error jika tidak ada slot yang dipilih
        this.errorMessage = 'Please select a time slot';
        return;
      }
  
      if (!this.isTermsAccepted) {
        this.presentToast('Please click "I have read and agree to the Terms and Conditions for using this facility"', 'danger');
        return;
      }  
  
      // Format tanggal sesuai kebutuhan API
      const formattedDate = this.selectedDate.split('T')[0]; // Ambil tanggal saja
      const startTimeString = `${formattedDate} ${this.selectedTimeSlot.start_time}:00`;
      const endTimeString = `${formattedDate} ${this.selectedTimeSlot.end_time}:00`;
  
      this.mainApi.endpointMainProcess({
        room_id: Number(this.roomId),
        start_time: startTimeString,
        end_time: endTimeString,
      }, 'post/facility_book').subscribe(
        (response: any) => {
          this.router.navigate(['/facility-process-to-payment'], {
            state: {
              type: 'FromPlaceBooking',
              amount_deposit: response.result.booking_detail.amount_deposit,
              amount_taxed: response.result.booking_detail.amount_taxed,
              amount_total: response.result.booking_detail.amount_total,
              amount_untaxed: response.result.booking_detail.amount_untaxed,
              booked_by: response.result.booking_detail.booked_by,
              booking_date: response.result.booking_detail.booking_date,
              bookingId: response.result.booking_detail.booking_id,
              facility_name: response.result.booking_detail.facility_name,
              start_datetime: response.result.booking_detail.start_datetime,
              stop_datettime: response.result.booking_detail.stop_datettime,
            }
          })
        }
      )
    }

  }

  toggleShowActBk() {
    this.router.navigate(['facility-booking-main']);
  }

  toggleShowNewBk() {
    this.router.navigate(['facility-new-booking']);
  }

  toggleShowDep() {
    this.router.navigate(['facility-deposits']);
  }

  toggleShowHis() {
    this.router.navigate(['facility-history']);
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      if (color === 'success') {
        pingSound.play().catch((err) => console.error('Error playing sound:', err));
      } else {
        errorSound.play().catch((err) => console.error('Error playing sound:', err));
      }
    });
  }

  resetForm() {
    // Reset semua input
    this.facilityId = 1;
    this.roomId = 1;
    this.selectedTimeSlot = null;
    this.partnerId = 1;
    this.roomSchedule = [];
    this.errorMessage = '';
    this.selectedDate = new Date().toISOString();
    this.isTermsAccepted = false; // Menyimpan status checkbox

    // Reset radio button
    const nricRadio = document.getElementById('nric_identification') as HTMLInputElement;
    const finRadio = document.getElementById('fin_identification') as HTMLInputElement;
    if (nricRadio) nricRadio.checked = false;
    if (finRadio) finRadio.checked = false;

    // Reset select
    const blockSelect = document.getElementById('contractor_block') as HTMLSelectElement;
    const unitSelect = document.getElementById('contractor_unit') as HTMLSelectElement;
    if (blockSelect) blockSelect.selectedIndex = 0;
    if (unitSelect) unitSelect.selectedIndex = 0;
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

}
