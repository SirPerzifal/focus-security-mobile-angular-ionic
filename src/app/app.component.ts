import { Component } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { App } from '@capacitor/app';
import { CheckAppVersionService } from './service/check-app-version/check-app-version.service';
import { Platform } from '@ionic/angular';
// import { Preferences } from '@capacitor/preferences';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(library: FaIconLibrary, private AppVersionService: CheckAppVersionService, public platform: Platform) {
    library.addIconPacks(fas, far, fab);
    // Preferences.set({ key: 'usePreferredTextZoom', value: 'false' });
    App.addListener('appStateChange', async ({ isActive }) => {
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Mulai periodic check setiap 2 menit
      this.AppVersionService.startPeriodicCheck();
    });
  }

}
