import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { VisitorService } from 'src/app/service/resident/visitor/visitor.service';

interface FormData {
  dateOfInvite: Date;
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
    private toastController: ToastController
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData };
    if (state) {
      this.formData = state.formData;
      console.log(this.formData)
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });

    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      
      
    });;
  }

  formData = {
    dateOfInvite: new Date(),
    vehicleNumber: "",
    entryType: "",
    entryTitle: "",
    entryMessage: "",
    isProvideUnit: false,
    hiredCar: "",
    unit: 0,
  }

  onEntryTypeChange(value: string): void {
    this.formData.entryType = this.formData.entryType === value ? '' : value;
  }

  onProvideUnitChange() {
    this.formData.isProvideUnit = !this.formData.isProvideUnit
  }

  onVehicleNumberChange(value: string) {
    this.formData.vehicleNumber = value;
  }

  entryTitleChange(value: string) {
    this.formData.entryTitle = value;
  }

  onSubmitNext() {
    let errMsg = ''
    if (this.formData.vehicleNumber == "") {
      errMsg += 'Please fill vehicle number! \n'
    }
    if (this.formData.entryType == "") {
      errMsg += "Please choose entry type! \n"
    }
    if (this.formData.entryTitle == "") {
      errMsg += "Please fill entry tittle! \n"
    }
    
    console.log(this.formData)
    if (errMsg == ''){
      this.router.navigate(['/invite-form'], {
        state: {
          formData: this.formData,
        }
      });
    } else {
      this.presentToast(errMsg, 'danger')
    }
    
  }

  getActiveInvites(){
    try{
      this.residentVisitorService.getActiveInvites().subscribe(
        res => {
          var result = res.result['response_result']
          this.activeInvites = []
          result.forEach((item: any) => {
            this.activeInvites.push({
              name: item['visitor_name'],
              dateOfInvite: item['visit_date'],
              vehicleNo: item['vehicle_number'],
              entryType: item['entry_type'],
              invite_id: item['invite_id'],
              is_entry: item['is_entry']
            });
          });
        },
        error => {
          console.log(error)
        }
      )
     } catch (err) {
      console.log(err)
     }
     console.log(this.activeInvites)
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
    cancelText: string = 'Cancel', 
    confirmText: string = 'Confirm',
    invite?: any  // Jadikan optional
  ) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: header,
      message: '', 
      buttons: [
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Canceled');
            // Logika pembatalan
          }
        },
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
        }
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

  ngOnInit() {
    this.getActiveInvites()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/resident-visitors'){
          this.getActiveInvites();
        }
      }
    });
  }
}