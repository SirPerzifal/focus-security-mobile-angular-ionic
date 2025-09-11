import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';

import { ModalController } from '@ionic/angular';

import { Preferences } from '@capacitor/preferences';
import { Contacts } from '@capacitor-community/contacts';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

import { ModalEstateHomepageComponent } from 'src/app/shared/resident-components/modal-estate-homepage/modal-estate-homepage.component';

import { Estate } from 'src/models/resident/resident.model';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { Observable, Subscription } from 'rxjs';

import { Platform } from '@ionic/angular';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { App } from '@capacitor/app';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resident-home-page',
  templateUrl: './resident-home-page.page.html',
  styleUrls: ['./resident-home-page.page.scss'],
})
export class ResidentHomePagePage implements OnInit {
  
  estate: Estate[] = [];

  isLoading: boolean = false;
  isModalUpdateProfile: boolean = false;
  
  houseRules: { title: string, base64Doc: string }[] = [];
  
  fcmToken: string = '';
  searchTerm: string = '';
  condominiumName: string = '';
  condoImage: string = '';
  userType: string = '';
  useName: string = '';
  imageProfile: string = '';
  familyType: string = '';
  callActionStatus: string = '';

  longButtondata: any[] = [
    {
      name: 'Visitors',
      src: 'assets/icon/resident-icon/visitors.png',
      routeLinkTo: '/visitor-main',
    },
    {
      name: 'Facility Bookings',
      src: 'assets/icon/resident-icon/icon3.png',
      routeLinkTo: '/facility-booking-main',
    },
    {
      name: 'Payments',
      src: 'assets/icon/resident-icon/icon2.png',
      routeLinkTo: '/payment-page-main',
    },
    {
      name: 'My Family',
      src: 'assets/icon/resident-icon/icon1.png',
      routeLinkTo: '/family-page-main',
    },
    {
      name: 'My Vehicle',
      src: 'assets/icon/resident-icon/icon4.png',
      routeLinkTo: '/my-vehicle-page-main',
    },
    {
      name: 'Raise a Request',
      src: 'assets/icon/resident-icon/icon6.png',
      routeLinkTo: '/resident-raise-a-request',
    },
    {
      name: 'Find Service Providers',
      src: 'assets/icon/resident-icon/icon5.png',
      routeLinkTo: '/find-a-service-provider-page-main',
    }
  ];
  squareButton: any[] = [
    {
      id: 1,
      name: 'Notification',
      src: 'assets/icon/resident-icon/notification.png',
      routeLinkTo: '/notification-page-main',
      paramForBadgeNotification: 0
    },
    {
      id: 2,
      name: 'Notice & Docs',
      src: 'assets/icon/home-icon/sound.webp',
      routeLinkTo: '/notice-and-docs-page-main'
    },
    {
      id: 3,
      name: 'Polling',
      src: 'assets/icon/resident-icon/polling.png',
      routeLinkTo: '/polling-page-main'
    },
    {
      id: 4,
      name: 'House Rule',
      src: 'assets/icon/resident-icon/house-rule.png',
      document: '',
      documentName: ''
    },
    {
      id: 5,
      name: 'Report an Issue',
      src: 'assets/icon/resident-icon/report-an-issue.png',
      routeLinkTo: '/app-report-main'
    },
    {
      id: 6,
      name: 'Upcoming Events',
      src: 'assets/icon/resident-icon/upcoming-event.png',
      routeLinkTo: '/upcoming-event-page-main'
    },
    {
      id: 7,
      name: 'Door Access',
      src: 'assets/icon/home-icon/door.png',
      routeLinkTo: '/door-access-main'
    },
    {
      id: 8,
      name: 'Quick Dials',
      src: 'assets/icon/resident-icon/quick-dials.png',
      routeLinkTo: '/quick-dial-page-main'
    }
  ]
  is_door_access: boolean = false;

  showingProfile: string = '';
  selectedProfile: string = '';

  constructor(
    private webRtcService: WebRtcService,
    private modalController: ModalController,
    private mainApiResident: MainApiResidentService,
    private storage: StorageService,
    public functionMain: FunctionMainService,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 1000)
  }

  ionViewWillEnter() {
    this.initializeBackButtonHandling()
    this.fetchContacts();
    this.initBluetooth();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.setData(estate, estate.image_profile);
            this.loadMenusConfig();
            this.uploadNewProfile();
            this.getNotificationPermission(estate.family_id);
            if (!this.imageProfile) {
              this.isModalUpdateProfile = false
            }
          }
        })
      } else {
        Preferences.get({key: 'USER_INFO'}).then(async (value) => {
          if(value?.value){
            console.log(value.value)
            const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
            this.isLoading = true;
            // Mengubah string JSON menjadi objek JavaScript
            const credential = JSON.parse(decodedEstateString);
            this.loadEstate(credential.emailOrPhone);
          }
        })
      }
    })
  }

  initializeBackButtonHandling() {
    console.log("tes");
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log("tes");
      App.exitApp();
    });
  }
  
  async initBluetooth() {
    try {
      await BleClient.initialize();
      console.log('Bluetooth initialized');
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if (params) {
        if (params['reload']){
          this.webRtcService.initializeSocket();
          this.webRtcService.callActionStatus.subscribe(status => {
            this.callActionStatus = status;
          });
        }
      }
    })
    this.webRtcService.initializeSocket();
    this.webRtcService.callActionStatus.subscribe(status => {
      this.callActionStatus = status;
    });
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async loadEstate( email:string ) {
    this.mainApiResident.endpointProcess({
      email: email
    }, 'get/estate').subscribe((result: any) => {
      if (result.result.status_code === 200) {
        var listedEstate = []
        for (var key in result.result.response){
          if(result.result.response.hasOwnProperty(key)){
            listedEstate.push({
              user_id: result.result.response[key]?.user_id,
              family_id: result.result.response[key]?.family_id,
              family_name: result.result.response[key]?.family_name || '',
              family_nickname: result.result.response[key]?.family_nickname || '',
              image_profile: result.result.response[key]?.image_profile || '',
              family_email: result.result.response[key]?.family_email || '',
              family_mobile_number: result.result.response[key]?.family_mobile_number || '',
              family_type: result.result.response[key]?.family_type || '',
              unit_id: result.result.response[key]?.unit_id,
              unit_name: result.result.response[key]?.unit_name || '',
              block_id: result.result.response[key]?.block_id,
              block_name: result.result.response[key]?.block_name || '',
              project_id: result.result.response[key]?.project_id,
              project_name: result.result.response[key]?.project_name || '',
              project_image: result.result.response[key]?.project_image || '',
              record_type: result.result.response[key]?.record_type || '',
            })
          }
        }
        this.estate = listedEstate;
        this.presentModal(this.estate);
        this.isModalUpdateProfile = false;
      } else {
        console.error('Error fetching Estate:', result);
      }
    })
  }

  async presentModal(estate: any) {
    const modal = await this.modalController.create({
      component: ModalEstateHomepageComponent,
      cssClass: 'record-modal',
      componentProps: {
        estate: estate
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log("HEY 1")
        this.isLoading = false;
        if (result.data !== 'gas ini dari client' && result.data !== 'gas ini dari resident') {
          console.log("HEY 2")
          this.storage.decodeData(result.data).then((value: any) => {
            console.log(value)
            if (value) {
              console.log("END USER FORM MODAL")
              this.webRtcService.initializeSocket();
              const estate = JSON.parse(value) as Estate;
              this.setData(estate, estate.image_profile);
              console.log(estate);
              this.loadMenusConfig();
              if (!estate.image_profile) {
                this.isModalUpdateProfile = true
              }
              this.getNotificationPermission(estate.family_id);
            }
          })
        } else if (result.data === 'gas ini dari resident') {
          setTimeout(() => {
            this.router.navigate(['/client-main-app'], {queryParams: {reload: true}});
          }, 500)
        } else {
          Preferences.get({key: 'USER_INFO'}).then(async (value) => {
            if(value?.value){
              const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
              this.isLoading = true;
              // Mengubah string JSON menjadi objek JavaScript
              const credential = JSON.parse(decodedEstateString);
              this.loadEstate(credential.emailOrPhone);
            }
          })
        }
      }
    });

    return await modal.present();
  }

  setData(parserValue: Estate, imageProfile: string) {
    this.condominiumName = parserValue.project_name;
    this.condoImage = parserValue.project_image;
    this.imageProfile = imageProfile;
    this.useName = parserValue.family_nickname;
    this.familyType = parserValue.family_type;
    this.userType = parserValue.record_type;
  }

  async fetchContacts() {
    const PermissionStatus = await Contacts.requestPermissions();
    // if (PermissionStatus.contacts === 'granted') {
    //   this.functionMain.presentToast('Now you app sync with your contact!', 'success');
    // }
  }

  loadMenusConfig() {
    this.isLoading = true;
    this.mainApiResident.endpointMainProcess({}, 'get/button_menus_config').subscribe((result:any) => {
      if (result.result.response_code === 200) {
        this.isLoading = false
        this.longButtondata = result.result.result.long_button_data.filter((longButton: any) => {
          return longButton.active === true;
        });
        this.squareButton = result.result.result.square_button.filter((squareButton: any) => {
          return squareButton.active === true;
        });
        console.log(this.squareButton);
        
      } else {
        console.error('Error fetching notifications:', result);
      }
    })
  }

  isModalChooseUpload: boolean = false;
  chooseWhereToChoose() {
    console.log("tes");
    this.isModalChooseUpload = !this.isModalChooseUpload;
  }

  onProfileFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isModalChooseUpload = !this.isModalChooseUpload;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.showingProfile = e.target.result; // Menyimpan URL gambar untuk preview
      };
      reader.readAsDataURL(file); // Membaca file sebagai URL data
      this.convertToBase64(file).then((base64: string) => {
        // console.log('Base64 successed');
        this.selectedProfile = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    }
  }

  async openCamera() {
    try {
      const permissionStatus = await Camera.checkPermissions();
      if (permissionStatus.camera !== 'granted') {
        await Camera.requestPermissions();
      }
      
      const image = await Camera.getPhoto({
        quality: 50,
        resultType: CameraResultType.Base64, // Ubah ke Base64
        source: CameraSource.Camera,
        width: 500,
        height: 500,
        promptLabelHeader: 'Take a photo',
        promptLabelCancel: 'Cancel',
        promptLabelPhoto: 'Take Photo',
      });
      
      if (image && image.base64String) {  
        this.isModalChooseUpload = !this.isModalChooseUpload;
        // Update the form data with the base64 image
        this.selectedProfile = image.base64String;
        
        this.showingProfile = image.base64String;
        
        // Display success message
        this.functionMain.presentToast('Photo captured successfully', 'success');
      }
    } catch (error) {
      console.error('Camera error:', error);
      this.functionMain.presentToast(String(error), 'danger');
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  uploadNewProfile() {
    this.mainApiResident.endpointMainProcess({
      new_image_profile: this.selectedProfile,
      family_nickname: this.useName
    }, 'post/change_update_profile_image').subscribe((response: any) => {
      this.showingProfile = '';
      this.selectedProfile = '';
      const estateString = JSON.stringify(response.result.new_estate);
      console.log(estateString);
      // Melakukan encoding ke Base64
      const encodedEstate = btoa(unescape(encodeURIComponent(estateString)));
      console.log(encodedEstate);
      this.setData(response.result.new_estate, response.result.new_estate.image_profile);
      this.storage.setValueToStorage('USESATE_DATA', encodedEstate).then((response: any) => {
        this.isModalUpdateProfile = false;
        this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
          if (value) {
            this.webRtcService.initializeSocket();
            const decodedUserState = decodeURIComponent(escape(atob(value)));
            console.log(JSON.parse(decodedUserState).unit_id); // Pastikan untuk mengurai JSON
          }
        })
      })
    })
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  async getNotificationPermission(familyId: number): Promise<string> {
    try {
      // Check if PushNotifications is available
      if (typeof PushNotifications === 'undefined') {
        console.warn('PushNotifications not available.');
        return '';
      }

      // Request permissions
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        console.log('Notification permission not granted');
        return '';
      }

      // Clean up and register
      PushNotifications.removeAllListeners();
      PushNotifications.register();

      // Return promise for token registration
      return this.waitForToken(familyId);
    } catch (err) {
      console.error('Push Notification Error:', err);
      return '';
    }
  }

  private waitForToken(familyId: number): Promise<string> {
    return new Promise((resolve) => {
      const TIMEOUT_MS = 10000; // Reduced from 15s to 10s
      
      const timeout = setTimeout(() => {
        this.cleanupTokenListeners();
        console.log('FCM registration timed out');
        resolve('');
      }, TIMEOUT_MS);

      const onRegistration = (token: Token) => {
        this.cleanupTokenListeners();
        if (token.value) {
          this.fcmToken = token.value;
          console.log('FCM Token received:', token.value);
            
          // ✅ Send token to backend
          this.mainApiResident.endpointCustomProcess({
            family_id: familyId,
            fcm_token: token.value,
            device_new: Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' ? 'ios' : 'android'
          }, '/set/fcm_token').subscribe({
            next: (response: any) => {
              console.log('FCM token sent to backend successfully:', response);
              resolve(token.value); // ✅ PERBAIKAN: resolve dengan token
            },
            error: (error) => {
              console.error('Failed to send FCM token to backend:', error);
              resolve(token.value); // ✅ Tetap resolve dengan token meski gagal kirim ke backend
            }
          });
          resolve(token.value);
        } else {
          resolve('');
        }
      };

      const onRegistrationError = (error: any) => {
        this.cleanupTokenListeners();
        console.error('Push notification registration error:', error);
        resolve('');
      };

      // Add listeners
      PushNotifications.addListener('registration', onRegistration);
      PushNotifications.addListener('registrationError', onRegistrationError);

      // Store cleanup function
      this.cleanupTokenListeners = () => {
        clearTimeout(timeout);
        PushNotifications.removeAllListeners();
      };
    });
  }

  private cleanupTokenListeners: () => void = () => {};

}
