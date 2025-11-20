import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app'
import { StorageService } from 'src/app/service/storage/storage.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, private clientMainService: ClientMainService, private authService: AuthService, private functionMain: FunctionMainService, private webrtc: WebRtcService, private platform: Platform, private storage: StorageService, private cdr: ChangeDetectorRef, private mainVmsService: MainVmsService, private alertController: AlertController) { 
    this.checkScreenSize();
    this.initializeBackButtonHandling();
  }

  alertColor = 'red'

  callActionStatus: string = '';
  private routerSubscription!: Subscription;
  ngOnInit() {
    this.webrtc.initializeSocket()
    this.initializeBackButtonHandling();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log(event['url'])
        if (event['url'].split('?')[0] == '/home-vms'){
          this.loadProjectName().then(() => {
            this.onLoadCount()
            // this.getProjectConfig()
          })
        }
      }
    });
    this.loadProjectName().then(() => {
      this.onLoadCount()
    })
    this.getRGGData()
    this.webrtc.callActionStatus.subscribe(status => {
      this.callActionStatus = status;
    });
    // this.onLoadCount()
    document.addEventListener('click', this.handleClickOutside, true);

    this.mainVmsService.configUpdated$.subscribe(() => {
      this.loadProjectName();
      this.cdr.detectChanges();
    });

  }

  getRGGData() {
    this.storage.getValueFromStorage('RGG_CALL_DATA').then(value => {
      console.log(value)
      if ( value ) {
        this.rggData = value
      } else {
        this.rggData = false
      }
    })
  }
  rggData: any = false

  initializeBackButtonHandling() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_name = value.project_name.toUpperCase()
      this.project_id = value.project_id
      this.project_config = value.config
      this.Camera = value.config.lpr
      this.Intercom = value.config.intercom
      this.fcm_token_id = value.fcm_token_id ? value.fcm_token_id : false
      this.vms_family_id = value.vms_family_id
    })
    this.storage.getValueFromStorage('USESATE_DATA').then(value => {
      if (value) {
        if (value.background) {
          this.showImage = this.functionMain.getImage(value.background)
        } else {
          this.showImage = `assets/img/focus_logo-removebg.png`
        }
      } 
    })
  }

  Camera: any = {}
  Intercom: any = {}

  showImage = `assets/img/focus_logo-removebg.png`
  async onLoadBackground() {
    this.storage.getValueFromStorage('USESATE_DATA').then(value => {
      if (value) {
        if (value.background) {
          this.showImage = this.functionMain.getImage(value.background)
        } else {
          this.showImage = `assets/img/focus_logo-removebg.png`
        }
      } 
    })
  }
  project_name = ''
  project_id = 0
  project_config: any = []
  vms_family_id: any = false
  fcm_token_id: any = false

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  pingSound = new Audio('assets/sound/Ping Alert.mp3');
  errorSound = new Audio('assets/sound/Error Alert.mp3');

  playSound() {
    if (this.alertTotal == 0) {
      this.pingSound.play().catch((err) => console.error('Error playing sound:', err));
    } else {
      this.errorSound.play().catch((err) => console.error('Error playing sound:', err));
    }
  }

  isLogoutModal = false
  project_key = ''
  
  closeModal() {
    this.isLogoutModal = false
    this.project_key = ''
  }

  onLogout() {
    if (this.project_key != '') {
      this.clientMainService.getApi({project_id: this.project_id, project_key: this.project_key, fcm_token_id: this.fcm_token_id}, '/vms/post/project_key').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.status_code === 200) {
            this.closeModal()
            this.storage.clearAllValueFromStorage();
            this.webrtc.closeSocket();
            Preferences.clear();
            setTimeout(() => {
              this.router.navigate(['/login-vms']);
            },300)
          } else {
            this.functionMain.presentToast('Project key does not match project code!', 'danger')
          }
        },
        error: (error) => {
          console.error(error);
          this.functionMain.presentToast('An error occurred while searching project!', 'danger')
        }
      });
      
    } else {
      this.functionMain.presentToast('Project key is required!', 'warning')
    }
    
  }

  onClickMoveCustom(type: string, is_time_res: boolean = false) {
    if (is_time_res && !this.project_config.is_industrial){
      this.worktimeAlert(type)
    } else {
      this.movePage(type)
    }
    
  }

  movePage(type: string) {
    if (type == 'contractor') {
      this.router.navigate(['contractor-form']);
    } else {
      this.router.navigate(['move-home'], {
        queryParams: { type: type }
      });
    }
  }

  alertTotal = 0
  totalRedAlerts = 0

  onLoadCount() {
    let params = {project_id: this.project_id}
    this.clientMainService.getApi(params, '/vms/get/offenses_count').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.alertTotal = results.result.response_result[0].total_alerts
          this.totalRedAlerts = results.result.response_result[0].total_red_alerts
        } else {
          this.alertTotal = 0
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  isSmallScreen = false;

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 530;
  }

  handleRefresh(event: any) {
    this.onLoadCount()
    this.loadConfig()
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

  isLoading = false
  async loadConfig() {
    let rggStorage: any = false
    this.isLoading = true
    this.clientMainService.getApi({project_id: this.project_id, fcm_token_id: this.fcm_token_id}, '/vms/get/current_config').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.status_code === 200) {
          Preferences.clear()
          Preferences.set({
            key: 'USER_INFO',
            value: results.result.response_status.access_token,
          }).then(()=>{

              this.storage.clearAllValueFromStorage()
              let storageData = {
                'background': results.result.response_status.background
              }
              this.storage.setValueToStorage('USESATE_DATA', storageData)
              let countryCodeData = results.result.response_status.country_codes.country_code_data
              this.storage.setValueToStorage('COUNTRY_CODES_DATA', countryCodeData)
              if (this.rggData) { 
                this.storage.setValueToStorage('RGG_CALL_DATA', this.rggData)
              }
              this.loadProjectName()
              this.webrtc.initializeSocket()
          });
          this.isLoading = false
        } else {
          this.functionMain.presentToast('An error occurred while trying to get current config!', 'danger');
          this.isLoading = false
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to get current config!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  isAway(is_reverse: boolean = false) {
    const value = is_reverse ? !String(this.vms_family_id).includes('Away') : String(this.vms_family_id).includes('Away')
    if (value) {
      return {
        away: true,
        string: 'Away',
        color: 'bg-[var(--ion-color-danger)]'
      }
    } else {
      return {
        away: false,
        string: 'Available',
        color: 'bg-[var(--ion-color-primary)]'
      }
    }
  }

  isShow = false
  isStateClicked = false
  clickState() {
    this.isStateClicked = true
    this.isShow = true
    setTimeout(() => {
      this.isStateClicked = false
    }, 500)
  }
  
  changeState() {
    const is_away = !this.isAway().away
    console.log(is_away)
    this.isShow = false
    this.clientMainService.getApi({state: is_away, fcm_token_id: this.fcm_token_id}, '/vms/post/change_device_state').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.status_code === 200) {
          this.loadConfig()
          if (results.result.info && results.result.info.is_vms_sync) {
            this.webrtc.changeStateVMS(this.project_id, results.result.info.fcm_ids)
          }
        } else {
          this.functionMain.presentToast("An error occurred while trying to change this device's states!", 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast("An error occurred while trying to change this device's states!", 'danger');
        console.error(error);
      }
    });
  }

  @ViewChild('stateComponent') stateComponent!: ElementRef;
  handleClickOutside = (event: MouseEvent) => {
    if (!this.isStateClicked && this.isShow) {
      const clickedInside = this.stateComponent.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.isShow = false;
      }
    }
  };

  public async worktimeAlert(type: string) {
    this.functionMain.checkOpenTime().then(async (value) => {
      console.log(value)
      if (!value) {
        const alertButtons = await this.alertController.create({
          cssClass: 'checkout-alert',
          header: `Can't access this menu because of the work time restriction (${this.project_config.office_opening_hours} - ${this.project_config.office_closing_hours})`,
          buttons: [
            {
              text: 'Bypass',
              role: 'confirm',
              handler: () => {
                this.movePage(type)
              },
            },
            {
              text: 'Close',
              role: 'cancel',
              handler: () => {
              },
            },
          ]
        }
        )
        await alertButtons.present();
      } else {
        this.movePage(type)
      }
    })
  }

}
