import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.page.html',
  styleUrls: ['./history-details.page.scss'],
})
export class HistoryDetailsPage implements OnInit {

  historyData!: {
    purpose: 'Drop Off' | 'Pick Up' | 'Visiting' | 'Delivery' | string;
    visitor_name: string;
    visitor_date: Date;
    visitor_entry_time: string;
    visitor_exit_time: string;
    mode_of_entry: string;
    vehicle_number: string;
    point_of_entry: string;
    mobile_number: string;
    delivery_type: string;
    vehicle_type: string;
    banned: boolean;
    id: number;
  };

  constructor(private router: Router, private alertController: AlertController) {
    // Ambil data dari state jika tersedia
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { historyData: any };
    if (state) {
      this.historyData = state.historyData;
      console.log(this.historyData)
      // this.banned = state.banned;
    }
  }

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    // this.router.navigate(['']);
  }

  ngOnInit() {
    // console.log(this.purpose, this.visitor, this.visit_date, this.banned)
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
