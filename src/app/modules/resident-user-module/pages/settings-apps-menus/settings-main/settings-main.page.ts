import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { Preferences } from '@capacitor/preferences';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.page.html',
  styleUrls: ['./settings-main.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class SettingsMainPage implements OnInit {

  listButtons: any[] = [
    {
      text: 'Change Password',
      isRoute: false,
      routeTo: '',
      isClick: true,
    },{
      text: 'Notification Settings',
      isRoute: false,
      routeTo: '',
      isClick: true,
    },{
      text: 'FAQ',
      isRoute: true,
      routeTo: '/info-page-settings',
      isClick: false,
    },{
      text: 'Privacy Policy',
      isRoute: true,
      routeTo: '/info-page-settings',
      isClick: false,
    },{
      text: 'App Built Details',
      isRoute: true,
      routeTo: '/info-page-settings',
      isClick: false,
    },{
      text: 'Logout',
      isRoute: false,
      routeTo: '',
      isClick: true,
    },
  ]

  pageName: string = '';
  showMain: boolean = true;
  showChangePassword: boolean = false;
  showNotificationSettings: boolean = false;

  familyId: number = 0;
  imageProfile: string = '';
  userName: string = '';

  // change password
  addMarginBottomExtend: boolean = false;

  showOldPassword: string = 'password';
  showPassword: string = 'password';
  showConfirmPassword: string = 'password';
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  currentPassword: string = '';

  //setting notification
  activeWalkVisitorAlert = false;
  activeDriveVisitorAlert = false;

  constructor(
    private storage: StorageService,
    private route: Router,
    public functionMain: FunctionMainService,
    private mainApi: MainApiResidentService,
  ) { }

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      this.storage.decodeData(value).then((value: any) => {
        if ( value ) {
          const estate = JSON.parse(value) as Estate;
          this.familyId = estate.family_id;
          this.imageProfile = estate.image_profile;
          this.userName = estate.family_name;
          Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
            if(value?.value){
              const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
              const credential = JSON.parse(decodedEstateString);
              this.currentPassword = credential.password;
            }
          })
        }
      })
    })
  }

  onClickButton(button?: any, role?: string) {
    if (button.isRoute === true) {
      this.route.navigate([button.routeTo], {
        state: {
          pageName: button.text,
        }
      });
    } else if (button.isClick === true) {
      if (button.text === 'Change Password') {
        this.pageName = button.text;
        this.showMain = false;
        this.showChangePassword = true;
        this.showNotificationSettings = false;
      } else if (button.text === 'Notification Settings') {
        this.loadNotificationAlertSettings();
        this.pageName = button.text;
        this.showMain = false;
        this.showChangePassword = false;
        this.showNotificationSettings = true;
      } else if (button.text === 'Logout') {
        this.logout();
      }
    } else if (role === 'back') {
      this.pageName = '';
      this.showMain = true;
      this.showChangePassword = false;
      this.showNotificationSettings = false;
    } 
  }

  onToggleShowPassword(type: string) {
    if (type === 'oldPassword') {
      if (this.showOldPassword === 'text') {
        this.showOldPassword = 'password';
      } else if (this.showOldPassword === 'password') {
        this.showOldPassword = 'text';
      }
    }
    if (type === 'new') {
      if (this.showPassword === 'text') {
        this.showPassword = 'password';
      } else if (this.showPassword === 'password') {
        this.showPassword = 'text';
      }
    }
    if (type === 'confirm') {
      if (this.showConfirmPassword === 'text') {
        this.showConfirmPassword = 'password';
      } else if (this.showConfirmPassword === 'password') {
        this.showConfirmPassword = 'text';
      }
    }
  }

  onNewPasswordChange(event: any, type: string) {
    if (type === 'currentPassword') {
      this.passwordForm.currentPassword = event.target.value;
    } else if (type === 'confirmPassword') {
      this.passwordForm.confirmPassword = event.target.value;
    } else if (type === 'newPassword') {
      this.passwordForm.newPassword = event.target.value;
    }
  }

  onConfirmChangePasswordClick() {
    if (this.passwordForm.currentPassword === this.currentPassword) {
      if (this.passwordForm.newPassword === this.passwordForm.confirmPassword) {
        this.mainApi.endpointProcess({
          new_password: this.passwordForm.newPassword,
          family_id: this.familyId
        }, 'post/update_password').subscribe((res: any) => {
          if (res.result.response_code === 200) {
            this.functionMain.presentToast('Change Password Success', 'success');
            this.pageName = '';
            this.showMain = true;
            this.showChangePassword = false;
            this.showNotificationSettings = false;
          }
        })
      } else {
        this.functionMain.presentToast('New Password and Confirm Password are not the same', 'danger');
      }
    } else {
      this.functionMain.presentToast('Current Password is not correct', 'danger');
    }
  }

  loadNotificationAlertSettings() {
    this.mainApi.endpointCustomProcess({
      family_id: this.familyId
    }, '/get/notification/alert/settings').subscribe((res: any) => {
      if (res.result.response_code === 200) {
        this.activeWalkVisitorAlert = res.result.response_result.is_active_walk_visitor_alert;
        this.activeDriveVisitorAlert = res.result.response_result.is_active_drive_visitor_alert;
      } else {
        this.functionMain.presentToast('Failed to notifications settings!', 'danger');
        console.log(res);
      }
    })
  }

  async onSaveChanges(){
    this.mainApi.endpointCustomProcess({
      family_id: this.familyId,
      is_active_walk_visitor_alert: this.activeWalkVisitorAlert,
      is_active_drive_visitor_alert: this.activeDriveVisitorAlert
    }, '/post/notification/alert/settings').subscribe({
      next: (response: any) => {
        if (response.result.response_code === 200) {
          this.functionMain.presentToast('Configuration update is saved!')
          this.pageName = '';
          this.showMain = true;
          this.showChangePassword = false;
          this.showNotificationSettings = false;
        } else {
          this.functionMain.presentToast('Failed to notifications settings!', 'danger');
          console.log(response);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Internal Server Error', 'danger');
        console.error('Error:', error);
      }
    });
  }

  logout() {
    this.storage.clearAllValueFromStorage();
    Preferences.clear();
    this.route.navigate([''])
  }
}
