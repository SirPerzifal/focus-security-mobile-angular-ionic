import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-login-process',
  templateUrl: './login-process.page.html',
  styleUrls: ['./login-process.page.scss'],
})
export class LoginProcessPage implements OnInit {

  constructor(    
    private platform: Platform,
    private webRtc: WebRtcService
  ) {}

  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  ionViewWillEnter() {
    this.webRtc.closeSocket();
    this.initializeBackButtonHandling();
    // Force video load di iOS
    if (this.isIOS()) {
      const video = document.querySelector('video');
      if (video) {
        video.load();
        video.play().catch(err => {
          console.log('Video autoplay failed:', err);
          // Show fallback background
          const fallback = document.querySelector('.video-fallback');
          if (fallback) {
            (fallback as HTMLElement).style.display = 'block';
          }
        });
      }
    }
  }

  ngOnInit() {}

  initializeBackButtonHandling() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
      console.log("tres");
      
    });
  }
}
