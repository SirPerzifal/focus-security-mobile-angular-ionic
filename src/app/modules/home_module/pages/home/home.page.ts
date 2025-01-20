import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, private mainVmsService: MainVmsService) { }

  alertColor = 'red'

  ngOnInit() {
    this.onLoadCount()
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
        console.log(results)
        if (results.result.response_code === 200) {
          this.alertTotal = results.result.response_result[0].total_offences
        } else {
          this.alertTotal = 0
        }
        console.log(this.alertTotal)
        this.playSound()
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
