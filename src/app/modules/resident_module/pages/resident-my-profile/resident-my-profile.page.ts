import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

import { profile } from 'src/models/resident/profileModel.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-resident-my-profile',
  templateUrl: './resident-my-profile.page.html',
  styleUrls: ['./resident-my-profile.page.scss'],
})
export class ResidentMyProfilePage implements OnInit {

  userData: profile = {
    name: '',
    name_condo: '',
    type: '',
    block: '',
    unit: '',
    email: '',
    contact: ''
  };

  imageProfile: string = '';

  constructor(
    private router: Router,
    private getUserInfoService: GetUserInfoService,
    private authService: AuthService,
    public functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        // this.userId = parseValue.family_id
        this.userData.name = parseValue.family_name;
        this.userData.name_condo = parseValue.project_name;
        this.userData.type = parseValue.family_type;
        this.userData.block = parseValue.block_name;
        this.userData.unit = parseValue.unit_name;
        // this.userData.contact = parseValue.family_mobile_number;
        this.imageProfile = parseValue.image_profile;
      }
    })
    Preferences.get({key: 'USER_EMAIL'}).then(async (value) => {
      if (value?.value) {
        this.userData.email = value.value;
      }
    })
    Preferences.get({key: 'USER_MOBILE'}).then(async (value) => {
      if (value?.value) {
        this.userData.contact = value.value;
      }
    })
    Preferences.get({key: 'PROFILE_IMAGE'}).then(async (value) => {
      if (value?.value) {
        this.imageProfile = value.value;
      }
    })
  }

  toWhere(where: string) {
    if (where === 'ban_visitor') {
      this.router.navigate(['/history'], {
        state: {
          from: "ban",
        }
      });
    } else if (where === 'family') {
      this.router.navigate(['/resident-my-family'], {
        state: {
          from: "profile",
        }
      });
    } else if (where === 'vehicle') {
      this.router.navigate(['/resident-my-vehicle'], {
        state: {
          from: "profile",
        }
      });
    } else if (where === 'helper') {
      this.router.navigate(['/resident-my-family'], {
        state: {
          from: "helper",
        }
      });
    }
  }

}
