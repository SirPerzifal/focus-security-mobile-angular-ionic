import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OvernightParkingModalPage } from '../overnight-parking-modal/overnight-parking-modal.page';

@Component({
  selector: 'app-overnight-parking-detail',
  templateUrl: './overnight-parking-detail.page.html',
  styleUrls: ['./overnight-parking-detail.page.scss'],
})
export class OvernightParkingDetailPage implements OnInit {

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private modalController: ModalController) {
      const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { vehicle: any};
    if (state) {
      this.vehicle = state.vehicle
    } 
     }

  ngOnInit() {
  }

  vehicle: any

  async presentModal(issue: string= 'wheel_clamp', vehicle: any = this.vehicle) {
    const modal = await this.modalController.create({
      component: OvernightParkingModalPage,
      cssClass: issue == 'wheel_clamp' ? 'record-modal' : 'record-modal-notice',
      componentProps: {
        issue: issue,
        vehicle: vehicle
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if(result.data){
          console.log("SUCCEED")
        }
      }
    });

    return await modal.present();
  }


}
