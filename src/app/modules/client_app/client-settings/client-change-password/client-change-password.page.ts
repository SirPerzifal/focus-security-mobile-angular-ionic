import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-client-change-password',
  templateUrl: './client-change-password.page.html',
  styleUrls: ['./client-change-password.page.scss'],
})
export class ClientChangePasswordPage implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService, private clientMainService: ClientMainService, private storage: StorageService) { }

  userData = {
    id: '',
    name: '',
    name_condo: '',
    email: '',
    contact: '',
    designation: '',
    image_profile: '',
  };

  passwordForm = {
    id: '',
    login: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }


  ngOnInit() {
    this.loadProject();
  }

  async loadProject() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.userData = {
        id: value.user_id,
        name: value.name,
        name_condo: value.project_name,
        email: value.email,
        contact: value.contact_number ? value.contact_number : '',
        designation: value.designation ? value.designation : '',
        image_profile: '',
      }
      this.passwordForm.id = value.user_id
      this.passwordForm.login = value.email
      this.storage.getValueFromStorage('USESATE_DATA').then(value => {
        this.userData.image_profile = value.image_profile
      })
    })
  }

  onPasswordChange(password: string): void {
    this.passwordForm.currentPassword = password;
  }

  onPasswordNewChange(password: string): void {
    this.passwordForm.newPassword = password;
    this.checkMatch()
  }

  is_match = true
  checkMatch(){
    if (this.passwordForm.confirmPassword != this.passwordForm.newPassword) {
      this.is_match = false
    } else {
      this.is_match = true
    }
  }

  onPasswordConfirmChange(password: string): void {
    this.passwordForm.confirmPassword = password;
    this.checkMatch()
  }

  isMainLoading = false
  onChangePassword() {
    console.log(this.userData)
    console.log(this.passwordForm)
    if (!this.is_match) {
      return
    }
    let errMsg = ''
    if (!this.passwordForm.currentPassword) {
      errMsg += 'Current password cannot be empty! \n'
    }
    if (!this.passwordForm.newPassword) {
      errMsg += 'New password cannot be empty! \n'
    }
    if (!this.passwordForm.confirmPassword) {
      errMsg += 'Confirm password cannot be empty! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    this.clientMainService.getApi(this.passwordForm, '/client/post/password').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast('Password successfully changed!', 'success');
          this.router.navigate(['/client-settings'])
        } else if (results.result.response_code == 401) {
          this.functionMain.presentToast(results.result.response_description, 'danger');
        }
        else {
          this.functionMain.presentToast('An error occurred while updating password!', 'danger');
        }
        this.isMainLoading = false
      },
      error: (error) => {
        this.isMainLoading = false
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
    // this.authService.changePassword(this.passwordForm.newPassword, this.userId).subscribe((result) => {
    //   if (result.result.response_code === 200) {
    //     this.router.navigate(['/client-settings']);
    //   } else {
    //     console.error('Error:', result.result);
    //   }
    // })
    // this.router.navigate(['/client-settings']);
  }

}
