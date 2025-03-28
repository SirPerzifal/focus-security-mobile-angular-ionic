import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Contacts } from '@capacitor-community/contacts';
import { ModalController } from '@ionic/angular';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { HouseRulesService } from 'src/app/service/resident/house-rules/house-rules.service';
import { EstateModalPage } from './estate-modal/estate-modal.page';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-resident-homepage',
  templateUrl: './resident-homepage.page.html',
  styleUrls: ['./resident-homepage.page.scss'],
})
export class ResidentHomepagePage implements OnInit {
  paramForBadgeNotification: number = 0;
  houseRules: { title: string, base64Doc: string }[] = [];

  condominiumName: string = '';
  condoImage: string = '';
  imageProfile: string = '';
  isModalUpdateProfile: boolean = false;
  name: string = '';
  familyType: string = '';

  estate: any[] = []
  isLoading: boolean = false;

  constructor(
    private notificationService: NotificationService, 
    private route: Router, 
    private houseRulesService: HouseRulesService,
    private modalController: ModalController, 
    private router: Router,
    public functionMain: FunctionMainService,
    private mainApiResident: MainApiResidentService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { estate: any };
    if (state) {
      this.estate = state.estate;
    } else {
      Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
        if (value?.value) {
          const parseValue = JSON.parse(value.value);
          this.estate = parseValue;
          this.isModalUpdateProfile = false;
        }
      })
    }
  }
  
  ionViewWillEnter() {
    Preferences.get({key: 'USER_EMAIL'}).then(async (value) => {
      if(value?.value){
        Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
          if (value?.value) {
            const valueUseState = JSON.parse(value.value);
            this.isLoading = false;
            this.setData(valueUseState, '');
            this.fetchContacts();
            this.loadCountNotification();
            this.loadHouseRules();
          } else {
            this.isLoading = true;
            await this.presentModal(this.estate);
          }
        })
      }
    })
  }

  ngOnInit() {
  }

  setData(parserValue: any, imageProfile: string) {
    this.condominiumName = parserValue.project_name;
    this.condoImage = parserValue.project_image;
    this.imageProfile = imageProfile;
    this.name = parserValue.family_name;
    this.familyType = parserValue.family_type;
  }

  async presentModal(estate: any) {
    const modal = await this.modalController.create({
      component: EstateModalPage,
      cssClass: 'record-modal',
      componentProps: {
        estate: estate
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result) {
        if (result.data) {
          Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
            if (value?.value){
              const valueUseState = JSON.parse(value.value);
              this.setData(valueUseState, '');
              if (!this.imageProfile) {
                this.isModalUpdateProfile = true;
              }          
              this.fetchContacts();
              this.loadCountNotification();
              this.loadHouseRules();
              this.isLoading = false;
            }
          })
        }
      }
    });
    return await modal.present();
  }
  
  async fetchContacts() {
    await Contacts.requestPermissions();
  }


  loadCountNotification() {
    Preferences.get({key: 'USESTATE_DATA'}).then((value) => {
      if (value?.value){
        const unit_id = JSON.parse(value.value).unit_id;
        const partner_id = JSON.parse(value.value).family_id;
        this.notificationService.countNotifications(Number(unit_id), Number(partner_id))
          .subscribe({next: (response: any) => {
            if (response.result.response_code === 200) {
              // Map data dengan tipe yang jelas
              this.paramForBadgeNotification = response.result.notifications; 
            } else {
              console.error('Error:', response);
            }
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
      }
    })
  }


  directToNotifications() {
    this.paramForBadgeNotification = 0;
    this.route.navigate(['resident-notification']);
  }

  loadHouseRules() {
    Preferences.get({key: 'USESTATE_DATA'}).then((value)=>{
      if (value.value){
        const projectId = JSON.parse(value.value).project_id;
        this.houseRulesService.getHouseRules(Number(projectId)).subscribe(
          response => {
            if (response.result.response_code === 200) {
              this.houseRules = response.result.result.map((item: any) => ({
                title: item.name,
                base64Doc: item.documents
              }));
            } else {
              console.error('Error fetching notifications:', response);
            }
          },
          error => {
            console.error('HTTP Error:', error);
          }
        );
      }else{
        console.error('No Active Project');
      }
    })
  }

  async downloadDocument(base64Doc: string, title: string) {
    try {
      const byteCharacters = atob(base64Doc);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      if (Capacitor.isNativePlatform()) {
        const base64 = await this.convertBlobToBase64(blob);
        const saveFile = await Filesystem.writeFile({
          path: `${title}.pdf`,
          data: base64,
          directory: Directory.Data
        });
        const path = saveFile.uri;
        await FileOpener.open({
          filePath: path,
          contentType: blob.type
        });
        // console.log('File is opened');
      } else {
        const href = window.URL.createObjectURL(blob);
        this.downloadFile(href, `${title}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      // Optionally, show an error message to the user
    }
  }

  convertBlobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  downloadFile(href: string, filename: string) {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        // Periksa apakah parentNode tidak null sebelum menghapus
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
    }, 0);
  }

  selectedProfile: string = '';
  showingProfile: string = '';
  onProfileFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
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

  uploadNewProfile() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value){
        const valueUseState = JSON.parse(value.value);
        const familyId = valueUseState.family_id;
        this.mainApiResident.endpointProcess({
          family_id: familyId,
          new_image_profile: this.selectedProfile
        }, 'post/change_update_profile_image').subscribe((response: any) => {
          
        })
      }
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
}
