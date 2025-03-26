import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

import { FormData } from 'src/models/resident/visitor.model';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-resident-visitors',
  templateUrl: './resident-visitors.page.html',
  styleUrls: ['./resident-visitors.page.scss'],
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
export class ResidentVisitorsPage implements OnInit, OnDestroy {  
  
  isLoading: boolean = true;
  unitId:number = 0;
  minDate: string = ''; // Set tanggal minimum saat inisialisasi
  formattedDate: string = '';
  showNewInv = true;
  showActInv = false;
  showNewInvTrans = false;
  showActInvTrans = false;
  selectedInvite: any = null;
  // Array untuk menyimpan data invites
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
  formData = {
    dateOfInvite: "",
    vehicleNumber: "",
    entryType: "",
    entryTitle: "",
    entryMessage: "",
    isProvideUnit: false,
    hiredCar: "",
    unit: 0,
  }

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private activeRoute: ActivatedRoute,
    private mainApiResidentService: MainApiResidentService
  ) {}

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unitId = parseValue.unit_id;
        this.getTodayDate();
        this.getActiveInvites();
      } 
    })
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData };
    if (state) {
      this.formData = state.formData;
    }
    // Inisialisasi formattedDate jika ada tanggal yang sudah ada
    if (this.formData.dateOfInvite) {
      const dateParts = this.formData.dateOfInvite.split('-');
      if (dateParts.length === 3) {
          this.formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    }
    this.activeRoute.queryParams.subscribe(params => {
      // console.log(params);
      if (params['openActive']) {
        this.toggleShowActInv();
        this.formattedDate = '';
        this.getActiveInvites();
        this.formData = {
          dateOfInvite: "",
          vehicleNumber: "",
          entryType: "",
          entryTitle: "",
          entryMessage: "",
          isProvideUnit: false,
          hiredCar: "",
          unit: 0,
        }
      } else if (params['formData']) {
        this.formData = {
          dateOfInvite: "",
          vehicleNumber: "",
          entryType: "",
          entryTitle: "",
          entryMessage: "",
          isProvideUnit: false,
          hiredCar: "",
          unit: 0,
        }
      } else {
        this.toggleShowNewInv()
      }
    });
  }

  getActiveInvites() {
    try {
      this.mainApiResidentService.endpointProcess({unit_id: this.unitId}, 'get/active_invites').subscribe(
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

  getTodayDate() {
    const today = new Date();
    const string = today.toString;
    const final = String(today);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    this.minDate = `${yyyy}-${mm}-${dd}`; // Format yyyy-mm-dd
  }

  onEntryTypeChange(value: string): void {
    this.formData.entryType = this.formData.entryType === value ? '' : value;
  }

  onProvideUnitChange() {
    this.formData.isProvideUnit = !this.formData.isProvideUnit;
  }

  onDateOfInviteChange(event: Event) {
    const input = event.target as HTMLInputElement; // Ambil elemen input
    this.formData.dateOfInvite = input.value; // Ambil nilai dari input
    this.formattedDate = input.value; // Ambil
    // console.log(this.formattedDate, this.formData.dateOfInvite)
  }

  entryTitleChange(value: string) {
    this.formData.entryTitle = value;
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
    
    // console.log(this.formData);
    if (errMsg == '') {
      this.router.navigate(['/invite-form'], {
        state: {
          formData: this.formData,
        }
      });
    } else {
      this.presentToast(errMsg, 'danger');
    }
  }

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    this.router.navigate(['history']);
  }

  toggleShowNewInv() {
    if (!this.showNewInv){
      this.showActInvTrans = true;
      this.showActInv = false;
      setTimeout(()=>{
        this.showNewInv = true;
      }, 300)
    }
  }

  toggleShowActInv() {
    if (!this.showActInv){
      this.showNewInvTrans = true;
      this.showNewInv = false;
      setTimeout(()=>{
        this.showActInv = true;
      }, 300)
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
          visitor_id: invite.is_entry ? false : invite.invite_id
        },
        'post/cancel_invite'
      ).subscribe(
        res => {
          this.presentToast('Successfully cancel invites!', 'success')
          this.activeInvites = this.activeInvites.filter(inviteItem => inviteItem.invite_id !== invite.invite_id)
        },
        error => {
          this.presentToast(error, 'danger')
        }
      )
     } catch (err) {
      this.presentToast(String(err), 'danger')
     }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present().then(() => {
    });;
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  extend_mb = false
  testAddMb(status: boolean = false) {
    this.extend_mb = status
  }
}