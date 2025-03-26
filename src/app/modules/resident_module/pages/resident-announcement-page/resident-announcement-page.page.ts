import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import { NoticeAndDocService } from 'src/app/service/resident/notice-and-doc/notice-and-doc.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-resident-announcement-page',
  templateUrl: './resident-announcement-page.page.html',
  styleUrls: ['./resident-announcement-page.page.scss'],
})
export class ResidentAnnouncementPagePage implements OnInit, OnDestroy {
  unitId: number = 0;
  blockId: number = 0;

  notices: any = [];

  isLoading: boolean = true;

  constructor(private noticeAndDocService: NoticeAndDocService, private getUserInfoService: GetUserInfoService, private router: Router, public functionMainService: FunctionMainService) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        // // console.log(value);
        this.unitId = Number(parseValue.unit_id);
        this.blockId = Number(parseValue.block_id);
        
        this.loadNotice();
      }
    })
  }

  newOrOld: string = '';
  filtering() {
    // // console.log(this.newOrOld);
    
    if (this.newOrOld === 'new') {
      this.notices = this.originalNotices.slice().sort((a: any, b: any) => new Date(b.create_date).getTime() - new Date(a.create_date).getTime());
    } else if (this.newOrOld === 'old') {
      this.notices = this.originalNotices.slice().sort((a: any, b: any) => new Date(a.create_date).getTime() - new Date(b.create_date).getTime());
    } else if (this.newOrOld === 'favourite') {
      this.notices = this.originalNotices.filter((notice: any) => notice.is_prioritize);
    } else if (this.newOrOld === 'all') {
      // // console.log("tes");
      
      this.notices = [...this.originalNotices]; // Kembalikan ke semua notices jika tidak ada filter
    }
  }

  originalNotices: any[] = []; // Menyimpan salinan dari notices asli

  loadNotice() {
    this.noticeAndDocService.focusResidentialGetNotices(
      this.unitId,
      this.blockId
    ).subscribe(
      (response) => {
        this.notices = response.result.response_result
          .map((notice: any) => ({
            id: notice.id,
            name: notice.name,
            notice_title: notice.notice_title,
            notice_content: notice.notice_content,
            notice_attachment: notice.notice_attachment,
            start_date: notice.start_date,
            end_date: notice.end_date,
            create_date: notice.create_date,
            is_prioritize: notice.is_prioritize
          }))
          .sort((a: any, b: any) => (b.is_prioritize ? 1 : 0) - (a.is_prioritize ? 1 : 0)); // Mengurutkan berdasarkan prioritas
  
        this.originalNotices = [...this.notices]; // Simpan salinan asli
        if (this.originalNotices) {
          this.isLoading = false;
        }
        // // console.log(this.notices);
      }, (error) => {
        console.error(error);
      }
    );
  }

  prioritizeNotice(noticeid: any) {
    if (noticeid.is_prioritize) {
      // // console.log("suk sini", noticeid.id);
      this.noticeAndDocService.focusResidentialPostNoticesDeletePriority(this.unitId, Number(noticeid.id)).subscribe(
        (response) => {
          // // console.log(response);
          this.notices = [];
          this.loadNotice();
        }, (error) => {
          console.error(error);
        }
      )
    } else {
      // console.log("suk sini ni", noticeid.id);
      this.noticeAndDocService.focusResidentialPostNoticesSetPriority(this.unitId, Number(noticeid.id)).subscribe(
        (response) => {
          // console.log(response);
          this.notices = [];
          this.loadNotice();
        }, (error) => {
          console.error(error);
        }
      )
    }
  }

  async downloadAttachment(base64Attachment: any) {
    // console.log(base64Attachment);
    
    const title = "document";
    try {
      const byteCharacters = atob(base64Attachment);
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

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
