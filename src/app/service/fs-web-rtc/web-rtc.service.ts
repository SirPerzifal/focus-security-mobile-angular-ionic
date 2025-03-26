import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router'; // Import Router
import { Capacitor } from '@capacitor/core';
import { WebView } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import {jwtDecode} from 'jwt-decode';
import { OutgoingCallPage } from 'src/app/modules/call_module/outgoing-call/outgoing-call.page';
import { IncomingCallPage } from 'src/app/modules/call_module/incoming-call/incoming-call.page';
import { OngoingCallPage } from 'src/app/modules/call_module/ongoing-call/ongoing-call.page';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRtcService extends ApiService{
  private socket: any;
  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;
  private remoteStream!: MediaStream;
  private iceServers: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302'}];
  private activeModal: HTMLIonModalElement | null = null;
  private callerName: string = '';
  private receiverName: string = '';
  private callerSocketId: any;
  private receiverSocketId: any;
  private nativeOffer: any;
  private callAction: string = '';
  private callerId: number = 0;
  private receiverId: number = 0;
  private userName: string = '';
  private userId: number = 0;

  constructor(http: HttpClient, private platform: Platform, private router: Router, private toastController: ToastController, private modalController: ModalController) {
    super(http);
    this.initializeSocket();
  }

  private listenForNativeEvents() {
    const storedAction = localStorage.getItem('callData');
    if (storedAction) {
      const parsedAction = JSON.parse(storedAction);
      if (Array.isArray(parsedAction) && parsedAction.length > 0){
        const actionData = parsedAction[0];
        this.callerName = actionData.callerName;
        this.receiverName = actionData.receiverName;
        this.callerSocketId = actionData.callerSocketId;
        this.callAction = actionData.callAction;
        if (actionData.callAction === 'rejectCall'){
          this.rejectCall();
        }
      }
      localStorage.removeItem('callData');
    }
  }

  private resetCallData() {
    this.callerName = '';
    this.receiverName = '';
    this.callerSocketId = null;
    this.receiverSocketId = null;
    this.nativeOffer = null;
    this.callAction = '';
  }
  

  initializeSocket() {
    Preferences.get({ key: 'USER_INFO' }).then(userData => {
      
      let userInfo = {
        mobile_number: '0812345678-Security',
        family_id: '',
        name: 'Security',
        email: 'admin@example.com',
      }
      
      if (userData.value) {
        try {
          userInfo = jwtDecode<{ 
            mobile_number: string; 
            family_id: string; 
            name: string; 
            email: string; 
            exp: number;
          }>(userData.value);
        } catch (error) {
          console.error('Gagal decode token:', error);
        }
      }
      this.userName = userInfo.name ? userInfo.name : 'Security';
      this.userId = userInfo.family_id ? parseInt(userInfo.family_id, 10) || 0 : 0;
      console.log(this.callerName, " | ", userInfo);
      this.socket = io('wss://ws.sgeede.com', {
        query: { phoneNumber: userInfo.mobile_number? userInfo.mobile_number : '0812345678-Security' }
      });
      this.socket.on('offer', (offer: any) => this.handleOffer(offer));
      this.socket.on('answer', (answer: any) => this.handleAnswer(answer));
      this.socket.on('ice-candidate', (candidate: any) => this.handleICECandidate(candidate));
      this.socket.on('end-call', () => this.handleEndCall());
      this.socket.on('reject-call', () => this.handleRejectCall());
      this.socket.on('user-not-found', (data: any) => this.handleUserNotFound(data));
      this.socket.on('receiver-info', (data: any) => this.handleReceiverInfo(data));
      this.socket.on('receiver-pending-call', (data: any) => this.handleReceiverPendingCall(data));
      this.socket.on('sender-pending-call', (data: any) => this.handleSenderPendingCall(data));
      this.listenForNativeEvents();
    }).catch(error => {
      console.error('Error fetching phone info:', error);
    });
  }

  async startLocalStream(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices) {
        throw new Error('MediaDevices API not available');

      }
      const constraints = {
        video: false,
        audio: {
          echoCancellation: true, 
          noiseSuppression: true, 
          autoGainControl: true 
        }
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!navigator.mediaDevices) {
        console.error("MediaDevices API tidak tersedia!");
      }
      const videoElement: HTMLVideoElement = document.getElementById('local-video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = this.localStream;
        await videoElement.play();
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async regenerateVideo(){
    if (!navigator.mediaDevices) {
      return;
    }
    const videoElement: HTMLVideoElement = document.getElementById('local-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.srcObject = this.localStream;
      await videoElement.play();
      videoElement.muted = true;
    }
    const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
    if (remoteVideo){
      remoteVideo.srcObject = this.remoteStream;
      await remoteVideo.play();
    }
  }

  async createOffer(recordInfo:any) {
    if(!recordInfo){
      return;
    }

    const receiverPhone = recordInfo.requestor_contact_number;
    const unit_id = recordInfo.unit_id;
    const isResident = recordInfo.isResident;
    await this.startLocalStream();

    this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
      remoteVideo.srcObject = this.remoteStream;
    };

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.callerName = this.userName;
    this.callerId = this.userId;
    this.socket.emit('offer', {
      offerObj: offer,
      receiverPhone: receiverPhone,
      callerName: this.callerName,
      callerId: this.callerId,
      unitId: unit_id,
      isResident: isResident
    });
    // this.router.navigate(['/outgoing-call'], {replaceUrl: true});
  }

  async receiverConnected(){
    this.socket.emit('receiver-connected', {});
  }

  async handleOffer(offer: any) {
    await this.startLocalStream();
    if (!this.peerConnection) {
      // Inisialisasi peerConnection untuk User 2
      this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
  
      // Pastikan remote stream belum ada
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
      }
  
      // Set up ICE candidate handler
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('ice-candidate', event.candidate);
        }
      };
  
      // Set up track handler untuk remote video
      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
        const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
        if (remoteVideo) {
          remoteVideo.srcObject = this.remoteStream;
        }
      };
    } else {
    }
    this.callerName = offer.callerName;
    this.callerId = offer.callerId;
    this.receiverId = offer.receiverId;
    this.receiverName = offer.receiverName;
    this.callerSocketId = offer.callerSocketId;
    this.receiverSocketId = offer.receiverSocketId;
    await this.showIncomingCallModal(offer.offerObj);
  }


  async handleAnswer(answer: any) {
    this.callerName = answer.callerName;
    this.receiverName = answer.receiverName;
    const description = new RTCSessionDescription(answer.answerObj);
    await this.peerConnection.setRemoteDescription(description);

    await this.showOngoingCallModal(false);
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (!this.remoteStream) {
        const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
        remoteVideo.srcObject = this.remoteStream;
      }
    };
  }

  handleICECandidate(candidate: RTCIceCandidate) {
    if (this.peerConnection) {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      console.error("peerConnection is not initialized yet.");
    }
  }

  async handleSenderPendingCall(data:any){
    this.receiverSocketId = data.receiverSocketId;
    this.receiverId = data.receiverId;
  }

  async handleReceiverPendingCall(data:any){
    this.nativeOffer = data.offerObj;
    this.callerId = data.callerId;
    if (this.callAction === 'acceptCall'){
      await this.startLocalStream();
      if (!this.peerConnection) {
        // Inisialisasi peerConnection untuk User 2
        this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
    
        // Pastikan remote stream belum ada
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream();
        }
    
        // Set up ICE candidate handler
        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.socket.emit('ice-candidate', event.candidate);
          }
        };
    
        // Set up track handler untuk remote video
        this.peerConnection.ontrack = (event) => {
          this.remoteStream = event.streams[0];
          const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
          if (remoteVideo) {
            remoteVideo.srcObject = this.remoteStream;
          }
        };
      } else {
      }
    
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.nativeOffer));
    
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
    
      this.socket.emit('answer', {
        answerObj: answer,
        receiverName: this.receiverName,
        callerName: this.callerName,
        callerSocketId: this.callerSocketId,
        receiverSocketId: data.receiverSocketId,
      });
    
      await this.showOngoingCallModal(true);
    }
  }
  
  
  async acceptCall(offer: any) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
  
    this.socket.emit('answer', {
      answerObj: answer,
      receiverName: this.receiverName,
      callerName: this.callerName,
      callerSocketId: this.callerSocketId,
      receiverSocketId: this.receiverSocketId
    });
  
    await this.showOngoingCallModal(true);
  }

  async endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
    }
  
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null!;
    }
  
    if (this.socket) {
      this.socket.emit('end-call',{
        receiverSocketId: this.receiverSocketId,
        callerSocketId: this.callerSocketId
      }); 
    }
    await this.closeModal();
    this.resetCallData();
  }

  async handleEndCall(){
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
    }
  
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null!;
    }
    await this.closeModal();
    this.resetCallData();
  }

  async handleRejectCall() {
    await this.closeModal();
    this.resetCallData();
  }

  async rejectCall() {
    this.socket.emit('reject-call', {
      callerSocketId: this.callerSocketId,
      receiverSocketId: this.receiverSocketId,
      receiverId: this.receiverId,
      callerId: this.callerId,
      callerName: this.callerName
    });
    await this.closeModal();
    this.resetCallData();
  }

  muteLocalAudio() {
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  }

  muteLocalVideo() {
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    }
  }

  muteRemoteSpeaker() {
    const videoElement: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
    }
  }

  async handleReceiverInfo(data: any){
    this.callerId = data.callerId;
    this.receiverId = data.receiverId;
    this.callerName = data.callerName;
    this.receiverName = data.receiverName;
    this.callerSocketId = data.callerSocketId;
    this.receiverSocketId = data.receiverSocketId;
    await this.showOutgoingCallModal();
  }

  async handleUserNotFound(data: any){
    await this.rejectCall();
    this.presentToast(data.message, 'danger');
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  async showOutgoingCallModal() {
    this.activeModal = await this.modalController.create({
      component: OutgoingCallPage,
      componentProps: { receiverName: this.receiverName },
      backdropDismiss: false,
    });
    return await this.activeModal.present();
  }
  
  async showIncomingCallModal(offer: any) {
    this.activeModal = await this.modalController.create({
      component: IncomingCallPage,
      componentProps: { offer: offer, callerName: this.callerName },
      backdropDismiss: false,
    });
    return await this.activeModal.present();
  }
  
  async showOngoingCallModal(isReceiver: boolean) {
    if (this.activeModal) {
      await this.activeModal.dismiss();
      this.activeModal = null;
    }
    this.activeModal = await this.modalController.create({
      component: OngoingCallPage,
      componentProps: { isReceiver: isReceiver },
      backdropDismiss: false,
    });
    return await this.activeModal.present();
  }

  async closeModal() {
    if (this.activeModal) {
      await this.activeModal.dismiss();
      this.activeModal = null;
    }
  }

  getCallerName(){
    return this.callerName;
  }
  getReceiverName(){
    return this.receiverName;
  }

  getSenderProfilePic(){
    return `${this.baseUrl}/web/image/fs.residential.family/${this.callerId}/image_profile`;
  }
  getReceiverProfilePic(){
    return `${this.baseUrl}/web/image/fs.residential.family/${this.receiverId}/image_profile`;
  }
  
}
