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
import { SplashCallPage } from 'src/app/modules/call_module/splash-call/splash-call.page';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../resident/authenticate/authenticate.service';
import { StorageService } from '../storage/storage.service';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { registerPlugin } from '@capacitor/core';
interface RingtonePlugin {
  play(): Promise<void>;
  stop(): Promise<void>;
}

const Ringtone = registerPlugin<RingtonePlugin>('Ringtone', {
  android: {
    pkg: 'com.sgeede.focus.security.plugin',
    class: 'RingtonePlugin'
  }
});


@Injectable({
  providedIn: 'root'
})
export class WebRtcService extends ApiService{
  private socket: any;
  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;
  private remoteStream!: MediaStream;
  // private iceServers: RTCIceServer[] = [
  //   { urls: 'stun:stun.l.google.com:19302'},
  // ];
  // private iceServers: RTCIceServer[] = [
  //   {
  //     urls: ['stun:fastturn.pro:3478']
  //   },
  //   {
  //     urls: 'turn:fastturn.pro:3478?transport=udp',
  //     username: 'Dendy',
  //     credential: 'Kepulauan_2504',
  //   },
  //   {
  //     urls: 'turn:fastturn.pro:3478?transport=tcp',
  //     username: 'Dendy',
  //     credential: 'Kepulauan_2504',
  //   },
  //   {
  //     urls: 'turns:fastturn.pro:5349?transport=tcp',
  //     username: 'Dendy',
  //     credential: 'Kepulauan_2504',
  //   }
  //   // { urls: 'stun:fastturn.pro:3478', 'username': 'Dendy', 'credential': 'Kepulauan_2504' },
  //   // { urls: 'stun:fastturn.pro:5349', 'username': 'Dendy', 'credential': 'Kepulauan_2504' },
  //   // { urls: 'turn:fastturn.pro:3478', 'username': 'Dendy', 'credential': 'Kepulauan_2504' },
  //   // { urls: 'turns:fastturn.pro:5349', 'username': 'Dendy', 'credential': 'Kepulauan_2504' }
  // ];
  private iceServers: RTCIceServer[] = [
    {
        "urls": "stun:global.expressturn.com:3478"
    },
    {
        "urls": "turn:global.expressturn.com:3478?transport=tcp",
        "username": "000000002069735707",
        "credential": "XPhTaFvw/tTqebCxbtUdV5Tsfgw="
    }
  ];
  private activeModal: HTMLIonModalElement | null = null;
  private callerName: string = '';
  private receiverName: string = '';
  private callerSocketId: any;
  private receiverSocketId: any;
  private nativeOffer: any;
  private targetSocketIds: any;
  private project_id: any;
  private callAction: string = '';
  private callerId: number = 0;
  private receiverId: number = 0;
  private userName: string = '';
  private userId: number = 0;
  private modalLock = false;
  private pendingCandidates: RTCIceCandidate[] = [];
  private callerpendingCandidates: RTCIceCandidate[] = [];
  private remoteDescriptionSet = false;
  audioStatus = new BehaviorSubject<string>('');
  callActionStatus = new BehaviorSubject<string>('');

  constructor(http: HttpClient, private storage: StorageService, private toastController: ToastController, private modalController: ModalController, 
    private router:Router, private platform:Platform) {
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
        this.callActionStatus.next(actionData.callAction);
        // if (actionData.callAction === 'rejectCall'){
        //   this.rejectCall();
        // }
      }
      localStorage.removeItem('callData');
    }
  }

  async presentSingletonModal(component: any, componentProps: any = {}) {
    if (this.modalLock) return;
    this.modalLock = true;

    try {
      // Tutup semua modal aktif terlebih dahulu
      let topModal = await this.modalController.getTop();
      while (topModal) {
        try {
          await topModal.dismiss();
        } catch (e) {
          console.warn('Gagal dismiss modal:', e);
        }
        topModal = await this.modalController.getTop();
      }

      const modal = await this.modalController.create({
        component,
        componentProps,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then(() => {
        this.modalLock = false;
      });

      await modal.present();
    } catch (e) {
      console.error('Gagal membuka modal:', e);
      this.modalLock = false;
    }
    this.callActionStatus.next('');
  }

  // async showSplashScreen(){
  //   if (this.activeModal) {
  //     await this.activeModal.dismiss();
  //     this.activeModal = null;
  //   }
  //   this.activeModal = await this.modalController.create({
  //     component: SplashCallPage,
  //     backdropDismiss: false,
  //   });
  //   return await this.activeModal.present();
  // }

  //  async showOutgoingCallModal() {
  //   if (this.activeModal) {
  //     await this.activeModal.dismiss();
  //     this.activeModal = null;
  //   }
  //   this.activeModal = await this.modalController.create({
  //     component: OutgoingCallPage,
  //     componentProps: { receiverName: this.receiverName },
  //     backdropDismiss: false,
  //   });
  //   return await this.activeModal.present();
  // }
  
  // async showIncomingCallModal(offer: any) {
  //   if (this.activeModal) {
  //     await this.activeModal.dismiss();
  //     this.activeModal = null;
  //   }
  //   await this.playRingtone();
  //   this.activeModal = await this.modalController.create({
  //     component: IncomingCallPage,
  //     componentProps: { offer: offer, callerName: this.callerName },
  //     backdropDismiss: false,
  //   });
  //   return await this.activeModal.present();
  // }
  
  // async showOngoingCallModal(isReceiver: boolean) {
  //   if (this.activeModal) {
  //     await this.activeModal.dismiss();
  //     this.activeModal = null;
  //   }
  //   this.activeModal = await this.modalController.create({
  //     component: OngoingCallPage,
  //     componentProps: { isReceiver: isReceiver },
  //     backdropDismiss: false,
  //   });
  //   return await this.activeModal.present();
  // }

  async showIncomingCallModal(offer: any) {
    if (this.callerName) {
      await this.playRingtone();
      return this.presentSingletonModal(IncomingCallPage, {
        offer: offer,
        callerName: this.callerName,
      });
    }
  }

  async showOutgoingCallModal() {
    return this.presentSingletonModal(OutgoingCallPage, {
      receiverName: this.receiverName,
    });
  }

  async showOngoingCallModal(isReceiver: boolean) {
    const topModal = await this.modalController.getTop();
    if (topModal) {
      try {
        await topModal.dismiss();
      } catch (e) {
        console.warn('Gagal dismiss modal lama:', e);
      }
    }
    return this.presentSingletonModal(OngoingCallPage, {
      isReceiver,
    });
  }

  async showSplashScreen() {
    return this.presentSingletonModal(SplashCallPage);
  }

  private async resetCallData() {
    try {
      if (this.activeModal) {
        await this.activeModal.dismiss();
        this.activeModal = null;
      }
  
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null!;
      }
  
      this.remoteStream = null!;
  
      if (this.peerConnection) {
        this.peerConnection.onicecandidate = null;
        this.peerConnection.ontrack = null;
        this.peerConnection.onconnectionstatechange = null;
        this.peerConnection.close();
        this.peerConnection = null!;
      }
  
      this.callerName = '';
      this.receiverName = '';
      this.callerSocketId = null;
      this.receiverSocketId = null;
      this.nativeOffer = null;
      this.targetSocketIds = null;
      this.project_id = null;
      this.callAction = '';
      this.pendingCandidates = [];
      this.callerpendingCandidates = [];
      this.remoteDescriptionSet = false;
      this.callActionStatus.next('');
  
      localStorage.removeItem('callData');
    } catch (error) {
      console.error("Error during clearCallData:", error);
    }
  }
  

  // initializeSocket() {
    
  //   this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
  //     this.storage.decodeData(value).then(async (value: any) => {

  //       if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
  //         this.socket.close();
  //       }

  //       let userInfo = {
  //         family_mobile_number: 'Public-User',
  //         family_id: '',
  //         family_name: 'Security',
  //         email: 'admin@example.com',
  //       }

  //       let clientInfo;
        
  //       if (value) {
  //         userInfo = JSON.parse(value);
  //         console.log("userInfo", userInfo)
  //       }

  //       if (!userInfo.family_id){
  //         console.log("masukk kesini");
  //         const clientData = await Preferences.get({ key: 'USER_INFO' });
  //         if (clientData.value) {
  //           let parsedClient = jwtDecode(clientData.value) as {name:string, family_id:number};
  //           userInfo.family_name = parsedClient.name;
  //           userInfo.family_id = parsedClient.family_id ? parsedClient.family_id.toString() : '';
  //         }
  //       }
        
  //       // this.presentToast(JSON.stringify(userInfo), 'danger');
  //       console.log("hereeee -->", userInfo);
  //       this.userName = userInfo.family_name ? userInfo.family_name : 'Security';
  //       this.userId = userInfo.family_id ? parseInt(userInfo.family_id, 10) || 0 : 0;
  //       this.socket = io('wss://ws.sgeede.com', {
  //         query: { uniqueId: userInfo.family_id ? userInfo.family_id : 'Public-User' }
  //       });
  //       this.socket.on('offer', (offer: any) => this.handleOffer(offer));
  //       this.socket.on('answer', (answer: any) => this.handleAnswer(answer));
  //       this.socket.on('ice-candidate', (candidate: any) => this.handleICECandidate(candidate));
  //       this.socket.on('end-call', () => this.handleEndCall());
  //       this.socket.on('reject-call', () => this.handleRejectCall());
  //       this.socket.on('user-not-found', (data: any) => this.handleUserNotFound(data));
  //       this.socket.on('receiver-info', (data: any) => this.handleReceiverInfo(data));
  //       this.socket.on('receiver-pending-call', (data: any) => this.handleReceiverPendingCall(data));
  //       this.socket.on('sender-pending-call', (data: any) => this.handleSenderPendingCall(data));
  //       this.listenForNativeEvents();
  //     }).catch(error => {
  //       console.error('Error fetching phone info:', error);
  //     });
  //   });
  // }

  async initializeSocket() {
    console.log("RUN INITIAL SOCKET")
    try {
      let userInfo = {
        family_mobile_number: 'Public-User',
        family_id: '',
        family_name: 'Security',
        email: 'admin@example.com',
      };
  
      // Coba ambil dari USESTATE_DATA
      // if (this.callAction){
      //   this.showSplashScreen();
      // }
      const storedValue = await this.storage.getValueFromStorage('USESATE_DATA');
      if (storedValue) {
        try {
          const decoded = await this.storage.decodeData(storedValue);
          if (decoded) {
            const parsedResident = JSON.parse(decoded);
            if (parsedResident.family_id) {
              userInfo = parsedResident;
              console.log("Got userInfo from USESTATE_DATA", userInfo);
            }
          }
        } catch {
        }
      }

      if (!userInfo.family_id) {
        const clientData = await Preferences.get({ key: 'USER_INFO' });
        if (clientData.value) {
          const parsedClient = jwtDecode(clientData.value) as { name: string; family_id: number };
          if (parsedClient.family_id) {
            userInfo.family_name = parsedClient.name;
            userInfo.family_id = parsedClient.family_id.toString();
            console.log("Got userInfo from USER_INFO", userInfo);
          }
        }
      }

      if (!userInfo.family_id) {
        const vmsData = await Preferences.get({ key: 'USER_INFO' }).then((result) => {
          if (result.value) {
            const parsedVMS = jwtDecode(result.value) as {project_name: string; project_id: number};
            if (parsedVMS.project_id && parsedVMS.project_name){
              userInfo.family_name = parsedVMS.project_name;
              userInfo.family_id = 'Project-' + parsedVMS.project_id.toString();
            }
          }
        });
      }
  
      // Set default kalau tetap kosong
      if (!userInfo.family_id) {
        userInfo.family_mobile_number = 'Public-User';
        userInfo.family_id = 'Public-User';
        userInfo.family_name = 'Security';
        console.log("Fallback to default userInfo", userInfo);
      }
  
      // Tutup socket lama jika ada
      if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
        this.socket.close();
      }
  
      // Setup user
      this.userName = userInfo.family_name || 'Security';
      this.userId = userInfo.family_id ? parseInt(userInfo.family_id, 10) || 0 : 0;
  
      // Connect ke WebSocket
      this.socket = io('wss://ws.sgeede.com', {
        query: { uniqueId: userInfo.family_id || 'Public-User' },
      });
  
      // Register event handlers
      this.socket.on('offer', (offer: any) => this.handleOffer(offer));
      this.socket.on('answer', (answer: any) => this.handleAnswer(answer));
      this.socket.on('ice-candidate', (candidate: any) => this.handleICECandidate(candidate));
      this.socket.on('end-call', () => this.handleEndCall());
      this.socket.on('reject-call', () => this.handleRejectCall());
      this.socket.on('user-not-found', (data: any) => this.handleUserNotFound(data));
      this.socket.on('receiver-info', (data: any) => this.handleReceiverInfo(data));
      this.socket.on('receiver-pending-call', (data: any) => this.handleReceiverPendingCall(data));
      this.socket.on('sender-pending-call', (data: any) => this.handleSenderPendingCall(data));
      this.socket.on('open-modal-call', (data: any) => this.handleOngoingCallModal());
      this.socket.on('kick-user', (data:any)=> this.handleKickUser(data));
  
      // Listen for native events
      this.listenForNativeEvents();
  
    } catch (error) {
      console.error('Error during socket initialization:', error);
    }
  }

  closeSocket(){
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.close();
    }
  }

  async playRingtone() {
    if (Capacitor.getPlatform() === 'android') {
      try {
        await Ringtone.play();
      } catch (err) {
        console.error('Ringtone error:', err);
      }
    } else {
      console.log('Ringtone not supported on this platform.');
    }
  }

  async stopRingtone() {
    if (Capacitor.getPlatform() === 'android') {
      try {
        await Ringtone.stop();
      } catch (err) {
        console.error('Ringtone error:', err);
      }
    } else {
      console.log('Ringtone not supported on this platform.');
    }
  }

  async startLocalStream(): Promise<boolean> {
    try {
      // 1. Cek apakah MediaDevices API tersedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('MediaDevices API or getUserMedia not available');
        return false;
      }

      // 2. iOS-specific constraints - lebih konservatif
      const constraints = {
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // iOS Safari kadang bermasalah dengan constraint tambahan
          // Hapus atau simplify jika masih bermasalah
          sampleRate: 44100, // iOS prefer standard sample rate
          channelCount: 1     // Mono audio untuk iOS
        }
      };

      console.log('Requesting media permissions...');
      
      // 3. Request stream dengan error handling yang lebih detail
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!this.localStream) {
        console.error('Failed to get media stream');
        return false;
      }

      console.log('Media stream obtained successfully');

      // 4. Handle video element dengan iOS-specific considerations
      const videoElement: HTMLVideoElement = document.getElementById('local-video') as HTMLVideoElement;
      if (videoElement) {
        // iOS Safari memerlukan properti tambahan
        videoElement.srcObject = this.localStream;
        videoElement.muted = true; // Penting untuk iOS - hindari feedback
        videoElement.playsInline = true; // Crucial untuk iOS - hindari fullscreen
        videoElement.autoplay = true; // iOS Safari memerlukan autoplay
        
        // iOS Safari kadang memerlukan user interaction untuk play
        try {
          await videoElement.play();
          console.log('Video element playing successfully');
        } catch (playError) {
          console.warn('Auto-play failed, might need user interaction:', playError);
          // Untuk iOS, kadang perlu user click untuk trigger play
          // Anda bisa show button "Tap to start" jika auto-play gagal
        }
      } else {
        console.warn('Video element not found');
      }

      return true;
    } catch (error) {
      console.error('Error starting local stream:', error);
      
    // Type guard untuk error handling
    if (error instanceof Error) {
      // Detail error handling untuk debugging
      if (error.name === 'NotAllowedError') {
        console.error('Permission denied by user');
      } else if (error.name === 'NotFoundError') {
        console.error('No audio input device found');
      } else if (error.name === 'NotReadableError') {
        console.error('Audio device is already in use');
      } else if (error.name === 'OverconstrainedError') {
        console.error('Constraints cannot be satisfied');
      } else if (error.name === 'SecurityError') {
        console.error('Security error - HTTPS required');
      }
    } else {
      console.error('Unknown error type:', error);
    }
      
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

  async createOffer(receiverPhone:any=false, receiverId:any=false, unit_id: any=false, isResident: any=false) {
    if(!receiverId && !receiverPhone && !unit_id){
      return;
    }

    await this.startLocalStream();

    this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers, iceTransportPolicy: 'all' });

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
        this.callerpendingCandidates.push(event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
      remoteVideo.srcObject = this.remoteStream;
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection.iceConnectionState;

      switch (state) {
        case "checking":
          this.updateAudioStatus("Connecting audio...");
          break;
        case "connected":
        case "completed":
          this.updateAudioStatus("Audio connected");
          break;
      }
    };

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.callerName = this.userName;
    this.callerId = this.userId;
    this.socket.emit('offer', {
      offerObj: offer,
      receiverPhone: receiverPhone,
      receiverId: receiverId,
      callerName: this.callerName,
      callerId: this.callerId,
      unitId: unit_id,
      isResident: isResident
    });

    return 'done'
  }

  async receiverConnected(){
    this.socket.emit('receiver-connected', {});
  }

  async handleOffer(offer: any) {
    await this.startLocalStream();
    if (!this.peerConnection) {
      this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers, iceTransportPolicy: 'all' });
  
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
      }
  
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('ice-candidate', event.candidate);
        }
      };
  
      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
        const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
        if (remoteVideo) {
          remoteVideo.srcObject = this.remoteStream;
        }
      };
      this.peerConnection.oniceconnectionstatechange = () => {
        const state = this.peerConnection.iceConnectionState;

        switch (state) {
          case "checking":
            this.updateAudioStatus("Connecting audio...");
            break;
          case "connected":
          case "completed":
            this.updateAudioStatus("Audio connected");
            break;
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
    this.targetSocketIds = offer.targetSocketIds;
    this.project_id = offer.project_id;
    await this.showIncomingCallModal(offer.offerObj);
  }
  
  async handleAnswer(answer: any) {
    await this.stopRingtone();
    
    this.callerName = answer.callerName;
    this.receiverName = answer.receiverName;
    this.receiverSocketId = answer.receiverSocketId;
    const description = new RTCSessionDescription(answer.answerObj);
    await this.peerConnection.setRemoteDescription(description);
    this.remoteDescriptionSet = true;
    for (const candidate of this.pendingCandidates) {
      await this.peerConnection.addIceCandidate(candidate);
    }

    await this.showOngoingCallModal(false);
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (!this.remoteStream) {
        const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
        remoteVideo.srcObject = this.remoteStream;
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection.iceConnectionState;

      switch (state) {
        case "checking":
          this.updateAudioStatus("Connecting audio...");
          break;
        case "connected":
        case "completed":
          this.updateAudioStatus("Audio connected");
          break;
      }
    };
  }

  async handleICECandidate(candidate: RTCIceCandidate): Promise<void> {
    const iceCandidate = new RTCIceCandidate(candidate);
    if (this.remoteDescriptionSet) {
      await this.peerConnection.addIceCandidate(iceCandidate);
    } else {
      this.pendingCandidates.push(iceCandidate);
    }
  }

  async handleSenderPendingCall(data:any){
    this.receiverSocketId = data.receiverSocketId;
    this.receiverId = data.receiverId;

    for (const candidate of this.callerpendingCandidates) {
      this.socket.emit('ice-candidate', candidate);
    }
  }

  family_id: any = false
  decoded: any = {}
  async handleKickUser(data:any) {
    this.family_id = false
    this.decoded = {}
    const clientData = (await Preferences.get({ key: 'USER_INFO' })).value;
    const storedValue = await this.storage.getValueFromStorage('USESATE_DATA');
    if (clientData) {
      try {
        // console.log("THING 1")
        this.decoded = jwtDecode(clientData)
        this.family_id = this.decoded.family_id
        // console.log(this.decoded)
      } catch (error) {
        this.decoded = JSON.parse(await this.storage.decodeData(storedValue));
        // console.log(this.decoded)
        this.family_id = this.decoded.family_id
      }
    } else if (storedValue) {
      try {
        this.decoded = JSON.parse(await this.storage.decodeData(storedValue));
        // console.log(this.decoded)
        this.family_id = this.decoded.family_id
      } catch (error) {
        console.log(error)
        this.decoded ={}
        this.family_id = false
      }
    } else {
      this.decoded ={}
      this.family_id = false
    }
    if (this.family_id) {
      this.http.post<any>(`${this.baseUrl}/get/fcm_token`, {jsonrpc: '2.0', params: {family_id: this.family_id}}).subscribe(
        res => {
          console.log(res)
          if (res.result['status_code'] == 200) {
            var fcm_token = res.result['status_desc'];
            this.getFCMToken().then(token => {
              if(token != fcm_token){
                console.log(this.platform.platforms(), this.platform.platforms().join(', '));
                
                const isDesktop = this.platform.is('mobileweb') || this.platform.is('desktop');
                console.log("Is Dekstop", isDesktop);
                
                if (isDesktop) {
                  console.log("Your in desktop device", isDesktop);
                } else {
                  this.presentToast('Your about to get kick out from application in 3 second because your account has been login on another device.', 'warning')
                  console.log('Your about to get kick out from application in 3 second because your account has been login on another device.', 'warning');
                  setTimeout(()=>{
                    this.closeSocket();
                    this.storage.clearAllValueFromStorage();
                    Preferences.clear();
                    this.router.navigate(['']);
                  }, 3000)
                }
              }else{
              }
            });
          } else {
            console.log("ERROR OVER HEY")
          }
        },
        error => {
          console.log(error)
        }
      )          
    }
  }

  async getFCMToken(): Promise<string | null> {
    try {
      if (!Capacitor.isNativePlatform()) {
        return null;
      }

      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        return null;
      }

      return new Promise((resolve, reject) => {
        PushNotifications.addListener('registration', (token) => {
          resolve(token.value);
        });

        PushNotifications.addListener('registrationError', (error) => {
          reject(null);
        });

        PushNotifications.register();
      });
    } catch (error) {
      return null;
    }
  }

  async handleReceiverPendingCall(data:any){
    this.nativeOffer = data.offerObj;
    this.callerId = data.callerId;
    this.callerSocketId = data.callerSocketId;
    this.receiverSocketId = data.receiverSocketId;
    this.targetSocketIds = data.targetSocketIds;
    this.project_id = data.project_id;
    if (this.callAction === 'acceptCall'){
      await this.startLocalStream();
      if (!this.peerConnection) {
        // Inisialisasi peerConnection untuk User 2
        this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers, iceTransportPolicy: 'all' });
    
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
        this.peerConnection.oniceconnectionstatechange = () => {
          const state = this.peerConnection.iceConnectionState;

          switch (state) {
            case "checking":
              this.updateAudioStatus("Connecting audio...");
              break;
            case "connected":
            case "completed":
              this.updateAudioStatus("Audio connected");
              break;
          }
        };
      } else {
      }
    
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.nativeOffer));
      this.remoteDescriptionSet = true;
      for (const candidate of this.pendingCandidates) {
        await this.peerConnection.addIceCandidate(candidate);
      }
    
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
    }else if (this.callAction === 'rejectCall'){
      this.rejectCall();
    // }else if(this.callAction === 'openDialogCall'){
    }else {
      await this.startLocalStream();
      if (!this.peerConnection) {
        this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers, iceTransportPolicy: 'all' });
    
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream();
        }
    
        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.socket.emit('ice-candidate', event.candidate);
          }
        };
    
        this.peerConnection.ontrack = (event) => {
          this.remoteStream = event.streams[0];
          const remoteVideo: HTMLVideoElement = document.getElementById('remote-video') as HTMLVideoElement;
          if (remoteVideo) {
            remoteVideo.srcObject = this.remoteStream;
          }
        };
        this.peerConnection.oniceconnectionstatechange = () => {
          const state = this.peerConnection.iceConnectionState;

          switch (state) {
            case "checking":
              this.updateAudioStatus("Connecting audio...");
              break;
            case "connected":
            case "completed":
              this.updateAudioStatus("Audio connected");
              break;
          }
        };
      }

      await this.showIncomingCallModal(this.nativeOffer);
    }
  }
  
  
  async acceptCall(offer: any) {
    await this.stopRingtone();
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    this.remoteDescriptionSet = true;
    for (const candidate of this.pendingCandidates) {
      await this.peerConnection.addIceCandidate(candidate);
    }
    
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
  }
  
  async handleOngoingCallModal(){
    if(this.targetSocketIds){
      let newTargetSocketIds = this.targetSocketIds.filter((target:any) => target != this.receiverSocketId);
      this.socket.emit('reject-call', {
        targetSocketIds: newTargetSocketIds,
        project_id: this.project_id,
      });
    }
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
    await this.stopRingtone();
    await this.closeModal();
    this.resetCallData();
  }

  async rejectCall() {
    await this.stopRingtone();
    this.socket.emit('reject-call', {
      callerSocketId: this.callerSocketId,
      receiverSocketId: this.receiverSocketId,
      targetSocketIds: this.targetSocketIds,
      project_id: this.project_id,
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
    this.targetSocketIds = data.targetSocketIds;
    this.project_id = data.project_id;
    await this.showOutgoingCallModal();
  }

  async handleUserNotFound(data: any){
    await this.rejectCall();
    this.presentToast(data.message, 'danger');
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' | 'dark' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }


  async closeModal() {
    const topModal = await this.modalController.getTop();
    if (topModal) {
      try {
        await topModal.dismiss();
      } catch (e) {
        console.warn('Gagal dismiss modal aktif:', e);
      }
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

  updateAudioStatus(status: string) {
    this.audioStatus.next(status);
  }
  
}
