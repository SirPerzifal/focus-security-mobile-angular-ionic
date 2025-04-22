import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Contacts } from '@capacitor-community/contacts';
import { ModalController } from '@ionic/angular';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { HouseRulesService } from 'src/app/service/resident/house-rules/house-rules.service';
import { EstateModalPage } from './estate-modal/estate-modal.page';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-resident-homepage',
  templateUrl: './resident-home-page.page.html',
  styleUrls: ['./resident-home-page.page.scss'],
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

  selectedProfile: string = '';
  showingProfile: string = '';

  estate: any[] = []
  isLoading: boolean = false;

  constructor(
    private notificationService: NotificationService, 
    private route: Router, 
    private houseRulesService: HouseRulesService,
    private modalController: ModalController, 
    private router: Router,
    private storage: StorageService,
    private authService: AuthService,
    public functionMain: FunctionMainService,
    private mainApiResident: MainApiResidentService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { estate: any };
    if (state) {
      this.estate = state.estate;
    } else {
      Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
        if (value?.value) {
        }
      })
    }
  }
  
  ionViewWillEnter() {
    this.fetchContacts();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        console.log("tes");
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.setData(estate, estate.image_profile);
            this.loadCountNotification(estate.unit_id, estate.family_id);
            this.loadHouseRules(estate.project_id);
            if (!this.imageProfile) {
              this.isModalUpdateProfile = false
            }
            Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
              if(value?.value){
                const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
                const credential = JSON.parse(decodedEstateString);
              }
            })
          }
        })
      } else {
        console.log("tes");
        Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
          if(value?.value){
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

  ngOnInit() {
  }

  async loadEstate(email:string) {
    this.authService.getEstatesByEmail(email).subscribe(
      response => {
        if (response.result.status_code === 200) {
          var listedEstate = []
          for (var key in response.result.response){
            if(response.result.response.hasOwnProperty(key)){
              listedEstate.push({
                family_id: response.result.response[key]?.family_id,
                family_name: response.result.response[key]?.family_name || '',
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
                record_type:  response.result.record_type[key]?.record_type || ''
              })
            }
          }
          this.estate = listedEstate;
          this.presentModal(this.estate);
          this.isModalUpdateProfile = false;
        } else {
          console.error('Error fetching Estate:', response);
        }
      },
      error => {
        console.error('HTTP Error:', error);
      }
    );
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
          this.isLoading = false;
          if ( result.data ) {
            this.storage.decodeData(result.data).then((value: any) => {
              if ( value ) {
                const estate = JSON.parse(value) as Estate;
                this.setData(estate, estate.image_profile);
                this.loadCountNotification(estate.unit_id, estate.family_id);
                this.loadHouseRules(estate.project_id);
                if (!this.imageProfile) {
                  this.isModalUpdateProfile = true
                }
              }
            })
          } else {
            Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
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
      }
    });
    return await modal.present();
  }
  
  async fetchContacts() {
    await Contacts.requestPermissions();
  }

  loadCountNotification(unitId: number, partnerId: number) {
    this.mainApiResident.endpointProcess({
      unit_id: unitId,
      partner_id: partnerId
    }, 'get/notifications_count').subscribe((result: any) => {
      this.paramForBadgeNotification = result.result.notifications; 
    })
  }

  loadHouseRules(project_id: number) {
    this.mainApiResident.endpointProcess({
      project_id: project_id
    }, 'get/house_rules_documents').subscribe((result:any) => {
      if (result.result.response_code === 200) {
        // console.log("heres the data", result);
        this.houseRules = result.result.result.map((item: any) => ({
          title: item.name,
          base64Doc: item.documents
        }));
      } else {
        console.error('Error fetching notifications:', result);
      }
    })
  }

  directToNotifications() {
    this.paramForBadgeNotification = 0;
    this.route.navigate(['resident-notification']);
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
