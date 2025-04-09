import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { profile } from 'src/models/resident/profileModel.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
@Component({
  selector: 'app-resident-settings-page',
  templateUrl: './resident-settings-page.page.html',
  styleUrls: ['./resident-settings-page.page.scss'],
})
export class ResidentSettingsPagePage implements OnInit {

  userData: profile = {
    name: '',
    name_condo: '',
    type: '',
    block: '',
    unit: '',
    email: '',
    contact: ''
  };
  userId: number = 0;
  imageProfile: string = '';

  constructor(private router: Router, private getUserInfoService: GetUserInfoService, private authService: AuthService, public functionMain: FunctionMainService, private storage: Storage) {
    storage.create();
  }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.userId = parseValue.family_id
        this.userData.name = parseValue.family_name;
      }
    })
    Preferences.get({key: 'PROFILE_IMAGE'}).then(async (value) => {
      if (value?.value) {
        this.imageProfile = value.value;
      }
    })
  }

  logout() {
    this.storage.clear()
    Preferences.clear();
    this.router.navigate(['/']);
    // this.authService.logoutProcess(this.userId).subscribe((response: any) => {
    //   if (response.result.status_code === 200) {
    //     Preferences.clear();
    //     this.router.navigate(['/']);
    //   }
    // })
  }

}
