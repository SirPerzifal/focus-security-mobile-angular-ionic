import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationStart } from '@angular/router';

import { ToastController, ModalController } from '@ionic/angular';

import { Contacts } from '@capacitor-community/contacts';
import { FileOpener } from '@capacitor-community/file-opener';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { HouseRulesService } from 'src/app/service/resident/house-rules/house-rules.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

import { ModalEstateHomepageComponent } from 'src/app/shared/resident-components/modal-estate-homepage/modal-estate-homepage.component';

@Component({
  selector: 'app-resident-home-page',
  templateUrl: './resident-home-page.page.html',
  styleUrls: ['./resident-home-page.page.scss'],
})
export class ResidentHomePagePage implements OnInit {
  
  isLoading: boolean = false;
  unit_id: number = 0;
  partner_id: number = 0;
  
  houseRules: { title: string, base64Doc: string }[] = [];
  
  searchTerm: string = '';
  condominiumName: string='';
  useName: string='';

  longButtondata: any[] = [
    {
      name: 'Visitors',
      src: 'assets/icon/resident-icon/visitors.png',
      routeLinkTo: '/visitor-main',
    },
    {
      name: 'Facility Bookings',
      src: 'assets/icon/resident-icon/icon3.png',
      routeLinkTo: '',
    },
    {
      name: 'Payments',
      src: 'assets/icon/resident-icon/icon2.png',
      routeLinkTo: '',
    },
    {
      name: 'My Family',
      src: 'assets/icon/resident-icon/icon1.png',
      routeLinkTo: '',
    },
    {
      name: 'My Vehicle',
      src: 'assets/icon/resident-icon/icon4.png',
      routeLinkTo: '',
    },
    {
      name: 'Raise a Request',
      src: 'assets/icon/resident-icon/icon6.png',
      routeLinkTo: '',
    },
    {
      name: 'Find Service Providers',
      src: 'assets/icon/resident-icon/icon5.png',
      routeLinkTo: '',
    }
  ];
  squareButton: any[] = [
    {
      id: 1,
      name: 'Notification',
      src: 'assets/icon/resident-icon/notification.png',
      routeLinkTo: '',
      paramForBadgeNotification: 0
    },
    {
      id: 2,
      name: 'Notice & Docs',
      src: 'assets/icon/home-icon/sound.webp',
      routeLinkTo: ''
    },
    {
      id: 3,
      name: 'Polling',
      src: 'assets/icon/resident-icon/polling.png',
      routeLinkTo: ''
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
      routeLinkTo: ''
    },
    {
      id: 6,
      name: 'Upcoming Events',
      src: 'assets/icon/resident-icon/upcoming-event.png',
      routeLinkTo: ''
    },
    {
      id: 7,
      name: 'Door Access',
      src: 'assets/icon/home-icon/door.png',
      routeLinkTo: ''
    },
    {
      id: 8,
      name: 'Quick Dials',
      src: 'assets/icon/resident-icon/quick-dials.png',
      routeLinkTo: ''
    }
  ]

  constructor(
    private router: Router,
    private toastController: ToastController, 
    private modalController: ModalController, 
    private authService: AuthService,
    private houseRulesService: HouseRulesService,
    private notificationService: NotificationService, 
    private getUserInfoService: GetUserInfoService
  ) { }

  ngOnInit() {
    this.getUserInfoService.getPreferenceStorage('user').then((value) => {
      const parse = this.authService.parseJWTParams(value.user);
      this.partner_id = Number(parse.partner_id);
      this.useName = parse.name;
    })
    this.isLoading = true;
    this.getUserInfoService.getPreferenceStorage('user').then(async (value) => {
      if(value.user){
        var accessToken = this.authService.parseJWTParams(value.user)
        await this.presentModal(accessToken?.email);
        
        this.loadHouseRules();
        this.fetchContacts();
        this.loadPreferenceProjectName();
        this.loadCountNotification();
        this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
            if (event['url'] == '/resident-home-page'){
              this.squareButton[0].paramForBadgeNotification = 0
              this.loadCountNotification();
            }
          }
        });
      }else{
        await this.presentModal('jenvel@gmail.com');
        this.loadHouseRules();
        this.fetchContacts();
        this.loadPreferenceProjectName();
        this.loadCountNotification();
        this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
            if (event['url'] == '/resident-home-page'){
              this.squareButton[0].paramForBadgeNotification = 0
              this.loadCountNotification();
            }
          }
        });
      }
    })
  }

  async presentModal(email: string= '') {
    const modal = await this.modalController.create({
      component: ModalEstateHomepageComponent,
      cssClass: 'record-modal',
      componentProps: {
        // email: email
        email: email
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        // this.loadPreferenceProjectName()
        this.isLoading = false;
        console.log(result.data)
        if(result.data){
          console.log("SUCCEED")
        }
      }
    });

    return await modal.present();
  }

  async loadPreferenceProjectName(){
    // Ambil data unit yang sedang aktif
    this.getUserInfoService.getPreferenceStorage('project_name').then((value) => {
      this.condominiumName = value.project_name;
    })
  }

  async fetchContacts() {
    const PermissionStatus = await Contacts.requestPermissions();
    if (PermissionStatus.contacts === 'granted') {
      this.presentToast('Now you app sync with your contact!', 'success');
    }
  }

  loadCountNotification() {
    console.log(this.partner_id);
    console.log('this.partner_idthis.partner_idthis.partner_idthis.partner_id');
    
    this.notificationService.countNotifications(this.unit_id, this.partner_id)
      .subscribe({next: (response: any) => {
        if (response.result.response_code === 200) {
          // Map data dengan tipe yang jelas
          this.squareButton[0].paramForBadgeNotification = response.result.notifications; // Simpan jumlah notifikasi baru
          // if (this.paramForBadgeNotification) {
          //   console.log('it works!', this.paramForBadgeNotification)
          // }
        } else {
          console.error('Error:', response);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });

    toast.present().then(() => {
    });
  }

  loadHouseRules() {
    this.getUserInfoService.getPreferenceStorage('project_id').then(async (value) => {
      if(value.project_id){
        this.houseRulesService.getHouseRules(parseInt(value.value)).subscribe(
          response => {
            if (response.result.response_code === 200) {
              // console.log("heres the data", response);
              this.squareButton[3].document = response.result.result[0].documents;
              this.squareButton[3].documentName = response.result.result[0].name;
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
        console.log(value);
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
        console.log('File is opened');
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
}
