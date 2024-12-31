import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { VisitorService } from 'src/app/service/resident/visitor/visitor.service';
import { Subscription } from 'rxjs';

interface FormData {
  dateOfInvite: string;
  vehicleNumber: string;
  entryType: string;
  entryTitle: string;
  entryMessage: string;
  isProvideUnit: boolean;
  hiredCar: string;
  unit: number;
}

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
export class ResidentVisitorsPage implements OnInit {
  
  minDate: string = this.getTodayDate(); // Set tanggal minimum saat inisialisasi
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

  constructor(
    private router: Router,
    private alertController: AlertController,
    private residentVisitorService: VisitorService,
    private toastController: ToastController,
    private activeRoute: ActivatedRoute
  ) {}

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });


    toast.present().then(() => {
      
      
    });;
  }

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

  getTodayDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`; // Format yyyy-mm-dd
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

    // Konversi ke format dd/mm/yyyy untuk ditampilkan
    const dateParts = input.value.split('-');
    if (dateParts.length === 3) {
        this.formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // dd/mm/yyyy
    } else {
        this.formattedDate = ''; // Reset jika format tidak valid
    }
    console.log(this.formattedDate, this.formData.dateOfInvite)
  }

  entryTitleChange(value: string) {
    this.formData.entryTitle = value;
  }

  onSubmitNext() {
    
    let errMsg = '';
    if (this.formData.dateOfInvite == "") {
      errMsg += 'Please fill vehicle number! \n';
    }
    if (this.formData.entryType == "") {
      errMsg += "Please choose entry type! \n";
    }
    if (this.formData.entryTitle == "") {
      errMsg += "Please fill entry title! \n";
    }
    
    console.log(this.formData);
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

  getActiveInvites() {
    try {
      this.residentVisitorService.getActiveInvites().subscribe(
        res => {
          var result = res.result['response_result'];
          this.activeInvites = [];
          console.log(result)
          result.forEach((item: any) => {
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
          });
        },
        error => {
          console.log(error);
        }
      );
    } catch (err) {
      console.log(err);
    }
    // console.log(this.activeInvites);
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
            console.log('Confirmed');
            // Logika konfirmasi
            if (invite) {
              this.confirmCancel(invite);
            }
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Canceled');
            // Logika pembatalan
          }
        },
      ]
    });
  
    await alert.present(); // Tambahkan baris ini
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  confirmCancel(invite: any) {
    try{
      this.residentVisitorService.postCancelVisitor(invite.is_entry ? false : invite.invite_id, !invite.is_entry ? false : invite.invite_id).subscribe(
        res => {
          console.log("Success")
          this.presentToast('Successfully cancel invites!', 'success')
          this.activeInvites = this.activeInvites.filter(inviteItem => inviteItem.invite_id !== invite.invite_id)
        },
        error => {
          this.presentToast(error, 'danger')
          console.log(error)
        }
      )
     } catch (err) {
      this.presentToast(String(err), 'danger')
      console.log(err)
     }
  }

  @ViewChild('inputDateVisitor') inputDateVisitor!: ElementRef;

  onClickOpenDate(): void {
    this.inputDateVisitor.nativeElement.focus(); // Fokus ke elemen input
  }


  ngOnInit() {
    this.getActiveInvites()
    // Inisialisasi formattedDate jika ada tanggal yang sudah ada
    if (this.formData.dateOfInvite) {
      const dateParts = this.formData.dateOfInvite.split('-');
      if (dateParts.length === 3) {
          this.formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // dd/mm/yyyy
      }
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log(event['url'])
        if (event['url'].split('?')[0] == '/resident-visitors'){
          this.getActiveInvites();
          this.activeInvites
        }
      }
    });
    this.activeRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['openActive']) {
        this.toggleShowActInv()
      } else {
        this.toggleShowNewInv()
      }
    });
  
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}