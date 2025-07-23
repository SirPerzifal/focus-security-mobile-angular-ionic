import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { Preferences } from '@capacitor/preferences';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { AlertController } from '@ionic/angular';

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
      text: 'Non-Active Account',
      isRoute: false,
      route: '',
      isClick: true,
    },{
      text: 'Logout',
      isRoute: false,
      routeTo: '',
      isClick: true,
    }
  ]

  pageName: string = '';
  fromFamily: boolean = false;
  showMain: boolean = true;
  showChangePassword: boolean = false;
  showNotificationSettings: boolean = false;

  imageProfile: string = '';
  userName: string = '';
  familyId: number = 0;
  familyIdFromFamilyPage: number = 0;

  showCurrentPassword: string = 'password'
  showNewPassword: string = 'password'
  showConfirmPassword: string = 'password'
  currentPassword: string = '';
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  activeWalkVisitorAlert: boolean = false;
  activeDriveVisitorAlert: boolean = false;
  activeDoNotDisturb: boolean = false;

  constructor(
    private webRtcService: WebRtcService,
    private storage: StorageService,
    private route: Router,
    public functionMain: FunctionMainService,
    private authService: AuthService,
    private mainApi: MainApiResidentService,
    private alertController: AlertController
  ) {
    const navigation = this.route.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: any, familyId: any };
    if (state) {
      this.familyIdFromFamilyPage = state.formData.unit_id ? state.formData.unit_id : state.familyId ? state.familyId : 0;
      this.pageName = 'Change Password';
      this.showMain = false;
      this.showChangePassword = true;
      this.showNotificationSettings = false;
    } 
  }

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      this.storage.decodeData(value).then((value: any) => {
        if ( value ) {
          const estate = JSON.parse(value) as Estate;
          this.familyId = estate.family_id
          this.imageProfile = estate.image_profile;
          this.userName = estate.family_name;
        }
      })
    })
  }

  onToggleShowPassword(type: string) {
    if (type === 'current') {
      if (this.showCurrentPassword === 'text') {
        this.showCurrentPassword = 'password';
      } else if (this.showCurrentPassword === 'password') {
        this.showCurrentPassword = 'text';
      }
    } else if (type === 'new') {
      if (this.showNewPassword === 'text') {
        this.showNewPassword = 'password';
      } else if (this.showNewPassword === 'password') {
        this.showNewPassword = 'text';
      }
    } else if (type === 'confirm') {
      if (this.showConfirmPassword === 'text') {
        this.showConfirmPassword = 'password';
      } else if (this.showConfirmPassword === 'password') {
        this.showConfirmPassword = 'text';
      }
    }
  }

  onNewPasswordChange(event: any, type: string) {
    if (type === 'current') {
      this.passwordForm.currentPassword = event.target.value;
    } else if (type === 'new') {
      this.passwordForm.newPassword = event.target.value;
    } else if (type === 'confirm') {
      this.passwordForm.confirmPassword = event.target.value;
    }
  }

  onSubmitChangePassword() {
    console.log(this.currentPassword, this.passwordForm);
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.functionMain.presentToast("New password and confirm password not match.", 'danger');
      return
    }

    if (this.fromFamily) {
      this.authService.changePassword(this.passwordForm.currentPassword, this.passwordForm.newPassword, this.familyIdFromFamilyPage).subscribe((result) => {
        if (result.result.response_code === 200) {
          this.route.navigate(['/family-main']);
          this.functionMain.presentToast(result.result.response_message, 'success');
        } else if (result.result.response_code === 400) {
          this.functionMain.presentToast(result.result.response_message, 'danger');
        } else {
          this.functionMain.presentToast(result.result.response_message, 'danger');
        }
      })    
      // // console.log("if");
    } else {
      this.authService.changePassword(this.passwordForm.currentPassword, this.passwordForm.newPassword, this.familyId).subscribe((result) => {
        if (result.result.response_code === 200) {
          this.pageName = '';
          this.showMain = true;
          this.showChangePassword = false;
          this.showNotificationSettings = false;
          this.functionMain.presentToast(result.result.response_message, 'success');
        } else if (result.result.response_code === 400) {
          this.functionMain.presentToast(result.result.response_message, 'danger');
        } else {
          this.functionMain.presentToast(result.result.response_message, 'danger');
        }
      })
      // console.log("else");
      
    }
  }

  onInputNotificationSettings(type: string) {
    if (type === 'walkVisitorAlert') {
      this.activeWalkVisitorAlert = !this.activeWalkVisitorAlert;
    } else if (type === 'driveVisitorAlert') {
      this.activeDriveVisitorAlert = !this.activeDriveVisitorAlert;
    } else if (type === 'doNotDisturb') {
      console.log('Do Not Disturb Toggled', this.activeDoNotDisturb, this.activeWalkVisitorAlert, this.activeDriveVisitorAlert);
      
      this.activeWalkVisitorAlert = false;
      this.activeDriveVisitorAlert = false;
      this.activeDoNotDisturb = !this.activeDoNotDisturb;
    }
  }

  async onSaveChanges(){
    this.mainApi.endpointCustomProcess({
      family_id: this.familyId, 
      is_active_walk_visitor_alert: this.activeWalkVisitorAlert, 
      is_active_drive_visitor_alert: this.activeDriveVisitorAlert,
      is_do_not_disturb: this.activeDoNotDisturb
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

        this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
          this.storage.decodeData(value).then((value: any) => {
            if ( value ) {
              const estate = JSON.parse(value) as Estate;
              this.familyId = estate.family_id
              Preferences.get({key: 'USER_INFO'}).then(async (value) => {
                if(value?.value){
                  const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
                  const credential = JSON.parse(decodedEstateString);
                  this.currentPassword = credential.password;
                }
              })
            }
          })
        })
      } else if (button.text === 'Notification Settings') {
        this.pageName = button.text;
        this.showMain = false;
        this.showChangePassword = false;
        this.showNotificationSettings = true;
        this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
          this.storage.decodeData(value).then((value: any) => {
            if ( value ) {
              const estate = JSON.parse(value) as Estate;
              this.familyId = estate.family_id;
              this.mainApi.endpointCustomProcess({
                family_id: this.familyId
              }, '/get/notification/alert/settings').subscribe({
                next: (response: any) => {
                  if (response.result.response_code === 200) {
                    this.activeWalkVisitorAlert = response.result.response_result.is_active_walk_visitor_alert;
                    this.activeDriveVisitorAlert = response.result.response_result.is_active_drive_visitor_alert;
                    this.activeDoNotDisturb = response.result.response_result.is_do_not_disturb;
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
          })
        })
      } else if (button.text === 'Logout') {
        this.logout();
      } else if (button.text === 'Non-Active Account') {
        console.log('Non-Active Account Clicked');
        this.isModalNonActivateAccount = true;
      }
    } else if (role === 'back') {
      if (this.familyIdFromFamilyPage) {
        this.route.navigate(['/family-page-main'])
      } else {
        this.pageName = '';
        this.showMain = true;
        this.showChangePassword = false;
        this.showNotificationSettings = false;
      }
    } 
  }

  reasonForNonActiveAccount: string = '';
  closeModalNonActivateAccount() {
    this.reasonForNonActiveAccount = '';
    this.isModalNonActivateAccount = false;
  }

  public async showAlertButtons(type: string = 'non-active') {
    this.closeModalNonActivateAccount();
    const alertButtons = await this.alertController.create({
      cssClass: 'non-active-account-alert',
      header: `Are you sure you want to ${type} this account?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.nonActiveAccount();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  isModalNonActivateAccount: boolean = false;
  nonActiveAccount() {
    this.mainApi.endpointCustomProcess({
      reason_for_non_active_account: this.reasonForNonActiveAccount,
      family_id: this.familyId
    }, '/unactive_account_user').subscribe((response: any) => {
      if (response.result.status_code === 200) {
        this.closeModalNonActivateAccount();
        this.logout();
      }
    })
  }

  logout() {
    this.mainApi.endpointProcess({
      family_id: this.familyId
    }, 'post/logout').subscribe({
      next: (response) => {
        if (response.result.status_code === 200) {
          this.clearSet()
        } else {
          this.clearSet()
        }
      },
      error: (error) => {
        console.error(error);
        this.clearSet()
      }
    })
  }

  clearSet() {
    this.webRtcService.closeSocket();
    this.storage.clearAllValueFromStorage();
    Preferences.clear();
    this.route.navigate(['']);

  }
}
