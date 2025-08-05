import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';

import { StorageService } from 'src/app/service/storage/storage.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Estate } from 'src/models/resident/resident.model';
import { NavigationStart, Router } from '@angular/router';

import { App } from '@capacitor/app';

@Component({
  selector: 'app-header-inner-page',
  templateUrl: './header-inner-page.component.html',
  styleUrls: ['./header-inner-page.component.scss'],
})
export class HeaderInnerPageComponent  implements OnInit {

  constructor(
    private storage: StorageService,
    public functionMain: FunctionMainService,
    private platform: Platform,
    private router: Router
  ) {}

  @Input() text: string = "";
  @Input() text_second: string = "";
  @Output() typeOfUser = new EventEmitter<any>();
  @Output() typeOfFamily = new EventEmitter<any>();
  condoImage: string = '';

  platformInfo: string = '';
  isAndroid: boolean = false;
  isIOS: boolean = false;
  isMobile: boolean = false;
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isPWA: boolean = false;
  isCordova: boolean = false;
  isCapacitor: boolean = false;
  isElectron: boolean = false;

  userType: string = '';

  ngOnInit() {
    this.initializeBackButtonHandling();
    this.platform.ready().then(() => {
      this.checkPlatform();
    });
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.condoImage = estate.project_image;
            this.userType = estate.record_type;
            this.typeOfUser.emit(this.userType);
            this.typeOfFamily.emit(estate.family_type);
          }
        })
      } 
    })
  }

  initializeBackButtonHandling() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      history.back();
    });
  }

  checkPlatform() {
    // Mendapatkan informasi platform
    this.platformInfo = this.platform.platforms().join(', ');
    
    // Memeriksa jenis platform
    this.isAndroid = this.platform.is('android');
    this.isIOS = this.platform.is('ios');
    this.isMobile = this.platform.is('mobile');
    this.isDesktop = this.platform.is('desktop');
    this.isTablet = this.platform.is('tablet');
    this.isPWA = this.platform.is('pwa');
    this.isCordova = this.platform.is('cordova');
    this.isCapacitor = this.platform.is('capacitor');
    this.isElectron = this.platform.is('electron');
  }

}
