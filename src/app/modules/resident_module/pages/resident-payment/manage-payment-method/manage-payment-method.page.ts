import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-payment-method',
  templateUrl: './manage-payment-method.page.html',
  styleUrls: ['./manage-payment-method.page.scss'],
})
export class ManagePaymentMethodPage implements OnInit {

  constructor(private router: Router, private alertController: AlertController) { }

  visa = false
  master = false

  public updateSelectedCard(selected: string){
    if(selected == 'visa'){
      this.visa = true
      this.master = false
    } else {
      this.master = true
      this.visa = false
    }
  }

  ngOnInit() {
  }

  public async showAlertButtons(card: string) {
    const alertButtons = await this.alertController.create({
      cssClass: 'manage-payment-alert',
      header: `Are you sure you want to delete the card ending with ${card}?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

}
