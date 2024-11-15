import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.page.html',
  styleUrls: ['./history-details.page.scss'],
})
export class HistoryDetailsPage implements OnInit {

  purpose: string = '';
  visitor: string = '';
  visit_date: string = '';
  banned: boolean = false;

  constructor(private router: Router, private alertController: AlertController) {
    // Ambil data dari state jika tersedia
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { purpose: string, visitor: string, visit_date: string, banned: boolean };
    if (state) {
      this.purpose = state.purpose;
      this.visitor = state.visitor;
      this.visit_date = state.visit_date;
      this.banned = state.banned;
    }
  }

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    this.router.navigate(['']);
  }

  ngOnInit() {
    console.log(this.purpose, this.visitor, this.visit_date, this.banned)
  }

  public async showAlertButtons(headerName: string, className: string) {
    const alertButtons = await this.alertController.create({
      cssClass: className,
      header: headerName + " this visitor?",
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['history']);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert cancel');
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  setResult() {
    console.log(`Dismissed with role`);
  }


}
