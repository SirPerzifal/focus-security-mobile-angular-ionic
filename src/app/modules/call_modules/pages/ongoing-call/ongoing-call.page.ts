import { Component, OnInit } from '@angular/core';
import { WebRtcService } from 'src/app/service/fs-web-rts/web-rtc.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-ongoing-call',
  templateUrl: './ongoing-call.page.html',
  styleUrls: ['./ongoing-call.page.scss'],
})
export class OngoingCallPage implements OnInit {

  localstream!: MediaStream;
  onCam: boolean = true;
  onSpeaker: boolean = true;
  onMic: boolean = true;

  constructor(private webrtc: WebRtcService, private platform: Platform) {

  }

  ngOnInit() {
    // this.webrtc.startLocalStream();
    this.webrtc.regenerateVideo();
  }

  toggleCam(){
    this.onCam = !this.onCam;
    this.webrtc.muteLocalVideo();
  }
  toggleSpeaker(){
    this.onSpeaker = !this.onSpeaker;
    this.webrtc.muteRemoteSpeaker();
  }
  toggleMic(){
    this.onMic = !this.onMic;
    this.webrtc.muteLocalAudio();
  }

  startCall(){
    this.webrtc.startLocalStream();
  }

}
