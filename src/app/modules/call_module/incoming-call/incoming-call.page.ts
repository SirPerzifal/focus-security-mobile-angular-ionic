import { Component, OnInit } from '@angular/core';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.page.html',
  styleUrls: ['./incoming-call.page.scss'],
})
export class IncomingCallPage implements OnInit {

  offer: any;
  callerName: string = '';
  constructor(private webrtc: WebRtcService) { }

  ngOnInit() {
    const navigation = history.state;
    if (navigation && navigation.offer) {
      this.offer = navigation.offer;
      this.callerName = navigation.callerName;
    }
  }

  acceptCall(){
    this.webrtc.acceptCall(this.offer);
  }

  rejectCall(){
    this.webrtc.rejectCall();
  }

  getSenderProfilePic(){
    return this.webrtc.getSenderProfilePic();
  }

}
