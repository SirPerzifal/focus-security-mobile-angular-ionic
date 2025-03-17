import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';

import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';

import { profile } from 'src/models/resident/profileModel.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit, OnDestroy{

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

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  formData = {
    unit_id: 0,
    full_name: '',
    nickname: '',
    email_address: '',
    image_family: '',
    mobile_number: '',
    type_of_residence: '',
    tenancies: {
      tenancies: '',
      end_of_tenancy_aggrement: new Date()
    }
  }

  back() {
    if (this.formData.unit_id) {
      this.router.navigate(['/family-edit-member']);
    } else {
      this.router.navigate(['/resident-settings-page']);
    }
  }

  constructor(private router: Router, private getUserInfoService: GetUserInfoService, private authService: AuthService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: any};
    if (state) {
      // console.log(state.formData);
      this.formData = state.formData;
    } 
  }

  ngOnInit() {
    if (this.formData.unit_id) {
      this.userData.name = this.formData.full_name
    } else {
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
        // // console.log(this.userId);
      })
    }
  }

  onChangePassword() {
    if (this.formData.unit_id) {
      this.authService.changePassword(this.passwordForm.newPassword, Number(this.formData.unit_id)).subscribe((result) => {
        if (result.result.response_code === 200) {
          Preferences.clear();
          this.router.navigate(['/']);
        } else {
          console.error('Error:', result.result);
        }
      })    
      // // console.log("if");
    } else {
      this.authService.changePassword(this.passwordForm.newPassword, this.userId).subscribe((result) => {
        if (result.result.response_code === 200) {
          Preferences.clear();
          this.router.navigate(['/']);
        } else {
          console.error('Error:', result.result);
        }
      })
      // console.log("else");
      
    }
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.formData = {
        unit_id: 0,
        full_name: '',
        nickname: '',
        email_address: '',
        image_family: '',
        mobile_number: '',
        type_of_residence: '',
        tenancies: {
          tenancies: '',
          end_of_tenancy_aggrement: new Date()
        }
      }
      this.userData = {
        name: '',
        name_condo: '',
        type: '',
        block: '',
        unit: '',
        email: '',
        contact: ''
      };
    }
  }

}
