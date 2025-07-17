import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { trigger, style, animate, transition } from '@angular/animations';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from 'src/app/service/storage/storage.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-client-my-profile',
  templateUrl: './client-my-profile.page.html',
  styleUrls: ['./client-my-profile.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class ClientMyProfilePage implements OnInit {

  userData = {
    id: '',
    name: '',
    name_condo: '',
    email: '',
    contact: '',
    designation: '',
    image_profile: '',
    selected_project_id: '',
    family_id: '',
  };
  isLoading = false;

  constructor(
    private router: Router,
    private getUserInfoService: GetUserInfoService,
    private authService: AuthService,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
    private storage: StorageService,
    private mainResident: MainApiResidentService
  ) { }

  ngOnInit() {
    this.loadProject();
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async loadProject() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.savedPref = value
      this.userData = {
        id: value.user_id,
        name: value.name,
        name_condo: value.project_name,
        email: value.email,
        contact: value.contact_number ? value.contact_number : '',
        designation: value.designation ? value.designation : '',
        image_profile: '',
        selected_project_id: value.project_id ? value.project_id : '',
        family_id: value.family_id ? value.family_id : '',
      }
      this.storage.getValueFromStorage('USESATE_DATA').then(value => {
        this.userData.image_profile = value.image_profile
      })
    })
  }

  savedPref: any = []

  // project_list: any = []
  // project_id = 0
  faCheck = faCheck
  faFalse = faX

  saveRecord() {
    this.clientMainService.getApi(this.userData, '/client/post/my_profile').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMain.presentToast('Profile successfully updated!', 'success');
          Preferences.clear()
          Preferences.set({
            key: 'USER_INFO',
            value: results.result.access_token,
          }).then(()=>{
            this.storage.clearAllValueFromStorage()
            let storageData = {
              'image_profile': results.result.image_profile
            }
            this.storage.setValueToStorage('USESATE_DATA', storageData)
            this.router.navigate(['/client-main-app'], {
              queryParams: {
                reload: true
              }
            })
          });
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while updating profile!', 'danger');
        console.error(error);
      }
    });
  }

  @ViewChild('editProfileName') name_input!: ElementRef;
  isEdit = false
  editName() {
    console.log('edit')
    this.isEdit = true
    console.log(this.name_input)
    setTimeout(() => {
      console.log(this.name_input)
      this.name_input?.nativeElement.focus()
    }, 300);
  }

  async editImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64
      });
      console.log(image)
      this.userData.image_profile = image.base64String || '';
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }
  
      this.functionMain.presentToast('Error taking photo', 'danger');
    }
  }

  page = 'My Profile'
  changePage(page: string) {
    if (page === 'main_profile') {
      console.log(page, 'main_profile');
      this.page = 'My Profile';
    } else if (page === 'estate') {
      this.loadEstate(this.userData.email);
      this.activeUnit = this.userData.family_id;
      console.log(page, 'estate');
      this.page = 'Change Estate';
    }
  }

  profileEstate: Estate[] = [];
  loadEstate(email:string) {
    this.mainResident.endpointProcess({
      email: email,
    }, 'get/estate').subscribe(
      response => {
        if (response.result.status_code === 200) {
          var listedEstate = []
          for (var key in response.result.response){
            if(response.result.response.hasOwnProperty(key)){
              listedEstate.push({
                user_id: response.result.response[key]?.user_id,
                family_id: response.result.response[key]?.family_id,
                family_name: response.result.response[key]?.family_name || '',
                family_nickname: response.result.response[key]?.family_nickname || '',
                image_profile: response.result.response[key]?.image_profile || '',
                family_email: response.result.response[key]?.family_email || '',
                family_mobile_number: response.result.response[key]?.family_mobile_number || '',
                family_type: response.result.response[key]?.family_type || '',
                unit_id: response.result.response[key]?.unit_id,
                unit_name: response.result.response[key]?.unit_name || '',
                block_id: response.result.response[key]?.block_id,
                block_name: response.result.response[key]?.block_name || '',
                project_id: response.result.response[key]?.project_id,
                project_name: response.result.response[key]?.project_name || '',
                project_image: response.result.response[key]?.project_image || '',
                record_type: response.result.response[key]?.record_type || ''
              })
            }
          }
          this.profileEstate = listedEstate;
          this.isLoading = false;
        } else {
          console.error('Error fetching Estate:', response);
        }
      },
      error => {
        console.error('HTTP Error:', error);
      }
    );
  }

  async getAccessToken(familyId: number, client?: string) {
    this.mainResident.endpointCustomProcess({
      previous_family_id: this.userData.id,
      family_id: familyId,
    }, '/get/access_token').subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          Preferences.clear();
          if (response.result.email) {
            const userCredentials = {
              emailOrPhone: response.result.email,
              access_token: response.result.access_token
            }
            Preferences.set({
              key: 'USER_INFO',
              value: btoa(unescape(encodeURIComponent(JSON.stringify(userCredentials))))
            })
            this.router.navigate(['/resident-home-page'], {queryParams: {reload: true}});
          } else {
            Preferences.set({
              key: 'USER_INFO',
              value: response.result.access_token,
            })
          }
        }
      },
      error: (error) => {
        console.error('Failed to get access token:', error);
      }
    });
  }

  fcmToken: string = '';

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
          this.mainResident.endpointCustomProcess({
            previous_family_id: this.userData.id,
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

  activeUnit: any = null;
  async chooseEstateClick(estate: any) {
    if (estate.user_id) {
      let storageData = {
        'image_profile': estate.image_profile
      }
      this.storage.clearAllValueFromStorage();
      this.storage.setValueToStorage('USESATE_DATA', storageData)
      this.getNotificationPermission(estate.family_id);
      this.getAccessToken(estate.family_id, 'client');
      // this.router.navigate(['/client-main-app'], {queryParams: {reload: true}});
      return;
    } else {
      // Mengubah estate menjadi string JSON
      const estateString = JSON.stringify(estate);
      this.getNotificationPermission(estate.family_id);
      this.getAccessToken(estate.family_id);
      // Melakukan encoding ke Base64
      const encodedEstate = btoa(unescape(encodeURIComponent(estateString)));
      this.storage.setValueToStorage('USESATE_DATA', encodedEstate).then((response: any) => {
        this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
        })
        if (estate.unit_id) {
          this.activeUnit = estate.unit_id;
        } else {
          this.activeUnit = estate.family_id;
        }
      })
    }
  }

  isMain = true
  isMenu = false
  onClickLocation() {
    this.isMain = false
    setTimeout(() => {
      this.isMenu = true
    }, 300)
  }

  useProject(project: any) {
    console.log(project)
    this.savedPref.project_id = project.id
    this.savedPref.project_name = project.name
    console.log(this.savedPref)
  }

  onBack() {
    this.isMenu = false
    setTimeout(() => {
      this.isMain = true
    }, 300)
  }

}
