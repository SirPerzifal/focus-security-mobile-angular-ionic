import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, private mainVmsService: MainVmsService) { }

  alertColor = 'red'

  private routerSubscription!: Subscription;
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event['url'], 'from homeeeeeee')
        if (event['url'].split('?')[0] == '/home-vms'){
          this.onLoadCount()
        } 
      } else {
        
      }
    });
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    // this.onLoadCount()
  }
  
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  pingSound = new Audio('assets/sound/Ping Alert.mp3');
  errorSound = new Audio('assets/sound/Error Alert.mp3');

  playSound() {
    if (this.alertTotal == 0){
      this.pingSound.play().catch((err) => console.error('Error playing sound:', err));
    } else {
      this.errorSound.play().catch((err) => console.error('Error playing sound:', err));
    } 
  }

  onClickMoveCustom(type: string){
    this.router.navigate(['move-home'], {
      queryParams: {type: type}
    });
  }

  alertTotal = 0

  onLoadCount() {
    let params = {}
    this.mainVmsService.getApi(params, '/vms/get/offenses_count').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          this.alertTotal = results.result.response_result[0].total_alerts
        } else {
          this.alertTotal = 0
        }
        this.playSound()
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
