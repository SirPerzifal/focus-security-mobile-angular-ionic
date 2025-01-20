import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NewBookingService } from 'src/app/service/resident/facility-bookings/new-booking/new-booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facility-place-booking',
  templateUrl: './facility-place-booking.page.html',
  styleUrls: ['./facility-place-booking.page.scss'],
})
export class FacilityPlaceBookingPage implements OnInit {
  facilityId: number = 1;
  roomId: number = 1;
  selectedTimeSlot: any = null;
  unitId: number = 1; // Sesuaikan dengan unit ID pengguna
  partnerId: number = 1;
  facilityDetail: any;
  roomDetail: any;
  roomSchedule: any[] = [];
  isLoading = true;
  errorMessage: string = '';
  selectedDate: string = new Date().toISOString();
  isTermsAccepted: boolean = false; // Menyimpan status checkbox
  selectedRoom: string = 'default' ;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private facilityService: NewBookingService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
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
        console.log('Facility Detail:', this.facilityDetail);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load facility details';
        console.error('Error loading facility detail', error);
      }
    });
  }

  loadRoomSchedule(event: any) {
    // Jika event ada, ambil roomId dari event
    if (event) {
      this.roomId = event.target.value; // Set the roomId to the selected value
    }
    
    const formattedDate = this.selectedDate.split('T')[0]; // Ambil tanggal saja
    this.facilityService.getRoomById(this.roomId, formattedDate).subscribe({
      next: (response) => {
        this.roomSchedule = response.result.schedule;
        console.log('Room Id:', this.roomId);
        console.log('Room Schedule:', this.roomSchedule);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load room schedule';
        console.error('Error loading room schedule', error);
      }
    });
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
      console.log('Selected Time Slot:', this.selectedTimeSlot);
    }
  }

  uploadFacilityBooking() {
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

    this.facilityService.postFacilityBook(
      this.roomId,
      startTimeString,
      endTimeString,
      this.unitId,
      this.partnerId
    ).subscribe({
      next: (response) => {
        this.roomSchedule = response.result.success;
        const message = response.result.message;
        this.presentToast(message, 'success');
        console.log('Room Schedule:', this.roomSchedule);
        this.resetForm();
        this.router.navigate(['/resident-facility-bookings'])
      },
      error: (error) => {
        this.errorMessage = 'Failed to load room schedule';
        console.error('Error loading room schedule', error);
      }
    });
  }

  toggleShowActBk() {
    this.router.navigate(['resident-facility-bookings']);
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
    this.unitId = 1; // Sesuaikan dengan unit ID pengguna
    this.partnerId = 1;
    this.roomSchedule = [];
    this.isLoading = true;
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

}
