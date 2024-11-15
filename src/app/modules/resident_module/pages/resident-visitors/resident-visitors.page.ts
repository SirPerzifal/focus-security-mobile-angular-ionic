import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
  upcomingInvites:any[] = [
    {
      name: 'Sunil Jayakumar',
      dateOfInvite: '26/10/2024',
      vehicleNo: 'SNK5424D',
      entryType: 'One Time Entry'
    },
    {
      name: 'PHV - DROP OFF',
      dateOfInvite: '26/10/2024',
      vehicleNo: 'SNK5424D',
      entryType: 'One Time Entry'
    }
    // Tambahkan data lain jika diperlukan
  ];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    this.router.navigate(['/history']);
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
    // Logika pembatalan undangan
    console.log('Cancelling invite:', invite);
    // Misalnya, hapus invite dari daftar atau panggil service
  }

  ngOnInit() {}
}