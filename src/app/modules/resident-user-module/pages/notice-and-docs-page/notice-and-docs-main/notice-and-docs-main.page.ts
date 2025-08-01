import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-notice-and-docs-main',
  templateUrl: './notice-and-docs-main.page.html',
  styleUrls: ['./notice-and-docs-main.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class NoticeAndDocsMainPage implements OnInit, OnDestroy {

  isLoading: boolean = true;
  pageName: string = '';
  showNotice: boolean = true;
  showDocs: boolean = false;
  navButtons: any[] = [
    { 
      text: 'Notices', 
      active: true,
      action: 'click'
    },
    { 
      text: 'Docs', 
      active: false,
      action: 'click'
    },
  ]

  notices: any = [];
  originalNotices: any[] = []; // Menyimpan salinan dari notices asli
  newOrOld: string = '';

  //docs
  files: any = [];

  isRoot: boolean = false;
  previousParentId: number = 0;
  previousParentIds: number[] = [];
  previousParentNames: any = [];

  constructor(
    public functionMainService: FunctionMainService,
    private mainApi: MainApiResidentService,
  ) { }

  handleRefresh(event: any) {
    this.isLoading = true;
    if (this.pageName === 'Notices') {
      setTimeout(() => {
        this.navButtons[1].active = false;
        this.navButtons[0].active = true;
        this.pageName = 'Notices';
        this.loadNotice();
        this.showDocs = false;
        this.showNotice = true;
        event.target.complete();
      }, 1000)
    } else {
      setTimeout(() => {
        this.navButtons[0].active = false;
        this.navButtons[1].active = true;
        this.pageName = 'Docs';
        if (this.previousParentNames.length > 0) {
          console.log("suk atas", this.previousParentIds, this.isRoot);
          // Ambil parentId terakhir dari array
          const lastParentId = this.previousParentNames[this.previousParentNames.length - 1].id // Hapus dan ambil parentId terakhir
          // // console.log(this.previousParentNames);
          this.loadDocuments(lastParentId); // Muat dokumen untuk parentId tersebut
          this.isRoot = this.previousParentNames.length === 0; // Periksa apakah masih di root
        } else {
          console.log("suk bawah", this.previousParentId, this.isRoot);
          this.previousParentId = 0;
          this.isRoot = false;
          this.loadFile(); // Kembali ke file utama jika tidak ada parent
        }
        this.showNotice = false;
        this.showDocs = true;
        event.target.complete();
      }, 1000)
    }
  }

  ngOnInit() {
    this.pageName = 'Notices'
    this.loadNotice();
  }

  onClick(event: any) {
    console.log(event);
    if (this.pageName === 'Notices') {
      this.notices = [];
      this.originalNotices = [];
      this.navButtons[0].active = false;
      this.navButtons[1].active = true;
      this.pageName = 'Docs';
      this.loadFile();
      this.showNotice = false;
      this.showDocs = true;
    } else {
      this.navButtons[1].active = false;
      this.navButtons[0].active = true;
      this.pageName = 'Notices';
      this.loadNotice();
      this.showDocs = false;
      this.showNotice = true;
    }
  }

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

  loadNotice() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD

    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/notice').subscribe((response: any) => {
      this.notices = response.result.response_result
        .filter((notice: any) => {
          const noticeStartDate = new Date(notice.start_date).toISOString().split('T')[0];
          const noticeEndDate = new Date(notice.end_date).toISOString().split('T')[0];
          
          // Filter untuk notice yang sedang aktif (start_date <= today <= end_date)
          return noticeStartDate <= todayString && noticeEndDate >= todayString;
        })
        .map((notice: any) => ({
          id: notice.id,
          name: notice.name,
          notice_title: notice.notice_title,
          notice_content: notice.notice_content,
          start_date: notice.start_date,
          end_date: notice.end_date,
          create_date: notice.create_date,
          is_prioritize: notice.is_prioritize
        }))
        .sort((a: any, b: any) => (b.is_prioritize ? 1 : 0) - (a.is_prioritize ? 1 : 0));

      this.originalNotices = [...this.notices];
      if (this.originalNotices) {
        this.isLoading = false;
      }
    });
  }

  prioritizeNotice(noticeid: any) {
    if (noticeid.is_prioritize) {
      this.mainApi.endpointMainProcess({
        notice_id: Number(noticeid.id)
      }, 'post/delete_notice_priority').subscribe((response: any) => {
        // // console.log(response);
        this.notices = [];
        this.loadNotice();
      }, (error) => {
        console.error(error);
      })
    } else {
      this.mainApi.endpointMainProcess({
        notice_id: Number(noticeid.id)
      }, 'post/notice_set_priority').subscribe((response: any) => {
        // // console.log(response);
        this.notices = [];
        this.loadNotice();
      }, (error) => {
        console.error(error);
      })
    }
  }

  loadFile() {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/docs').subscribe((response: any) => {
      console.log("load", response)
      this.files = response.result.result.map((file: any) => ({
        id : file.id,
        parent_id: file.parent_id,
        is_root : file.is_root,
        name : file.name,
        document : file.document,
        document_type : file.document_type,
        path : file.path,
        create_date: file.create_date,
        has_document: file.has_document || false,
        file_size: file.file_size || 0,
        file_size_mb: file.file_size_mb || 0,
        download_url: file.download_url || '',
      }));
      this.isLoading = false;
    })
  }

  private loadDocuments(parentId?: number) {
    this.mainApi.endpointMainProcess({
      parent_id: parentId
    }, 'get/docs').subscribe((response: any) => {
      console.log("load", response)
      this.files = response.result.result.map((file: any) => ({
        id : file.id,
        parent_id: file.parent_id,
        is_root : file.is_root,
        name : file.name,
        document : file.document,
        document_type : file.document_type,
        path : file.path,
        create_date: file.create_date,
        has_document: file.has_document || false,
        file_size: file.file_size || 0,
        file_size_mb: file.file_size_mb || 0,
        download_url: file.download_url || '',
      }));
      this.isLoading = false
      // if (this.files.is_root = true) {
      //   this.previousParentId = 0;
      // } 
    })
  }

  reqParent(id: number, name: string, parentId: any) {
    this.previousParentNames.push({id: id, name: name})
    // this.currentParentId.push(id)
    this.loadDocuments(id);
    if (parentId != 0) {
        // // console.log('Ada parent');
        this.isRoot = false;
        this.previousParentId = parentId;
        // this.previousParentIds.push(parentId); // Simpan parentId ke array
    } else {
        // // console.log('Gaada parent');
        this.isRoot = true;
        // this.previousParentIds = []; // Reset jika tidak ada parent
    }
  }
  
  backToPreviousparent() {
    this.previousParentNames.pop(); // Hapus dan ambil parentId terakhir
    // this.currentParentId.pop()
    if (this.previousParentNames.length > 0) {
        // Ambil parentId terakhir dari array
        const lastParentId = this.previousParentNames[this.previousParentNames.length - 1].id // Hapus dan ambil parentId terakhir
        // // console.log(this.previousParentNames);
        this.loadDocuments(lastParentId); // Muat dokumen untuk parentId tersebut
        this.isRoot = this.previousParentNames.length === 0; // Periksa apakah masih di root
    } else {
        // // console.log("tes");
        this.previousParentId = 0;
        this.isRoot = false;
        this.loadFile(); // Kembali ke file utama jika tidak ada parent
    }
    console.log(this.previousParentNames)
  }

  jumpFolder(id: number) {
    let index = this.previousParentNames.findIndex((item: any) => {console.log(item); return item.id == id})
    console.log(index)
    this.previousParentNames = this.previousParentNames.slice(0, index + 1)
    // this.previousParentIds = this.previousParentIds.slice(0, index + 1)
    // console.log(this.previousParentIds)
    console.log(this.previousParentNames)
    this.loadDocuments(id)
  }

  async downloadAttachment(idDocument: number, type: string = '') {
    this.mainApi.endpointMainProcess({
      document_id: idDocument,
      type_request: type
    }, 'get/download_document').subscribe(async (response: any) => {
      console.log("download", response);
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
            path: `${response.result.title}`,
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
          this.downloadFile(href, `${response.result.title}`);
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

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
