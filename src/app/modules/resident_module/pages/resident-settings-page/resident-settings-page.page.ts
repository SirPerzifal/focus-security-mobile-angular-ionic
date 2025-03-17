import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
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

  constructor(private router: Router, private getUserInfoService: GetUserInfoService, private authService: AuthService, public functionMain: FunctionMainService) { }

  ngOnInit() {
    this.getUserInfoService.getPreferenceStorage(['user', 'family', 'type_family', 'block_name', 'unit_name']).then((value) => {
      const parse_user = this.authService.parseJWTParams(value.user);

      this.userData = {
        name: parse_user.name,
        name_condo: 'KingsMan Condo',
        type: value.type_family,
        block: value.block_name,
        unit: value.unit_name,
        email: parse_user.email,
        contact: parse_user.email,
      }
      this.userId = Number(parse_user.family_id);
      this.imageProfile = parse_user.image_profile;
      // // console.log(this.userId);
    })
  }

  logout() {
    // this.authService.logoutProcess(this.userId).subscribe((response: any) => {
    //   if (response.result.status_code === 200) {
    //     Preferences.clear();
    //     console.log("tes");
        
    //     this.router.navigate(['/']);
    //   }
    // })
    Preferences.clear();
    this.router.navigate(['/']);
  }

}
