import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

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
  imageProfile: string = '';

  currentPassStore: string = '';

  showPassword: string = 'password';
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

  constructor(private router: Router, private getUserInfoService: GetUserInfoService, private authService: AuthService, public functionMain: FunctionMainService, private toastController: ToastController) {
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
      Preferences.get({key: 'CURRENT_PASS'}).then(async (value) => {
        if (value?.value) {
          this.currentPassStore = value.value;
        }
      })
    }
  }

  addMarginBottomExtend: boolean = false;

  // Fungsi untuk mengubah nilai addMarginBottomExtend
  handleFocus() {
    this.addMarginBottomExtend = true;
  }

  handleBlur() {
    this.addMarginBottomExtend = false;
  }

  onToggleShowPassword() {
    this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
  }

  onCurrentPasswordChange(event: any): void {
    const password = event.target.value;
    this.passwordForm.currentPassword = password;
  }

  onNewPasswordChange(password: string): void {
    this.passwordForm.currentPassword = password;
  }

  onConfirmPasswordChange(password: string): void {
    this.passwordForm.currentPassword = password;
  }

  onChangePassword() {
    if (this.passwordForm.currentPassword !== this.currentPassStore) {
      this.presentToast("Current password you input not match with actual current password.", 'danger');
      return
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.presentToast("New password and confirm password not match.", 'danger');
      return
    }

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

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present().then(() => {
    });;
  }
}
