import { Component, Input, OnInit } from '@angular/core';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.page.html',
  styleUrls: ['./incoming-call.page.scss'],
})
export class IncomingCallPage implements OnInit {

  // Received via componentProps when opened as an Ionic modal
  @Input() offer: any;
  @Input() callerName: string = '';

  constructor(private webrtc: WebRtcService) { }

  ngOnInit() {
    // If offer was not passed via @Input() (componentProps), fall back to history.state
    // (used when navigated to as a page rather than opened as a modal)
    if (!this.offer) {
      const navigation = history.state;
      if (navigation && navigation.offer) {
        this.offer = navigation.offer;
        this.callerName = navigation.callerName;
      }
    }
    // Final fallback: use the service's nativeOffer stored when the push notification arrived
    if (!this.offer) {
      this.offer = this.webrtc.nativeOffer;
    }
  }

  acceptCall(){
    // Always use the most up-to-date offer from the service as a safety fallback
    const offerToUse = this.offer || this.webrtc.nativeOffer;
    this.webrtc.acceptCall(offerToUse);
  }

  rejectCall(){
    this.webrtc.rejectCall();
  }

  getSenderProfilePic(){
    return this.webrtc.getSenderProfilePic();
  }

}
