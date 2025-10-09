import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Html5Qrcode } from 'html5-qrcode';
import { Platform } from '@ionic/angular';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Preferences } from '@capacitor/preferences';
import { StorageService } from 'src/app/service/storage/storage.service';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { CheckAppVersionService } from 'src/app/service/check-app-version/check-app-version.service';

@Component({
  selector: 'app-login-vms',
  templateUrl: './login-vms.page.html',
  styleUrls: ['./login-vms.page.scss'],
})
export class LoginVmsPage implements OnInit {

  constructor(
    private router: Router, 
    private platform: Platform, 
    private clientMainService: ClientMainService, 
    public functionMain: FunctionMainService,
    private storage: StorageService,
    private appVersionCheck: CheckAppVersionService
  ) {}

  ngOnInit() {
    this.initializeBackButtonHandling()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onClick() {
    // this.router.navigate(['/home-vms'])
    this.scanResult = ''
    this.isQrModal = true
    this.isListening = true
    this.startScanner()
  }

  onBack() {
    this.router.navigate([''])
    this.isListening = false
  }

  isQrModal = false
  closeModal() {
    this.stopScanner()
    this.isQrModal = false
    this.isListening = false
  }
  

  htmlScanner!: Html5Qrcode
  scannerId = 'reader'
  scanResult: string = ''
  startScanner(){

    const closeModalOnBack = () => {
        this.closeModal()
        window.removeEventListener('popstate', closeModalOnBack);
    };
    history.pushState({ modalOpen: true }, '');
    window.addEventListener('popstate', closeModalOnBack)

    console.log("HAI")
    this.scanResult = ''
    setTimeout(() => {
      this.htmlScanner = new Html5Qrcode(this.scannerId);
      console.log("Scanner Initialized:", this.htmlScanner);
      console.log("WORK")
      this.htmlScanner.start(
        { 
          facingMode: "environment"
        },
        {
          fps: 10,
          qrbox: {
            width: 400,
            height: 400,
          }
        },
        (decodedText) => {
          this.scanResult = decodedText
          this.closeModal()
          this.searchBarcode(this.scanResult)
          this.scanResult = ''
        },
        (errorMessage) => {
          console.log(errorMessage)
        }
        
      ).catch(err => console.log(err));
    }, 0)
    
  }

  stopScanner() {
    this.htmlScanner.stop().catch( err => console.log(err))
  }

  isListening = false;

  lastKeypressTime: number = 0;
  scanThreshold: number = 50;
  ignored_string = ''
  @HostListener('document:keydown', ['$event'])
  handleScannerInput(event: KeyboardEvent) {
    if (!this.isListening) return

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastKeypressTime;
    this.lastKeypressTime = currentTime;

    if (event.key === 'Shift') {
      return;
    } else if (event.key === 'Enter') {
      console.log(this.scanResult)
      this.closeModal()
      this.searchBarcode(this.scanResult)
      this.scanResult = '';
    } else {
      if (timeDiff < this.scanThreshold) {
        this.scanResult += this.ignored_string
        this.scanResult += event.key;
        this.ignored_string = ''
      } else {
        this.ignored_string = event.key
        console.log('Ignored human typing:', event.key);
      }
    }

  }

  async searchBarcode(barcode: string){
    console.log(barcode)
    console.log("HOY OVER HER WORK")
    if (barcode) {
      try {
        await this.getNotificationPermission();
      } catch (notificationError) {
          console.error('Failed to get notification permission:', notificationError);
      }
      this.clientMainService.getApi({barcode: barcode, fcm_token: this.fcmToken}, '/vms/post/vms_login').subscribe({
        next: (results) => {
          console.log(results.result)
          if (results.result.status_code === 200) {
            this.project_key = ''
            Preferences.set({
              key: 'USER_INFO',
              value: results.result.response_status.access_token,
            }).then(()=>{
              this.storage.clearAllValueFromStorage()
              let storageData = {
                'background': results.result.response_status.background
              }
              this.storage.setValueToStorage('USESATE_DATA', storageData)
              setTimeout(() => {
                this.router.navigate(['/home-vms']);
              }, 300)
            });
          } else {
            this.functionMain.presentToast('Project code not found!', 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while logging into VMS!', 'danger');
          console.error(error);
        }
      });
    } else {
      this.functionMain.presentToast('Project code is required!', 'warning')
    }
    
  }

  project_key = ''

  initializeBackButtonHandling() {
    // Force check saat masuk halaman ini
    this.appVersionCheck.checkVersion(true);
    console.log("tes");
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/'])
    });
  }

  fcmToken: any = ''

  async getNotificationPermission(): Promise<string> {
    try {
      // Check if PushNotifications is available
      if (typeof PushNotifications === 'undefined') {
        console.warn('PushNotifications not available.');
        return '';
      }

      // Request permissions
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        console.log('Notification permission not granted');
        return '';
      }

      // Clean up and register
      PushNotifications.removeAllListeners();
      PushNotifications.register();

      // Return promise for token registration
      return this.waitForToken();
    } catch (err) {
      console.error('Push Notification Error:', err);
      return '';
    }
  }

  private waitForToken(): Promise<string> {
    return new Promise((resolve) => {
      const TIMEOUT_MS = 10000; // Reduced from 15s to 10s
      
      const timeout = setTimeout(() => {
        this.cleanupTokenListeners();
        console.log('FCM registration timed out');
        resolve('');
      }, TIMEOUT_MS);

      const onRegistration = (token: Token) => {
        this.cleanupTokenListeners();
        if (token.value) {
          this.fcmToken = token.value;
          console.log('FCM Token received:', token.value);
          resolve(token.value);
        } else {
          resolve('');
        }
      };

      const onRegistrationError = (error: any) => {
        this.cleanupTokenListeners();
        console.error('Push notification registration error:', error);
        resolve('');
      };

      // Add listeners
      PushNotifications.addListener('registration', onRegistration);
      PushNotifications.addListener('registrationError', onRegistrationError);

      // Store cleanup function
      this.cleanupTokenListeners = () => {
        clearTimeout(timeout);
        PushNotifications.removeAllListeners();
      };
    });
  }

  private cleanupTokenListeners: () => void = () => {};
}
