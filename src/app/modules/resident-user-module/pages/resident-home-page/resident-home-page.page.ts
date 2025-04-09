import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
      routeLinkTo: '/payments-main',
    },
    {
      name: 'My Family',
      src: 'assets/icon/resident-icon/icon1.png',
      routeLinkTo: '/family-main',
    },
    {
      name: 'My Vehicle',
      src: 'assets/icon/resident-icon/icon4.png',
      routeLinkTo: '/my-vehicle-main',
    },
    {
      name: 'Raise a Request',
      src: 'assets/icon/resident-icon/icon6.png',
      routeLinkTo: '/raise-a-request-main',
    },
    {
      name: 'Find Service Providers',
      src: 'assets/icon/resident-icon/icon5.png',
      routeLinkTo: '/service-provider-main',
    }
  ];
  squareButton: any[] = [
    {
      id: 1,
      name: 'Notification',
      src: 'assets/icon/resident-icon/notification.png',
      routeLinkTo: '/notification-main',
      paramForBadgeNotification: 0
    },
    {
      id: 2,
      name: 'Notice & Docs',
      src: 'assets/icon/home-icon/sound.webp',
      routeLinkTo: '/notice-and-docs-main'
    },
    {
      id: 3,
      name: 'Polling',
      src: 'assets/icon/resident-icon/polling.png',
      routeLinkTo: '/polling-main'
    },
    {
      id: 4,
      name: 'House Rule',
      src: 'assets/icon/resident-icon/house-rule.png',
      routeLinkTo: '',
      document: '',
      documentName: ''
    },
    {
      id: 5,
      name: 'Report an Issue',
      src: 'assets/icon/resident-icon/report-an-issue.png',
      routeLinkTo: '/condo-issue-report-main'
    },
    {
      id: 6,
      name: 'Upcoming Events',
      src: 'assets/icon/resident-icon/upcoming-event.png',
      routeLinkTo: '/upcoming-event-main'
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
      routeLinkTo: '/quick-dials-main'
    }
  ]

  constructor(
    private router: Router,
    private modalController: ModalController,
    private mainApiResident: MainApiResidentService,
    private storage: StorageService,
    private functionMain: FunctionMainService
  ) {}

  ionViewWillEnter() {
    this.fetchContacts();
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
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
                this.userType = credential.type;
              }
            })
          }
        })
      } else {
        Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
          if(value?.value){
            const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
            this.isLoading = true;
            // Mengubah string JSON menjadi objek JavaScript
            const credential = JSON.parse(decodedEstateString);
            this.userType = credential.type;
            console.log(this.userType);
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
    });

    return await modal.present();
  }

  setData(parserValue: any, imageProfile: string) {
    this.condominiumName = parserValue.project_name;
    this.condoImage = parserValue.project_image;
    this.imageProfile = imageProfile;
    this.useName = parserValue.family_name;
    this.familyType = parserValue.family_type;
  }

  async fetchContacts() {
    const PermissionStatus = await Contacts.requestPermissions();
    if (PermissionStatus.contacts === 'granted') {
      this.functionMain.presentToast('Now you app sync with your contact!', 'success');
    }
  }

  loadCountNotification(unitId: number, partnerId: number) {
    this.mainApiResident.endpointProcess({
      unit_id: unitId,
      partner_id: partnerId
    }, 'get/notifications_count').subscribe((result: any) => {
      this.squareButton[0].paramForBadgeNotification = result.result.notifications;
    })
  }

  loadHouseRules(project_id: number) {
    this.mainApiResident.endpointProcess({
      project_id: project_id
    }, 'get/house_rules_documents').subscribe((result:any) => {
      if (result.result.response_code === 200) {
        // console.log("heres the data", result);
        this.squareButton[3].document = result.result.result[0].documents;
        this.squareButton[3].documentName = result.result.result[0].name;
      } else {
        console.error('Error fetching notifications:', result);
      }
    })
  }
}
