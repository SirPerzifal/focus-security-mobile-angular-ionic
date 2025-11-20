import { Component, Input, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-resident-header',
  templateUrl: './resident-header.component.html',
  styleUrls: ['./resident-header.component.scss'],
})
export class ResidentHeaderComponent  implements OnInit {

  constructor(private apiService: ApiService, private platform: Platform) { }

  @Input() text: string=""
  @Input() text_second: string=""
  @Input() secondClass: string=""
  @Input() is_client: boolean = false
  projectId: number = 0;
  projectImageUrl: string = '';

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

  ngOnInit() {
    this.platform.ready().then(() => {
      this.checkPlatform();
    });
    if (this.is_client) {
      this.projectImageUrl = 'assets/logoIFS.png'
    } else {
      Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
        if (value?.value) {
          const valueUseState = JSON.parse(value.value);
          this.projectId = Number(valueUseState.project_id);
          this.projectImageUrl = `${this.apiService.baseUrl}/web/image/project.project/${this.projectId}/fs_project_logo`
        }
      })
    }
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
  }

}
