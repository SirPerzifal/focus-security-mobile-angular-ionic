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
    this.roomId = event.target.value; // Set the roomId to the selected value
    this.facilityService.getRoomById(this.roomId).subscribe({
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
    switch(timeSlot.status) {
      case 'booked':
        return 'bg-red-200 text-gray-500 cursor-not-allowed';
      case 'active':
        return 'bg-green-200 text-black cursor-pointer hover:bg-green-300';
      default:
        return 'bg-[#D0D0D0] text-[#757575]';
    }
  }

  // Method untuk memilih slot waktu
  selectTimeSlot(timeSlot: any) {
    if (timeSlot.status === 'active') {
      this.selectedTimeSlot = timeSlot;
      console.log('Selected Time Slot:', this.selectedTimeSlot);
    }
  }

  uploadFacilityBooking() {
    if (!this.selectedTimeSlot) {
      // Tampilkan pesan error jika tidak ada slot yang dipilih
      this.errorMessage = 'Please select a time slot';
      return;
    }

    // Format tanggal sesuai kebutuhan API
    const formattedDate = this.selectedDate.split('T')[0]; // Ambil tanggal saja
    const startTime = `${formattedDate} ${this.selectedTimeSlot.start_time}:00`;
    const endTime = `${formattedDate} ${this.selectedTimeSlot.end_time}:00`;
    
    this.facilityService.postFacilityBook(
      this.roomId,
      startTime,
      endTime,
      this.unitId,
      this.partnerId
    ).subscribe({
      next: (response) => {
        this.roomSchedule = response.result.schedule;
        this.presentToast('Success add data', 'success');
        console.log('Room Schedule:', this.roomSchedule);
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

}
