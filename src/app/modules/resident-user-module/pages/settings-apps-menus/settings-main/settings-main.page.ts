import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { Preferences } from '@capacitor/preferences';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

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

  imageProfile: string = '';
  userName: string = '';

  // change password
  addMarginBottomExtend: boolean = false;

  showPassword: string = 'password'
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  constructor(
    private storage: StorageService,
    private route: Router,
    public functionMain: FunctionMainService
  ) { }

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      this.storage.decodeData(value).then((value: any) => {
        if ( value ) {
          const estate = JSON.parse(value) as Estate;
          this.imageProfile = estate.image_profile;
          this.userName = estate.family_name;
          Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
            if(value?.value){
              const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
              const credential = JSON.parse(decodedEstateString);
              this.passwordForm.currentPassword = credential.password;
            }
          })
        }
      })
    })
  }

  handleFocus() {
    this.addMarginBottomExtend = true;
  }

  handleBlur() {
    this.addMarginBottomExtend = false;
  }

  onToggleShowPassword() {
    if (this.showPassword === 'text') {
      this.showPassword = 'password';
    } else if (this.showPassword === 'password') {
      this.showPassword = 'text';
    }
  }

  onNewPasswordChange(event: any) {
    this.passwordForm.newPassword = event.target.value;
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

  logout() {
    this.storage.clearAllValueFromStorage();
    Preferences.clear();
    this.route.navigate([''])
  }
}
