import { Component, OnInit } from '@angular/core';
import { WebRtcService } from 'src/app/service/fs-web-rts/web-rtc.service';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.page.html',
  styleUrls: ['./incoming-call.page.scss'],
})
export class IncomingCallPage implements OnInit {
  offer: any;
  constructor(private webrtc: WebRtcService) { }

  ngOnInit() {
    const navigation = history.state;
    if (navigation && navigation.offer) {
      this.offer = navigation.offer;
      console.log('Offer received:', this.offer);
    }
  }

  acceptCall(){
    this.webrtc.acceptCall(this.offer);
  }

}
