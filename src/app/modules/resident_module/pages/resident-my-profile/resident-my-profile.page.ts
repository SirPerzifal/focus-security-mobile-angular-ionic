import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    this.getUserInfoService.getPreferenceStorage(['user', 'family', 'type_family', 'block_name', 'unit_name', 'project_name']).then((value) => {
      const parse_user = this.authService.parseJWTParams(value.user);

      this.userData = {
        name: parse_user.name,
        name_condo: value.project_name,
        type: value.type_family,
        block: value.block_name,
        unit: value.unit_name,
        email: parse_user.email,
        contact: parse_user.mobile_number,
      }

      this.imageProfile = parse_user.image_profile;

      // console.log(this.userData);
      
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
