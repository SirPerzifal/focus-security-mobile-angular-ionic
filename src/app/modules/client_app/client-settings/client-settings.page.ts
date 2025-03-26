import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { Preferences } from '@capacitor/preferences';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-settings',
  templateUrl: './client-settings.page.html',
  styleUrls: ['./client-settings.page.scss'],
})
export class ClientSettingsPage implements OnInit {


  constructor(private router: Router, private getUserInfoService: GetUserInfoService, private authService: AuthService, public functionMain: FunctionMainService) { }

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
        image_profile: value.image_profile ? value.image_profile : '',
      }
    })
  }

  userData = {
    id: '',
    name: '',
    name_condo: '',
    email: '',
    contact: '',
    designation: '',
    image_profile: '',
  };

  logout() {
    Preferences.clear();
    this.router.navigate(['/']);
  }

}
