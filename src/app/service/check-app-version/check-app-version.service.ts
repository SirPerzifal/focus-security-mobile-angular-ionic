import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, ModalController } from '@ionic/angular';
import { catchError, interval, Subscription, throwError } from 'rxjs';
import { ApiService } from '../api.service';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { jwtDecode } from 'jwt-decode';
import { UpdateAppInformationComponent } from 'src/app/shared/resident-components/update-app-information/update-app-information.component';

@Injectable({
  providedIn: 'root'
})
export class CheckAppVersionService extends ApiService {
  private checkInterval: Subscription | null = null;
  private lastCheckTime: number = 0;
  private checkIntervalMinutes = 1; // Cek setiap 1 menit
  private hasShownModalInSession = false;
  private isChecking = false;
  
  constructor(
    http: HttpClient,
    private platform: Platform,
    private modalController: ModalController
  ) {super(http);}

  /**
   * Mulai interval check otomatis setiap 1 menit
   * Panggil method ini di app.component.ts pada ngOnInit
   */
  startPeriodicCheck() {
    if (this.checkInterval) {
      return; // Sudah jalan
    }

    // Cek pertama kali setelah 10 detik app dibuka
    setTimeout(() => {
      this.checkVersion();
    }, 10000);

    // Lalu cek setiap 1 menit
    this.checkInterval = interval(this.checkIntervalMinutes * 60 * 1000).subscribe(() => {
      this.checkVersion();
    });
  }

  /**
   * Stop periodic check (opsional, jika perlu stop saat tertentu)
   */
  stopPeriodicCheck() {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
      this.checkInterval = null;
    }
  }

  /**
   * Check version secara manual
   * Panggil di halaman tertentu: main-home-page, client-main-app, home-vms
   * pada ionViewDidEnter()
   */
  async checkVersion(forceCheck: boolean = false) {
    // Cegah multiple check bersamaan
    if (this.isChecking) {
      return;
    }

    const isVms = await this.isVmsUser();
    if (isVms && (await this.hasVmsShownToday())) {
      console.log('Skip update check for VMS: already raised today');
      return;
    }

    if (this.shouldSkipNotification()) {
      console.log('Skip notification berdasarkan preferensi user');
      return;
    }

    // Jika bukan force check, cek apakah sudah waktunya
    const now = Date.now();
    const timeSinceLastCheck = (now - this.lastCheckTime) / 1000 / 60; // dalam menit
    
    if (!forceCheck && timeSinceLastCheck < this.checkIntervalMinutes) {
      console.log('Skip check, baru cek', timeSinceLastCheck.toFixed(1), 'menit yang lalu');
      return;
    }

    this.isChecking = true;
    this.lastCheckTime = now;

    try {
      // Cek platform (hanya jalan di device, bukan browser)
      if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
        // console.log('Version check hanya jalan di device');
        this.isChecking = false;
        return;
      }

      // Get current app version dari device
      const appInfo = await App.getInfo();
      const currentVersion = appInfo.version;
      console.log('Current App Version:', currentVersion);

      // Get info dari API
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      const response: any = await this.http.post(this.baseUrl + '/get/app_detail', {jsonrpc: '2.0', params: {}}, { headers }).pipe(
        catchError(this.handleError)
      ).toPromise();
      const result = response.result;

      // Tentukan versi yang harus dibandingkan berdasarkan platform
      let latestVersion = '';
      if (this.platform.is('android')) {
        latestVersion = result.app_version_updated_android;
      } else if (this.platform.is('ios')) {
        latestVersion = result.app_version_updated_ios;
      }

      console.log('Latest Version:', latestVersion);

      // Bandingkan versi
      if (this.isVersionOutdated(currentVersion, latestVersion)) {
        console.log('Ada update tersedia!');
        await this.showUpdateModal(latestVersion, result.when_the_app_get_update);
      } else {
        console.log('App sudah up to date');
      }

    } catch (error) {
      console.error('Error saat check version:', error);
    } finally {
      this.isChecking = false;
    }
  }

  async isVmsUser(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const path = (window.location.pathname || '') + (window.location.hash || '');
        if (path.toLowerCase().includes('vms')) {
          return true;
        }
      }
      const tokenData = await Preferences.get({ key: 'USER_INFO' });
      if (tokenData?.value) {
        let rawToken = tokenData.value;
        try {
          const decodedString = decodeURIComponent(escape(atob(rawToken)));
          const credential = JSON.parse(decodedString);
          if (credential?.access_token) {
            rawToken = credential.access_token;
          }
        } catch {}
        const decoded: any = jwtDecode(rawToken);
        return !!decoded?.is_vms;
      }
      return false;
    } catch {
      return false;
    }
  }

  async hasVmsShownToday(): Promise<boolean> {
    const todayStr = new Date().toDateString();
    const localVal = localStorage.getItem('vms_last_update_modal_date');
    if (localVal === todayStr) {
      return true;
    }
    try {
      const prefVal = await Preferences.get({ key: 'vms_last_update_modal_date' });
      if (prefVal?.value === todayStr) {
        return true;
      }
    } catch {}
    return false;
  }

  async recordVmsModalShownToday(): Promise<void> {
    const todayStr = new Date().toDateString();
    localStorage.setItem('vms_last_update_modal_date', todayStr);
    try {
      await Preferences.set({ key: 'vms_last_update_modal_date', value: todayStr });
    } catch {}
  }

  private shouldSkipNotification(): boolean {
    const skipUntil = localStorage.getItem('skipUpdateNotificationUntil');
    if (skipUntil) {
      const skipDate = parseInt(skipUntil);
      if (Date.now() < skipDate) {
        console.log('User memilih skip notifikasi sampai besok');
        return true;
      } else {
        // Sudah lewat tanggal, hapus flag
        localStorage.removeItem('skipUpdateNotificationUntil');
      }
    }
    return false;
  }

  /**
   * Bandingkan versi (simple comparison)
   * Return true jika currentVersion < latestVersion
   */
  private isVersionOutdated(current: string, latest: string): boolean {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const c = currentParts[i] || 0;
      const l = latestParts[i] || 0;
      
      if (c < l) return true;
      if (c > l) return false;
    }
    
    return false; // Sama
  }

  /**
   * Tampilkan modal update
   */
  private async showUpdateModal(newVersion: string, updateDate: string) {
    const activeModal = await this.modalController.getTop();
    if (activeModal) {
      return;
    }

    const isVms = await this.isVmsUser();
    const modal = await this.modalController.create({
      component: UpdateAppInformationComponent,
      cssClass: 'update-app-information-modal',
      componentProps: {
        newVersion: newVersion,
        updateDate: updateDate,
        isVms: isVms
      },
      backdropDismiss: isVms
    });
    
    await modal.present();

    if (isVms) {
      await this.recordVmsModalShownToday();
    }

    console.log('=== UPDATE TERSEDIA ===');
    console.log('Versi Baru:', newVersion);
    console.log('Tanggal Update:', updateDate);
    console.log('Silakan update aplikasi di Play Store / App Store');
  }

  /**
   * Reset flag modal untuk testing
   * atau ketika user logout/login
   */
  resetModalFlag() {
    this.hasShownModalInSession = false;
    localStorage.removeItem('vms_last_update_modal_date');
    Preferences.remove({ key: 'vms_last_update_modal_date' }).catch(() => {});
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }

    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}