import { Component, OnInit} from '@angular/core';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { Router } from '@angular/router';
import { Contacts } from '@capacitor-community/contacts';
import { ToastController, ModalController } from '@ionic/angular';
import { HouseRulesService } from 'src/app/service/resident/house-rules/house-rules.service';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { EstateModalPage } from './estate-modal/estate-modal.page';
import { NavigationStart } from '@angular/router';

@Component({
  selector: 'app-resident-homepage',
  templateUrl: './resident-homepage.page.html',
  styleUrls: ['./resident-homepage.page.scss'],
})
export class ResidentHomepagePage implements OnInit {
  unit_id: number = 1;
  partner_id: number = 1;
  paramForBadgeNotification: number = 0;
  houseRules: { title: string, base64Doc: string }[] = [];
  searchTerm: string = '';
  condominiumName: string=';'
  isLoading: boolean = true;

  constructor(
    private notificationService: NotificationService, 
    private route: Router, 
    private toastController: ToastController, 
    private houseRulesService: HouseRulesService,
    private authService: AuthService,
    private modalController: ModalController, 
    private router: Router,
  ) { }
  
  ngOnInit() {
    
    this.isLoading = true;
    Preferences.get({key:'USER_INFO'}).then(async (value)=>{
      if(value?.value){
        const chosenUnit = await Preferences.get({key:'ACTIVE_UNIT'})
        
        var accessToken = this.authService.parseJWTParams(value.value)
        await this.presentModal(accessToken?.email);
        
        this.loadHouseRules();
        this.fetchContacts();
        this.loadPreferenceProjectName();
        this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
            if (event['url'] == '/record'){
              this.paramForBadgeNotification = 0
              this.loadCountNotification();
            }
             // Panggil fungsi lagi saat halaman dibuka
          }
        });
        // if(chosenUnit.value){


        // }else{
        //   // await Preferences.set({
        //   //   key: 'ACTIVE_UNIT',
        //   //   value: '1',
        //   // })
          
        //   // var accessToken = this.authService.parseJWTParams(value.value)
  
          
        //   // this.loadHouseRules();
        //   // this.loadCountNotification();
        //   // this.fetchContacts();
        //   // this.route.navigate(['/my-profile-estate'])
        //   this.loadPreferenceProjectName()
        // }

        // var parseResult = value ? JSON.parse(value.value) : null
        // console.log();
      }else{
        await this.presentModal('jenvel@gmail.com');
        this.loadHouseRules();
        this.fetchContacts();
        this.loadPreferenceProjectName();
        this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
            if (event['url'] == '/record'){
              this.paramForBadgeNotification = 0
              this.loadCountNotification();
            }
             // Panggil fungsi lagi saat halaman dibuka
          }
        });

        // this.route.navigate(['/login-end-user'])
      }
    })
  }

  ionViewWillEnter(){
    this.loadPreferenceProjectName()
  }

  async presentModal(email: string= '') {
    console.log(email);
    console.log('presentModalpresentModalpresentModalpresentModalpresentModal');
    
    const modal = await this.modalController.create({
      component: EstateModalPage,
      cssClass: 'record-modal',
      componentProps: {
        // email: email
        email: email
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        this.loadPreferenceProjectName()
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
    const projectName = await Preferences.get({key: 'PROJECT_NAME'})
    console.log(projectName);
    console.log('projectNameprojectNameprojectNameprojectName');
    
    if(projectName?.value){
      this.condominiumName = projectName.value
    }
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
          this.paramForBadgeNotification = response.result.notifications; // Simpan jumlah notifikasi baru
          // if (this.paramForBadgeNotification) {
          //   console.log('it works!', this.paramForBadgeNotification)
          // }
          console.log(response.result)
        } else {
          console.error('Error:', response);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }


  directToNotifications() {
    this.paramForBadgeNotification = 0;
    this.route.navigate(['resident-notification']);

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
    Preferences.get({key: 'ACTIVE_PROJECT'}).then((value)=>{
      if(value.value){
        this.houseRulesService.getHouseRules(parseInt(value.value)).subscribe(
          response => {
            if (response.result.response_code === 200) {
              console.log("heres the data", response);
              this.houseRules = response.result.result.map((item: any) => ({
                title: item.name,
                base64Doc: item.documents // Pastikan item.documents adalah string base64
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
