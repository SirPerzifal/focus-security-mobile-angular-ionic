import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() userName: string = 'Veeknesh';
  @Input() condoName: string = 'KingsMan Condominium';
  @Input() profileImage: string = '';
  @Input() condoImage: string = '';

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

  constructor(
    public functionMain: FunctionMainService,
    private route: Router,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.checkPlatform();
    });
  }

  backToPrev() {
    this.route.navigate(['profile-page-main']);
  }

  checkPlatform() {
    // Mendapatkan informasi platform
    this.platformInfo = this.platform.platforms().join(', ');
    const test = this.platform.platforms()
    
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
    
    console.log('Platform Information:', this.platformInfo);
    console.log('tes', test);
    
    console.log('Android:', this.isAndroid);
    console.log('iOS:', this.isIOS);
    console.log('Mobile:', this.isMobile);
    console.log('Desktop:', this.isDesktop);
    console.log('Tablet:', this.isTablet);
  }

  handleRefresh(event: any) {
    console.log(event);
    
  }
}
