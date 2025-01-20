import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { Router } from '@angular/router';
import { Contacts } from '@capacitor-community/contacts';
import { ToastController } from '@ionic/angular';
import { HouseRulesService } from 'src/app/service/resident/house-rules/house-rules.service';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

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

  constructor(private notificationService: NotificationService, private route: Router, private toastController: ToastController, private houseRulesService: HouseRulesService) { }
  
  ngOnInit() {
    this.loadHouseRules();
    this.loadCountNotification();
    this.fetchContacts();
  }
  
  async fetchContacts() {
    const PermissionStatus = await Contacts.requestPermissions();
    if (PermissionStatus.contacts === 'granted') {
      this.presentToast('Now you app sync with your contact!', 'success');
    }
  }


  loadCountNotification() {
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
    this.houseRulesService.getHouseRules(1).subscribe(
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
