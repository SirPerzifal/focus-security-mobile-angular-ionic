import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

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
export class ContractorCommercialMainPage implements OnInit {

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

  constructor(
    public functionMain: FunctionMainService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private mainApiResidentService: MainApiResidentService,
    private alertController: AlertController
  ) { }

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
      } else if (params['formData']) {
        this.formData = {
          dateOfInvite: "",
          vehicleNumber: "",
          entryType: "",
          entryTitle: "",
          entryMessage: "",
          // hiredCar: "",
          // isProvideUnit: false,
        }
      } else {
        this.toggleShowNewInv()
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
        this.toggleShowActInv();
      } else if (!this.showNewInv) {
        this.toggleShowNewInv();
      }
    }
  }

  toggleShowActInv() {
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
      this.mainApiResidentService.endpointMainProcess({}, 'get/contractor_active_invites').subscribe(
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
      this.mainApiResidentService.endpointProcess(
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

}
