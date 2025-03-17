import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';

@Component({
  selector: 'app-client-change-password',
  templateUrl: './client-change-password.page.html',
  styleUrls: ['./client-change-password.page.scss'],
})
export class ClientChangePasswordPage implements OnInit {

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
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  constructor(private router: Router, public functionMain: FunctionMainService) { }

  ngOnInit() {
    this.loadProject();
  }

  async loadProject() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.userData = {
        id: value.user_id,
        name: value.name,
        name_condo: value.project_name.join(', '),
        email: value.email,
        contact: value.contact_number ? value.contact_number : '',
        designation: value.designation ? value.designation : '',
        image_profile: value.image_profile ? value.image_profile : '',
      }
    })
  }

  onChangePassword() {
    // this.authService.changePassword(this.passwordForm.newPassword, this.userId).subscribe((result) => {
    //   if (result.result.response_code === 200) {
    //     this.router.navigate(['/client-settings']);
    //   } else {
    //     console.error('Error:', result.result);
    //   }
    // })
    console.log(this.passwordForm)
    this.router.navigate(['/client-settings']);
  }

}
