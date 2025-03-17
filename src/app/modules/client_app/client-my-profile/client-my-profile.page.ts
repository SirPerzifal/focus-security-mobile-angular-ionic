import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-client-my-profile',
  templateUrl: './client-my-profile.page.html',
  styleUrls: ['./client-my-profile.page.scss'],
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
  };

  constructor(
    private router: Router,
    private getUserInfoService: GetUserInfoService,
    private authService: AuthService,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
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
      this.userData = {
        id: value.user_id,
        name: value.name,
        name_condo: value.project_name.join(', '),
        email: value.email,
        contact: value.contact_number ? value.contact_number : '',
        designation: value.designation ? value.designation : '',
        image_profile: value.image_profile ? value.image_profile : '',
      }
    })
  }

  saveRecord() {
    this.clientMainService.getApi(this.userData, '/client/update/my_profile').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMain.presentToast('Profile successfully updated!', 'success');
          Preferences.clear()
          Preferences.set({
            key: 'USER_INFO',
            value: JSON.stringify(results.result.access_token),
          }).then(()=>{
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

}
