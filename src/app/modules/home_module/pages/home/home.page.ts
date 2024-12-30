import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router) { }

  alertColor = 'red'

  ngOnInit() {
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    if (this.alertColor == 'green'){
      pingSound.play().catch((err) => console.error('Error playing sound:', err));
    } else if (this.alertColor == 'yellow'){
      pingSound.play().catch((err) => console.error('Error playing sound:', err));
    } else {
      errorSound.play().catch((err) => console.error('Error playing sound:', err));
    } 
  }

  onClickMoveCustom(type: string){
    this.router.navigate(['move-home'], {
      queryParams: {type: type}
    });
  }

}
