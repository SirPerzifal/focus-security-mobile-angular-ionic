import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

import { ApiService } from 'src/app/service/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-contractor-commercial-main',
  templateUrl: './contractor-commercial-main.page.html',
  styleUrls: ['./contractor-commercial-main.page.scss'],
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
export class ContractorCommercialMainPage extends ApiService implements OnInit {

  navButtonsMain: any[] = [
    {
      text: 'Daily Invite',
      active: true,
      action: 'route',
      routeTo: '/contractor-commercial-main'
    },
    {
      text: 'History',
      active: false,
      action: 'route',
      routeTo: '/history-in-contractor'
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
  ]
  
  formData = {
    dateOfInvite: "",
    vehicleNumber: "",
    entryType: "",
    entryTitle: "",
    entryMessage: "",
    // hiredCar: "",
    // isProvideUnit: false,
  }
  selectedDate: string = '';
  
  showNewInv = true;
  showActInv = false;
  showNewInvTrans = false;
  showActInvTrans = false;
  extend_mb = false;
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
  ) { super(http) }

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
    const navigation = this.route.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: any };
    if (state) {
      this.formData = state.formData;
    }
    this.activeRoute.queryParams.subscribe(params => {
      // console.log(params);
      if (params['openActive']) {
        this.toggleShowActInv();
        this.getActiveInvites();
        this.formData = {
          dateOfInvite: "",
          vehicleNumber: "",
          entryType: "",
          entryTitle: "",
          entryMessage: "",
          // hiredCar: "",
          // isProvideUnit: false,
        }
        this.selectedDate = '';
        this.entryCheck = '';
      } else if (params['reload']) {
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
      } else {
        this.toggleShowNewInv()
        this.formData.entryTitle = '';
        this.formData.entryMessage = '';
        
        this.selectedDate = '';
        this.entryCheck = '';
      }
    });
  }

  getTodayDate() {
    const today = new Date();
    const string = today.toString;
    const final = String(today);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    this.minDate = `${yyyy}-${mm}-${dd}`; // Format yyyy-mm-dd
  }

  onClick(event: any) {
    if (event) {
      if (!this.showActInv) {
        this.formData = {
          dateOfInvite: "",
          vehicleNumber: "",
          entryType: "",
          entryTitle: "",
          entryMessage: "",
          // hiredCar: "",
          // isProvideUnit: false,
        }
        this.selectedDate = '';
        this.entryCheck = '';
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

  goToPage(event: any, want?: string) {
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
    this.activeInvites = [];

    // Ensure page is valid and within range
    if (page !== undefined) {
      page = Math.max(1, Math.min(page, this.pagination.total_page || 1));
    }

    try {
      this.mainApiResidentService.endpointMainProcess({
        page: page
      }, 'get/contractor_active_invites').subscribe(
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
                is_entry: item['is_entry'],
                expectedDays: item['expected_days_of_visit']
              });
              this.isLoading = false
            });
            this.pagination = {
              current_page: res.result.pagination.current_page ? Number(res.result.pagination.current_page) : 1,
              per_page: res.result.pagination.per_page ? Number(res.result.pagination.per_page) : 10,
              total_page: res.result.pagination.total_pages ? Number(res.result.pagination.total_pages) : 1,
              total_records: res.result.pagination.total_records ? Number(res.result.pagination.total_records) : 0
            }
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

  // onProvideUnitChange(event: any) {
  //   this.formData.isProvideUnit = !this.formData.isProvideUnit;
  // }

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
      this.route.navigate(['/contractor-inviting-form'], {
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
      this.mainApiResidentService.endpointMainProcess(
        {
          entry_id: !invite.is_entry ? false : invite.invite_id, 
          visitor_id: false,
          contractor_id: invite.is_entry ? false : invite.invite_id
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
          contractor_id: invite_id,
        }
      },
      { headers }
    ).subscribe((response: any) => {
      if (response.result.response_code === 200) {
        this.toggleShowActInv()
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
          contractor_id: invite_id,
        }
      },
      { headers }
    ).subscribe((response: any) => {
      if (response.result.messages) {
        // Ambil pesan dari response
        const originalMessage = response.result.messages;
        
        // Encode pesan untuk digunakan dalam URL
        const encodedMessage = encodeURIComponent(originalMessage);
        
        // Tentukan nomor telepon jika tersedia (tanpa tanda '+' dan karakter non-digit)
        const phone = phoneNumber ? phoneNumber.replace(/\D/g, '') : '';
        
        // Buat link WhatsApp yang kompatibel dengan semua platform
        let whatsappLink;
        console.log(phone);
        
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

}
