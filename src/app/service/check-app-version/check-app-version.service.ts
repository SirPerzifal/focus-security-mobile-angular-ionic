import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, ModalController } from '@ionic/angular';
import { catchError, interval, Subscription, throwError } from 'rxjs';
import { ApiService } from '../api.service';
import { App } from '@capacitor/app';
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

    // Lalu cek setiap 2 menit
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
    // this.showUpdateModal('1.0.7', '2024-07-01'); return; // Hapus ini setelah modal siap
    // Cegah multiple check bersamaan
    if (this.isChecking) {
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
        console.log('Version check hanya jalan di device');
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
      // console.log(params)
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
        // // Tampilkan modal hanya jika belum pernah ditampilkan di sesi ini
        // if (!this.hasShownModalInSession) {
        //   await this.showUpdateModal(latestVersion, result.when_the_app_get_update);
        //   this.hasShownModalInSession = true;
        // } else {
        //   console.log('Ada update tersedia! tapi modal sudah pernah ditampilkan di sesi ini');
        // }
      } else {
        console.log('App sudah up to date');
      }

    } catch (error) {
      console.error('Error saat check version:', error);
    } finally {
      this.isChecking = false;
    }
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
   * Ganti dengan modal component yang sudah kamu buat
   */
  private async showUpdateModal(newVersion: string, updateDate: string) {
    // Import modal component kamu disini
    const modal = await this.modalController.create({
      component: UpdateAppInformationComponent,
      cssClass: 'update-app-information-modal',
      componentProps: {
        newVersion: newVersion,
        updateDate: updateDate
      },
      backdropDismiss: false
    });
    
    await modal.present();

    // Sementara pakai alert sederhana (ganti dengan modal)
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