import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { EstateProfile } from 'src/models/resident/auth.model';

@Component({
  selector: 'app-estate-modal',
  templateUrl: './estate-modal.page.html',
  styleUrls: ['./estate-modal.page.scss'],
})
export class EstateModalPage implements OnInit {

  profileEstate: EstateProfile[] = [];
  activeUnit : number = 0;
  isLoading: boolean = true;
  noData: boolean = false;

  constructor(
    private navParams: NavParams, 
    private storage: Storage,
    private modalController: ModalController,
    public functionMain: FunctionMainService,
  ) {
    this.storage.create();
  }

  async ngOnInit() {
    await this.storage.get('USESATE_DATA').then((value) => {
      if (value) {
        const decodedUserState = decodeURIComponent(escape(atob(value)));
        this.activeUnit = JSON.parse(decodedUserState).unit_id; // Pastikan untuk mengurai JSON
      }
    });
  
    const estate = this.navParams.get('estate');
    this.profileEstate = Object.keys(estate).map(key => ({
      family_id: estate[key]?.family_id,
      family_name: estate[key]?.family_name || '',
      image_profile: estate[key]?.image_profile || '',
      family_email: estate[key]?.family_email || '',
      family_mobile_number: estate[key]?.family_mobile_number || '',
      family_type: estate[key]?.family_type || '',
      unit_id: estate[key]?.unit_id,
      unit_name: estate[key]?.unit_name || '',
      block_id: estate[key]?.block_id,
      block_name: estate[key]?.block_name || '',
      project_id: estate[key]?.project_id,
      project_name: estate[key]?.project_name || '',
      project_image: estate[key]?.project_image || '',
    }));
  
    this.isLoading = false;
  }
  
  async chooseEstateClick(estate: any) {
    // Mengubah estate menjadi string JSON
    const estateString = JSON.stringify(estate);
    // Melakukan encoding ke Base64
    const encodedEstate = btoa(unescape(encodeURIComponent(estateString)));
    this.storage.set('USESATE_DATA', encodedEstate).then(() => {
      this.modalController.dismiss(encodedEstate);
    })
  }

}
