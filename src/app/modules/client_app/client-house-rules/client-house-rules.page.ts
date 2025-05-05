import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Capacitor } from '@capacitor/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

@Component({
  selector: 'app-client-house-rules',
  templateUrl: './client-house-rules.page.html',
  styleUrls: ['./client-house-rules.page.scss'],
})
export class ClientHouseRulesPage implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService, private clientMainService: ClientMainService, private getUserInfoService: GetUserInfoService) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id;
      this.loadDocument()
    })
  }

  @ViewChild('clientTicketNewAttachment') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }
  fileName = ''

  project_id = 751

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBack(){
    this.router.navigate(['/client-main-app'])
  }

  documentList: any = []

  attachment = ''
  selectedFile: File | null = null;
  onFileSelected(event: any) {
    console.log(event.target.files)
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name

      // Konversi file ke base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Hapus prefix data URL jika ada
        const base64 = e.target.result.split(',')[1] || e.target.result;
        this.attachment = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  // Method untuk mengupload file (opsional, bisa dihapus jika tidak diperlukan)
  uploadFile() {
    if (this.selectedFile) {
      console.log(this.selectedFile)
      this.clientMainService.getApi({name: this.selectedFile.name,project_id: this.project_id,documents: this.attachment,upload_date: new Date()}, '/project/post/add_house_rules').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.status_code == 200) {
            this.loadDocument()
            this.fileName = ''
            this.selectedFile = null
            this.functionMain.presentToast(`Successfully add new document!`, 'success');
          } else {
            this.functionMain.presentToast(`An error occurred while submitting new document!`, 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while submitting new document!', 'danger');
          console.error(error);
        }
      });
    } else {
      this.functionMain.presentToast('Choose your file first', 'danger');
    }
  }

  loadDocument() {
    this.clientMainService.getApi({}, '/project/get/house_rules').subscribe({
      next: (results) => {
        console.log(results.result.response_result)
        if (results.result.response_code == 200) {
          if (results.result.response_result.length > 0) {
            this.documentList = results.result.response_result
          } else {
          }
        } else if (results.result.response_code == 402)  {
        }  else {
          this.functionMain.presentToast(`An error occurred while loading document!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading document!', 'danger');
        console.error(error);
      }
    });
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
