import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, private mainVmsService: MainVmsService, private authService: AuthService, private functionMain: FunctionMainService, private webrtc: WebRtcService) { }

  alertColor = 'red'

  private routerSubscription!: Subscription;
  ngOnInit() {
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
    // this.onLoadCount()
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_name = value.project_name.toUpperCase()
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }
  project_name = ''
  project_id = 0
  project_config: any = []

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
      this.mainVmsService.getApi({project_id: this.project_id, project_key: this.project_key}, '/vms/get/project_key').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.status_code === 200) {
            this.closeModal()
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
    this.router.navigate(['move-home'], {
      queryParams: { type: type }
    });
  }

  alertTotal = 0

  onLoadCount() {
    let params = {project_id: this.project_id}
    this.mainVmsService.getApi(params, '/vms/get/offenses_count').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.alertTotal = results.result.response_result[0].total_alerts
        } else {
          this.alertTotal = 0
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
