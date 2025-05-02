import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  };

  constructor(
    private router: Router,
    private getUserInfoService: GetUserInfoService,
    private authService: AuthService,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
    private storage: StorageService,
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
    this.clientMainService.getApi(this.userData, '/client/update/my_profile').subscribe({
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
        allowEditing: true,
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
