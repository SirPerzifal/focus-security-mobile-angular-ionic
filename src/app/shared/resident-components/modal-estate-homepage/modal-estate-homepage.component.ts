import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { StorageService } from 'src/app/service/storage/storage.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-modal-estate-homepage',
  templateUrl: './modal-estate-homepage.component.html',
  styleUrls: ['./modal-estate-homepage.component.scss'],
})
export class ModalEstateHomepageComponent  implements OnInit {

  profileEstate: Estate[] = [];
  isLoading: boolean = false;
  activeUnit : number = 0;
  noData: boolean = false;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private storage: StorageService,
    public functionMain: FunctionMainService
  ) { }

  async ngOnInit() {
    await this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if (value) {
        const decodedUserState = decodeURIComponent(escape(atob(value)));
        this.activeUnit = JSON.parse(decodedUserState).unit_id; // Pastikan untuk mengurai JSON
        console.log(JSON.parse(decodedUserState).unit_id); // Pastikan untuk mengurai JSON
      } else {
        console.log(value); // Pastikan untuk mengurai JSON
        this.activeUnit = 0
      }
    })

    const estate = this.navParams.get('estate');
    this.profileEstate = Object.keys(estate).map(key => ({
      family_id: estate[key]?.family_id,
      family_name: estate[key]?.family_name || '',
      family_nickname: estate[key]?.family_nickname || '',
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
      record_type: estate[key]?.record_type || '',
    }));
  
    this.isLoading = false;
  }

  async chooseEstateClick(estate: any) {
    // Mengubah estate menjadi string JSON
    const estateString = JSON.stringify(estate);
    // Melakukan encoding ke Base64
    const encodedEstate = btoa(unescape(encodeURIComponent(estateString)));
    this.storage.setValueToStorage('USESATE_DATA', encodedEstate).then((response: any) => {
      this.modalController.dismiss(encodedEstate);
    })
  }

}
