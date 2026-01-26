import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-square-button',
  templateUrl: './square-button.component.html',
  styleUrls: ['./square-button.component.scss'],
})
export class SquareButtonComponent  implements OnInit {

  @Input() active: boolean = true;
  @Input() name: string = '';
  @Input() srcImage: string = '';
  @Input() routeLinkTo: string = '';
  @Input() paramForBadgeNotification: number = 0;
  @Input() documentId: string = '';
  @Input() click: boolean = false;
  @Output() eventEmitter = new EventEmitter<any>();

  constructor(private router: Router, private mainApi: MainApiResidentService) { }

  ngOnInit() {
  }

  routeBasic(name?: any) {
    if (this.click === true) {
      this.eventEmitter.emit([true, name])
    } else {
      this.router.navigate([this.routeLinkTo])
      console.log("tes", this.routeLinkTo);
      
      if (name === 'Report an Issue') {
        this.router.navigate(['/condo-report-main'], {
          state: {
            fromWhere: 'condo-report',
          }
        });
      }
    }
  }

  routeLinkNotification() {
    this.paramForBadgeNotification = 0;
    this.router.navigate([this.routeLinkTo])
  }

  async downloadDocument(documentId: string) {
    this.mainApi.endpointMainProcess({
      document_id: documentId,
      type_request: 'house_rule_resident'
    }, 'get/download_document').subscribe(async (response: any) => {
      try {
        const byteCharacters = atob(response.result.blob);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: response.result.type });

        if (Capacitor.isNativePlatform()) {
          const base64 = await this.convertBlobToBase64(blob);
          const saveFile = await Filesystem.writeFile({
            path: `${response.result.title}.pdf`,
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
          this.downloadFile(href, `${response.result.title}.pdf`);
        }
      } catch (error) {
        console.error('Error downloading document:', error);
        // Optionally, show an error message to the user
      }
    });
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
