import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicSafeString } from '@ionic/angular';

@Component({
  selector: 'app-manage-new-card',
  templateUrl: './manage-new-card.page.html',
  styleUrls: ['./manage-new-card.page.scss'],
})
export class ManageNewCardPage implements OnInit {

  constructor(private alertController: AlertController, private router: Router) { }

  public async showAlertButtons() {
    const alertButtons = await this.alertController.create({
      cssClass: 'add-card-alert',
      header: "Your Card CVC / CVV number is a 3-digit number located at the back of your Debit/Credit Card below the magnetic stripe.",
      message: new IonicSafeString('<img src="assets/icon/resident-icon/payment-card-help.png" alt="CVC Example" style="width: 100%; max-width: 300px;"/>'),
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  ngOnInit() {
  }

}
