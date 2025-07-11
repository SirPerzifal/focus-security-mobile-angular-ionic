import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

import { ApiService } from 'src/app/service/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-visitor-main',
  templateUrl: './visitor-main.page.html',
  styleUrls: ['./visitor-main.page.scss'],
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
export class VisitorMainPage extends ApiService implements OnInit  {

  userType: string = '';
  navButtonsMain: any[] = [
    {
      text: 'Daily Invite',
      active: true,
      action: 'route',
      routeTo: '/visitor-main'
    },
    {
      text: 'Hired Car',
      active: false,
      action: 'route',
      routeTo: '/hired-card-in-visitor'
    },
    {
      text: 'History',
      active: false,
      action: 'route',
      routeTo: '/history-in-visitor'
    },
  ]
  navButtonsSub: any[] = [
    {
      text: 'New Invite',
      active: true,
      action: 'click'
    },
    {
      text: 'Active',
      active: false,
      action: 'click'
    },
    {
      text: ''
    }
  ]
  
  formData = {
    dateOfInvite: "",
    vehicleNumber: "",
    entryType: "",
    entryTitle: "",
    entryMessage: "",
    isProvideUnit: false,
    facility: '',
    facility_other: "",
    hiredCar: "",
  }
  selectedDate: string = '';
  facility: any[] = [
    {
      id: 0,
      bookName: ''
    }
  ]
  
  showNewInv = true;
  showActInv = false;
  showNewInvTrans = false;
  showActInvTrans = false;
  extend_mb = false;
  day: string = '';
  minDate: string = ''; // Set tanggal minimum saat inisialisasi
  isLoading: boolean = false;
  entryCheck: string = '';

  activeInvites:any[] = [
    {
      name: '',
      dateOfInvite: '',
      vehicleNumber: '',
      vehicleNo: '',
      entryType: '',
      invite_id: '',
      is_entry: false
    }
  ]

  pagination = {
    current_page: 1,    // Changed to number with default value
    per_page: 10,       // Changed to number with default value
    total_page: 1,      // Changed to number with default value
    total_records: 0    // Changed to number with default value
  }

  constructor(
    public functionMain: FunctionMainService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private mainApiResidentService: MainApiResidentService,
    private alertController: AlertController,
    http: HttpClient
  ) { super(http)
    const navigation = this.route.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: any };
    console.log(state)
    if (state) {
      this.formData = state.formData;
      this.selectedDate = '';
      this.entryCheck = '';
    }
   }

  ionViewWillEnter() {
  }

  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.getActiveInvites();
      event.target.complete();
    }, 1000)
  }

  ngOnInit() {
    this.getTodayDate();
    this.getActiveInvites();
    this.activeRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['reload']) {
        console.log("go to hell");
        const navigation = this.route.getCurrentNavigation();
        const state = navigation?.extras.state as { formData: any };
        console.log(state)
        if (state) {
          this.formData = state.formData;
          const date = new Date(state.formData.dateOfInvite);
          this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
          this.entryCheck = state.formData.entryType;
        }
      }
      if (params['openActive']) {
        this.selectedDate = '';
        this.entryCheck = '';
        this.toggleShowActInv();
        this.getActiveInvites();
        this.formData = {
          dateOfInvite: "",
          vehicleNumber: "",
          entryType: "",
          entryTitle: "",
          entryMessage: "",
          isProvideUnit: false,
          facility: '',
          facility_other: "",
          hiredCar: "",
        }
      } else if (params['reload']) {
        console.log("fuck");
        
        const navigation = this.route.getCurrentNavigation();
        const state = navigation?.extras.state as { formData: any };
        if (state) {
          this.formData = state.formData
          if (this.formData.dateOfInvite) {
            const date = new Date(this.formData.dateOfInvite);
            this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
            this.formData.dateOfInvite = this.formData.dateOfInvite;
          }
        }
      } else {
        console.log("fuck");
        
        this.selectedDate = '';
        this.entryCheck = '';
        this.formData.entryTitle = '';
        this.formData.entryMessage = '';
        this.formData.facility = '';
        this.toggleShowNewInv()
      }
    });
  }

  onChangeTypeUser(event: any) {
    this.userType = event;
    if (this.userType === 'industrial') {
      this.getBookingForFacility();
    }
  }

  getTodayDate() {
    const today = new Date();
    const string = today.toString;
    const final = String(today);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    this.minDate = `${yyyy}-${mm}-${dd}`; // Format yyyy-mm-dd
    // Menyimpan nama hari ke dalam this.day
    this.day = `${dd}-${mm}-${yyyy}`;
  }

  onClick(event: any) {
    if (event) {
      if (!this.showActInv) {
        this.toggleShowActInv();
        this.formData = {
          dateOfInvite: "",
          vehicleNumber: "",
          entryType: "",
          entryTitle: "",
          entryMessage: "",
          isProvideUnit: false,
          facility: '',
          facility_other: "",
          hiredCar: "",
        }
        this.selectedDate = '';
        this.entryCheck = '';
      } else if (!this.showNewInv) {
        this.toggleShowNewInv();
      }
    }
  }

  toggleShowActInv() {
    this.getActiveInvites();
    if (!this.showActInv){
      this.showNewInvTrans = true;
      this.showNewInv = false;
      this.navButtonsSub[0].active = false;
      this.navButtonsSub[1].active = true;
      setTimeout(()=>{
        this.showActInv = true;
      }, 300)
    }
  }

  goToPage(event: any) {
    const inputValue = parseInt(event.target.value, 10);
    
    // Validate input: ensure it's a number within valid range
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= this.pagination.total_page) {
      this.getActiveInvites('goto', inputValue);
    } else {
      // Reset to current page if invalid input
      event.target.value = this.pagination.current_page;
      
      // Optional: Show a toast message for invalid page
      this.functionMain.presentToast('Please enter a valid page number between 1 and ' + this.pagination.total_page, 'warning');
    }
  }

  getActiveInvites(type?: string, page?: number) {
    if (page !== undefined) {
      page = Math.max(1, Math.min(page, this.pagination.total_page || 1));
    }

    try {
      this.mainApiResidentService.endpointMainProcess({
        page: page
      }, 'get/active_invites').subscribe(
        res => {
          var result = res.result['response_status'];
          // console.log(result)
          if (result === 400) {
            // console.log(res);
            this.activeInvites = [];
            this.activeInvites.pop()
            this.isLoading = false;
            return;
          } else if (result === 200) {
            var result_data = res.result['response_result']
            this.activeInvites = [];
            result_data.forEach((item: any) => {
              // Memformat dateOfInvite
              const visitDate = item['visit_date'];
              const dateParts = visitDate.split('-'); // Misalnya, '2023-10-15' menjadi ['2023', '10', '15']
              const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Format menjadi '15/10/2023'
    
              this.activeInvites.push({
                name: item['visitor_name'],
                dateOfInvite: formattedDate, // Menggunakan tanggal yang sudah diformat
                vehicleNo: item['vehicle_number'],
                contactNo: item['contact_number'],
                entryType: item['entry_type'],
                invite_id: item['invite_id'],
                is_entry: item['is_entry'],
                facility: item['facility']
              });
            });
            this.pagination = {
              current_page: res.result.pagination.current_page ? Number(res.result.pagination.current_page) : 1,
              per_page: res.result.pagination.per_page ? Number(res.result.pagination.per_page) : 10,
              total_page: res.result.pagination.total_pages ? Number(res.result.pagination.total_pages) : 1,
              total_records: res.result.pagination.total_records ? Number(res.result.pagination.total_records) : 0
            }
            this.isLoading = false
          } else {
            this.activeInvites = [];
            this.activeInvites.pop();
          }
        },
        error => {
          console.log(error);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  formatTime(datetime: string): string {
    if (!datetime) return '';
    
    // Misalkan format datetime adalah 'YYYY-MM-DD HH:mm:ss'
    const timePart = datetime.split(' ')[1];
    
    // Potong detik jika perlu
    return timePart ? timePart.substring(0, 5) : '';
  }

  getBookingForFacility(selectedDate?: string) {
    try {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
      this.mainApiResidentService.endpointMainProcess({}, 'get/facility_book').subscribe((response: any) => {
        if (selectedDate) {
          const dateForFilter = new Date(selectedDate).toISOString().split('T')[0]; // Format YYYY-MM-DD
          console.log(selectedDate, dateForFilter, response.result.active_bookings);
          this.facility = response.result.active_bookings.filter((booking: any) => {
            const bookingDate = new Date(booking.start_datetime).toISOString().split('T')[0];
            return bookingDate == dateForFilter; // Memfilter polling yang dimulai setelah hari ini
          }).map((booking: any) => ({
            id: booking.id,
            facilityName: booking.facility_name,
            bookName: booking.booking_name,
            bookingTime: `${this.formatTime(booking.start_datetime)} - ${this.formatTime(booking.stop_datettime)}`,
          }));
          const [yyyy, mm, dd] = dateForFilter.split('-');
          this.day = `${dd}-${mm}-${yyyy}`;
          console.log(this.facility);
        } else {
          this.facility = response.result.active_bookings.filter((booking: any) => {
            const bookingDate = new Date(booking.start_datetime).toISOString().split('T')[0];
            return bookingDate == todayString; // Memfilter polling yang dimulai setelah hari ini
          }).map((booking: any) => ({
            id: booking.id,
            facilityName: booking.facility_name,
            bookName: booking.booking_name,
            bookingTime: `${this.formatTime(booking.start_datetime)} - ${this.formatTime(booking.stop_datettime)}`,
          }));
          console.log(this.facility, response.result.active_bookings);
        }
        
      }, (error) => {
        console.log(error);
        
      })
    } catch (err) {
      console.log(err);
    }
  }

  resendInvite(invite_id: number, phoneNumber?: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    
    this.http.post<any>(
      `${this.baseUrl}/resident/post/resend_invite`, 
      {
        jsonrpc: '2.0',
        params: {
          invite_id: invite_id,
        }
      },
      { headers }
    ).subscribe((response: any) => {
      if (response.result.response_code === 200) {
        this.toggleShowActInv()
        this.functionMain.presentToast('Success resend invite.', 'success')
      }
    });
  }

  // Helper function untuk deteksi iOS
  private isiOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  shareInvite(invite_id: number, phoneNumber?: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    
    this.http.post<any>(
      `${this.baseUrl}/resident/post/share_invite`, 
      {
        jsonrpc: '2.0',
        params: {
          invite_id: invite_id,
        }
      },
      { headers }
    ).subscribe((response: any) => {
      if (response.result.messages) {
        const originalMessage = response.result.messages;
        const encodedMessage = encodeURIComponent(originalMessage);
        const phone = phoneNumber ? phoneNumber.replace(/\D/g, '') : '';
        
        let whatsappLink;
        if (phone) {
          whatsappLink = `https://wa.me/${phone}?text=${encodedMessage}`;
        } else {
          whatsappLink = `https://wa.me/?text=${encodedMessage}`;
        }
        
        // Solusi untuk iOS - deteksi device dan gunakan metode yang sesuai
        if (this.isiOS()) {
          // Untuk iOS, gunakan window.location.href langsung
          window.location.href = whatsappLink;
        } else {
          // Untuk Android dan desktop, gunakan window.open
          window.open(whatsappLink, '_blank');
        }
      }
    });
  }

  toggleShowNewInv() {
    if (!this.showNewInv){
      this.showActInvTrans = true;
      this.showActInv = false;
      this.navButtonsSub[0].active = true;
      this.navButtonsSub[1].active = false;
      setTimeout(()=>{
        this.showNewInv = true;
      }, 300)
    }
  }

  onDateChange(event: any) {
    if (event) {
      const date = new Date(event);
      this.selectedDate = this.functionMain.formatDate(date); // Update selectedDate with the chosen date in dd/mm/yyyy format
      this.formData.dateOfInvite = event;
      this.getBookingForFacility(event);
      console.log(event, this.formData.dateOfInvite);
      
    } else {
      this.selectedDate = ''
    }
  }

  onChangeEntry(event: any) {
    console.log(event);
    
    if (event.click === true) {
      this.formData.entryType = event.value;
      this.entryCheck = event.value
    } else if (event.click === false) {
      this.formData.entryType = '';
    }
  }

  onEntryTitleChange(event: string) {
    this.formData.entryTitle = event;
  }

  onEntryTypeChange(entryType: string) {
    this.formData.entryType = entryType;
  }

  onProvideUnitChange(event: any) {
    this.formData.isProvideUnit = !this.formData.isProvideUnit;
  }

  facilitySelect = {
    fromBackend: true,
    other: false
  }

  onEntryfacilityChange(event: any) {
    this.formData.facility = event.target.value;
    if (this.formData.facility === 'other') {
      this.facilitySelect = {
        fromBackend: false,
        other: true
      };
    } else if (this.formData.facility === 'no_facility') {
      this.facilitySelect = {
        fromBackend: false,
        other: false
      };
    } else {
      this.facilitySelect = {
        fromBackend: true,
        other: false
      };
    }
  }

  onValueChange(event: any) {
    this.formData.facility_other = event;
  }

  onSubmitNext() {
    let errMsg = '';
    if (this.formData.dateOfInvite == "") {
      errMsg += 'Please fill date of invite! \n';
    }
    if (this.formData.entryType == "") {
      errMsg += "Please choose entry type! \n";
    }
    if (this.formData.entryTitle == "") {
      errMsg += "Please fill entry title! \n";
    }
    if (this.facilitySelect.other) {
      if (this.formData.facility_other == "") {
        errMsg += "Please fill other facility! \n";
      }
    }
    
    if (errMsg == '') {
      this.route.navigate(['/visitor-invitig-form'], {
        state: {
          formData: this.formData,
        }
      });
    } else {
      this.functionMain.presentToast(errMsg, 'danger');
    }
  }

  public async presentCustomAlert(
    header: string = 'Cancel Invite', 
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel', 
    invite?: any  // Jadikan optional
  ) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: header,
      message: '', 
      buttons: [
        {
          text: confirmText,
          cssClass: 'confirm-button',
          handler: () => {
            if (invite) {
              this.confirmCancel(invite);
            }
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
          }
        },
      ]
    });
  
    await alert.present(); // Tambahkan baris ini
  }

  confirmCancel(invite: any) {
    try{
      this.mainApiResidentService.endpointProcess(
        {
          entry_id: !invite.is_entry ? false : invite.invite_id, 
          visitor_id: invite.is_entry ? false : invite.invite_id,
          contractor_id: false,
        },
        'post/cancel_invite'
      ).subscribe(
        res => {
          this.functionMain.presentToast('Successfully canceled the invite!', 'success')
          this.activeInvites = this.activeInvites.filter(inviteItem => inviteItem.invite_id !== invite.invite_id)
        },
        error => {
          this.functionMain.presentToast(error, 'danger')
        }
      )
     } catch (err) {
      this.functionMain.presentToast(String(err), 'danger')
     }
  }

  testAddMb(status: boolean = false) {
    this.extend_mb = status
  }

}