import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app'
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, private clientMainService: ClientMainService, private authService: AuthService, private functionMain: FunctionMainService, private webrtc: WebRtcService, private platform: Platform, private storage: StorageService) { 
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
    this.webrtc.callActionStatus.subscribe(status => {
      this.callActionStatus = status;
    });
    // this.onLoadCount()
  }

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
      this.fcm_token_id = value.fcm_token_id ? value.fcm_token_id : false
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
  fcm_token_id: any = false

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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

  onClickMoveCustom(type: string) {
    if (type == 'contractor') {
      // if (this.project_config.office_closing_hours) {
      //   this.functionMain.presentToast("Can't open this menu because office hours have ended!", 'danger')
      // } else {
        this.router.navigate(['contractor-form']);
      // }
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
    this.isSmallScreen = window.innerWidth < 695;
  }

  handleRefresh(event: any) {
    this.onLoadCount()
    this.loadConfig()
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

  isLoading = false
  loadConfig() {
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
            this.loadProjectName()
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

}
