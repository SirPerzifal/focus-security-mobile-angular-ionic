import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { catchError, interval, Subscription, throwError } from 'rxjs';
import { LastOneWeekInformationComponent } from 'src/app/shared/resident-components/last-one-week-information/last-one-week-information.component';
import { MainApiResidentService } from '../resident/main/main-api-resident.service';
import { StorageService } from '../storage/storage.service';
import { FunctionMainService } from '../function/function-main.service';
import { WebRtcService } from '../fs-web-rtc/web-rtc.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotifyEndOfAgreementAndPermitService extends ApiService {
  private checkInterval: Subscription | null = null;
  private lastCheckTime: number = 0;
  private checkIntervalHours = 10; // Cek setiap 10 menit
  private isModalOpen = false; // Flag untuk prevent multiple modals
  private currentModal: HTMLIonModalElement | null = null; // Simpan referensi modal yang aktif

  constructor(
    http: HttpClient,
    private modalController: ModalController,
    private mainApiResidential: MainApiResidentService,
    private storageService: StorageService,
    private functionMain: FunctionMainService,
    private webRTcService: WebRtcService,
    private router: Router,
    private mainApi: MainApiResidentService
  ) {
    super(http);
  }

  /**
   * Mulai periodic check setiap 24 jam
   */
  startPeriodicCheck() {
    if (this.checkInterval) {
      console.log('Periodic check sudah berjalan');
      return; // Sudah jalan, tidak perlu start lagi
    }

    // Cek pertama kali setelah 5 detik app dibuka
    setTimeout(() => {
      this.checkExpiryDateAccount();
    }, 5000);
    
    this.checkInterval = interval(10000).subscribe(() => {
      this.checkExpiryDateAccount();
    });

    console.log(`Periodic check started: setiap ${this.checkIntervalHours} menit`);
  }

  /**
   * Stop periodic check (untuk cleanup saat logout atau app pause)
   */
  stopPeriodicCheck() {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
      this.checkInterval = null;
      console.log('Periodic check stopped');
    }
  }

  /**
   * Check expiry date account
   * @param forceCheck - jika true, langsung cek tanpa peduli interval
   */
  async checkExpiryDateAccount(forceCheck: boolean = false) {
    const now = Date.now();
    const timeSinceLastCheck = (now - this.lastCheckTime) / (1000); // dalam menit

    // Jika bukan force check dan belum mencapai interval, skip
    if (!forceCheck && timeSinceLastCheck < this.checkIntervalHours) {
      // console.log(
      //   `Skip check, baru cek ${timeSinceLastCheck.toFixed(1)} menit yang lalu. ` +
      //   `Cek berikutnya dalam ${(this.checkIntervalHours - timeSinceLastCheck).toFixed(1)} menit`
      // );
      return;
    }

    // Check apakah user sudah login (ada data di storage)
    const userData = await this.storageService.getValueFromStorage('USESATE_DATA');
    
    if (!userData) {
      // console.log('User belum login, skip check expiry date');
      return;
    }

    // Update last check time
    this.lastCheckTime = now;

    // Prevent multiple modal jika sedang ada modal terbuka
    if (this.isModalOpen) {
      console.log('Modal sudah terbuka, skip check');
      return;
    }

    // console.log(forceCheck ? 'Force checking expiry date...' : 'Checking expiry date...');

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set ke awal hari
    try {
      this.mainApiResidential.endpointMainProcess(
        {}, 
        'get/get_expiry_last_for_helper_and_tenants'
      ).subscribe({
        next: (response: any) => {
          if (response.result.response_code !== 200) {
            // console.log('Check expiry failed:', response.result.response_message);
          } else {
            const expiryDate = new Date(response.result.expiry_date);
            expiryDate.setHours(0, 0, 0, 0); // Set ke awal hari
            // console.log("Expiry Date:", expiryDate);
            // console.log("Today Date:", today);

            const isExpired = expiryDate < today;
            // console.log("Is Expired:", isExpired);
            if (isExpired) {
              this.functionMain.presentToast('Your about to get kick out from application in 3 second because your account has reach the expiry date, please contact your household.', 'warning')
              setTimeout(() => {
                this.mainApi.endpointMainProcess({}, 'post/logout').subscribe({
                  next: (response) => {
                    if (response.result.status_code === 200) {
                      this.cleanUp();
                      this.webRTcService.closeSocket();
                      this.functionMain.logout();
                      this.router.navigate(['']);
                    } else {
                      this.cleanUp();
                      this.webRTcService.closeSocket();
                      this.functionMain.logout();
                      this.router.navigate(['']);
                    }
                  },
                  error: (error) => {
                    console.error(error);
                    this.cleanUp();
                    this.webRTcService.closeSocket();
                    this.functionMain.logout();
                    this.router.navigate(['']);
                  }
                })
              }, 3000)
            } else {
              // console.log('Tidak ada notifikasi expiry date', this.router.url);
              if (response.result.response_message && this.router.url === '/resident-home-page') {
                this.showLastOneWeekModal(response.result.response_message);
              } else {
                // console.log('Tidak ada notifikasi expiry date');
              }
            }
          }
        },
        error: (error) => {
          // console.error('Error checking expiry date:', error);
        }
      });
    } catch (error) {
      // console.error('Exception checking expiry date:', error);
    }
  }

  /**
   * Tampilkan modal informasi expiry date
   */
  private async showLastOneWeekModal(message: string) {

    // console.log(message);
    

    if (message === 'No expiry data found within 7 days') {
      return
    }

    // Prevent multiple modals
    if (this.isModalOpen || this.currentModal) {
      console.log('Modal sudah ada, skip tampilkan modal baru');
      return;
    }

    this.isModalOpen = true;

    const modal = await this.modalController.create({
      component: LastOneWeekInformationComponent,
      cssClass: 'expiry-date-of-account',
      componentProps: {
        message: message
      },
      backdropDismiss: true
    });

    // Simpan referensi modal
    this.currentModal = modal;

    // Handle ketika modal ditutup
    modal.onDidDismiss().then(() => {
      this.isModalOpen = false;
      this.currentModal = null;
      console.log('Modal closed');
    });

    await modal.present();
  }

  /**
   * Cleanup: tutup modal dan stop periodic check
   */
  async cleanUp() {
    // console.log('Starting cleanup...');
    
    // Tutup modal jika ada
    if (this.currentModal) {
      try {
        await this.currentModal.dismiss();
        // console.log('Modal dismissed');
      } catch (error) {
        // console.error('Error dismissing modal:', error);
      }
      this.currentModal = null;
      this.isModalOpen = false;
    }

    // Stop periodic check
    this.stopPeriodicCheck();
    
    // Reset last check time
    this.resetLastCheckTime();
    
    // console.log('Cleanup completed');
  }

  /**
   * Get status periodic check
   */
  isPeriodicCheckRunning(): boolean {
    return this.checkInterval !== null;
  }

  /**
   * Get waktu tersisa hingga cek berikutnya (dalam jam)
   */
  getTimeUntilNextCheck(): number {
    if (this.lastCheckTime === 0) {
      return 0;
    }
    const now = Date.now();
    const timeSinceLastCheck = (now - this.lastCheckTime) / (1000 * 60 * 60);
    const timeRemaining = this.checkIntervalHours - timeSinceLastCheck;
    return Math.max(0, timeRemaining);
  }

  /**
   * Reset last check time (untuk testing atau reset manual)
   */
  resetLastCheckTime() {
    this.lastCheckTime = 0;
    // console.log('Last check time direset');
  }
}