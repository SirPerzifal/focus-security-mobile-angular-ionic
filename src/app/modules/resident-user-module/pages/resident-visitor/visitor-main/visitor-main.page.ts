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

  constructor(
    public functionMain: FunctionMainService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private mainApiResidentService: MainApiResidentService,
    private alertController: AlertController,
    http: HttpClient
  ) { super(http) }

  ionViewWillEnter() {
    this.selectedDate = '';
    this.entryCheck = '';
  }

  ngOnInit() {
    this.selectedDate = '';
    this.entryCheck = '';
    this.getTodayDate();
    this.getActiveInvites();
    const navigation = this.route.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: any };
    if (state) {
      this.formData = state.formData;
      this.selectedDate = '';
      this.entryCheck = '';
    }
    this.activeRoute.queryParams.subscribe(params => {
      // console.log(params);
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
          hiredCar: "",
        }
      } else if (params['formData']) {
        this.selectedDate = '';
        this.entryCheck = '';
        this.formData = {
          dateOfInvite: "",
          vehicleNumber: "",
          entryType: "",
          entryTitle: "",
          entryMessage: "",
          isProvideUnit: false,
          facility: '',
          hiredCar: "",
        }
      } else {
        this.selectedDate = '';
        this.entryCheck = '';
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
    // Mengambil hari dalam format angka (0-6)
    const dayIndex = today.getDay();
    
    // Array nama-nama hari
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Menyimpan nama hari ke dalam this.day
    this.day = days[dayIndex];
  }

  onClick(event: any) {
    if (event) {
      if (!this.showActInv) {
        this.toggleShowActInv();
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

  getActiveInvites() {
    try {
      this.mainApiResidentService.endpointMainProcess({}, 'get/active_invites').subscribe(
        res => {
          var result = res.result['response_status'];
          // console.log(result)
          if (result === 400) {
            // console.log(res);
            this.activeInvites = [];
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
                is_entry: item['is_entry']
              });
              this.isLoading = false
            });
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

  getBookingForFacility() {
    try {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
      this.mainApiResidentService.endpointMainProcess({}, 'get/facility_book').subscribe((response: any) => {
        this.facility = response.result.active_bookings.filter((booking: any) => {
          const bookingDate = new Date(booking.start_datetime).toISOString().split('T')[0];
          return bookingDate <= todayString; // Memfilter polling yang dimulai setelah hari ini
        }).map((booking: any) => ({
          id: booking.id,
          facilityName: booking.facility_name,
          bookName: booking.booking_name,
          bookingTime: `${this.formatTime(booking.start_datetime)} - ${this.formatTime(booking.stop_datettime)}`,
        }));
        console.log(this.facility);
        
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
        this.toggleShowNewInv()
        this.functionMain.presentToast('Success resend invite', 'success')
      }
    });
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
      // if (response.result.messages) {
      //   // Ambil pesan dari response
      //   const originalMessage = response.result.messages;
        
      //   // Encode pesan untuk digunakan dalam URL
      //   const encodedMessage = encodeURIComponent(originalMessage);
        
      //   // Tentukan nomor telepon jika tersedia, hilangkan tanda '+' jika ada
      //   const phone = phoneNumber ? phoneNumber.replace('+', '') : '';
        
      //   // Buat deep link WhatsApp dengan nomor telepon jika tersedia
      //   const whatsappLink = phone ? 
      //     `whatsapp://send?phone=${phone}&text=${encodedMessage}` : 
      //     `whatsapp://send?text=${encodedMessage}`;
        
      //   // Jika pengguna menggunakan perangkat mobile, buka WhatsApp
      //   if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      //     window.location.href = whatsappLink;
      //   } else {
      //     // Untuk desktop, buka WhatsApp Web
      //     const webWhatsappLink = phone ? 
      //       `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}` : 
      //       `https://web.whatsapp.com/send?text=${encodedMessage}`;
      //     window.open(webWhatsappLink, '_blank');
      //   }
      // }
      if (response.result.messages) {
        // Ambil pesan dari response
        const originalMessage = response.result.messages;
        
        // Encode pesan untuk digunakan dalam URL
        const encodedMessage = encodeURIComponent(originalMessage);
        
        // Tentukan nomor telepon jika tersedia (tanpa tanda '+' dan karakter non-digit)
        const phone = phoneNumber ? phoneNumber.replace(/\D/g, '') : '';
        
        // Buat link WhatsApp yang kompatibel dengan semua platform
        let whatsappLink;
        if (phone) {
          // Jika ada nomor telepon, gunakan format https://wa.me/[nomor]?text=[pesan]
          whatsappLink = `https://wa.me/${phone}?text=${encodedMessage}`;
        } else {
          // Jika tidak ada nomor telepon, gunakan format untuk sekadar membuka WhatsApp dengan pesan
          // Catatan: Ini akan membuka WhatsApp tanpa menentukan penerima
          whatsappLink = `https://wa.me/?text=${encodedMessage}`;
        }
        
        // Buka link dalam tab baru atau redirect langsung
        window.open(whatsappLink, '_blank');
        
        // Alternative: redirect langsung jika diinginkan
        // window.location.href = whatsappLink;
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

  onEntryfacilityChange(event: any) {
    this.formData.facility = event.target.value;
    console.log(event.target.value);
    
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
          this.functionMain.presentToast('Successfully cancel invites!', 'success')
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