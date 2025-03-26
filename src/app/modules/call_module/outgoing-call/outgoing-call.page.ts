import { Component, OnInit } from '@angular/core';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-outgoing-call',
  templateUrl: './outgoing-call.page.html',
  styleUrls: ['./outgoing-call.page.scss'],
})
export class OutgoingCallPage implements OnInit {

  receiverName: string = '';
  constructor(private webrtc: WebRtcService) { }

  ngOnInit() {
    const navigation = history.state;
    if (navigation && navigation.offer) {
      this.receiverName = navigation.receiverName;
    }
  }

  rejectCall(){
    this.webrtc.rejectCall();
  }

  getReceiverProfilePic(){
    return this.webrtc.getReceiverProfilePic();
  }

}
