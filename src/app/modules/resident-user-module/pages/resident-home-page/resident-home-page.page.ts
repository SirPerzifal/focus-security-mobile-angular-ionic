import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { Preferences } from '@capacitor/preferences';
import { Contacts } from '@capacitor-community/contacts';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

import { ModalEstateHomepageComponent } from 'src/app/shared/resident-components/modal-estate-homepage/modal-estate-homepage.component';

import { Estate } from 'src/models/resident/resident.model';

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
  
  searchTerm: string = '';
  condominiumName: string = '';
  condoImage: string = '';
  userType: string = '';
  useName: string = '';
  imageProfile: string = '';
  familyType: string = '';

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
      routeLinkTo: '/raise-a-request-page-main',
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
    private modalController: ModalController,
    private mainApiResident: MainApiResidentService,
    private storage: StorageService,
    public functionMain: FunctionMainService
  ) {}

  ionViewWillEnter() {
    this.fetchContacts();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.setData(estate, estate.image_profile);
            this.loadCountNotification();
            this.loadHouseRules();
            if (!this.imageProfile) {
              this.isModalUpdateProfile = false
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
    })
  }

  ngOnInit() {
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
        this.isLoading = false;
        if ( result.data ) {
          this.storage.decodeData(result.data).then((value: any) => {
            if ( value ) {
              const estate = JSON.parse(value) as Estate;
              this.setData(estate, estate.image_profile);
              this.loadCountNotification();
              this.loadHouseRules();
              if (!estate.image_profile) {
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
    console.log(this.familyType, this.userType);
    
    if (this.userType === 'resident') {
      if (this.familyType !== 'Secondary Contacts' && this.familyType !== 'Primary Contacts') {
        this.longButtondata = [
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
      } else {
        this.longButtondata = [
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
            routeLinkTo: '/resident-my-family',
          },
          {
            name: 'My Vehicle',
            src: 'assets/icon/resident-icon/icon4.png',
            routeLinkTo: '/resident-my-vehicle',
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
      }
    } else if (this.userType === 'industrial') {
      this.longButtondata = [
        {
          name: 'Visitors',
          src: 'assets/icon/resident-icon/visitors.png',
          routeLinkTo: '/visitor-main',
        },
        {
          name: 'Contractors',
          src: 'assets/icon/resident-icon/find_service/Contractor.png',
          routeLinkTo: '/contractor-commercial-main',
        },
        {
          name: 'Facility Bookings',
          src: 'assets/icon/resident-icon/icon3.png',
          routeLinkTo: '/facility-booking-main',
        },
        {
          name: 'My Vehicle',
          src: 'assets/icon/resident-icon/icon4.png',
          routeLinkTo: '/resident-my-vehicle',
        },
      ];
    }
  }

  async fetchContacts() {
    const PermissionStatus = await Contacts.requestPermissions();
    if (PermissionStatus.contacts === 'granted') {
      this.functionMain.presentToast('Now you app sync with your contact!', 'success');
    }
  }

  loadCountNotification() {
    this.mainApiResident.endpointMainProcess({}, 'get/notifications_count').subscribe((result: any) => {
      this.squareButton[0].paramForBadgeNotification = result.result.notifications;
    })
  }

  loadHouseRules() {
    this.mainApiResident.endpointMainProcess({}, 'get/house_rules_documents').subscribe((result:any) => {
      if (result.result.response_code === 200) {
        // console.log("heres the data", result);
        this.squareButton[3].document = result.result.result[0].documents;
        this.squareButton[3].documentName = result.result.result[0].name;
        this.is_door_access = result.result.result[0].is_door_access;
        if (this.is_door_access === false) {
          this.squareButton = [
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
              name: 'Quick Dials',
              src: 'assets/icon/resident-icon/quick-dials.png',
              routeLinkTo: '/quick-dial-page-main'
            }
          ]
        }
      } else {
        console.error('Error fetching notifications:', result);
      }
    })
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
    this.mainApiResident.endpointMainProcess({
      new_image_profile: this.selectedProfile
    }, 'post/change_update_profile_image').subscribe((response: any) => {
      const estateString = JSON.stringify(response.result.new_estate);
      console.log(estateString);
      // Melakukan encoding ke Base64
      const encodedEstate = btoa(unescape(encodeURIComponent(estateString)));
      console.log(encodedEstate);
      this.setData(response.result.new_estate, response.result.new_estate.image_profile);
      this.storage.setValueToStorage('USESATE_DATA', encodedEstate).then((response: any) => {
        this.isModalUpdateProfile = false;
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
}
