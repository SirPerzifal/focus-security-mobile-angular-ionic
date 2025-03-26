import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import { NoticeAndDocService } from 'src/app/service/resident/notice-and-doc/notice-and-doc.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

@Component({
  selector: 'app-favourite-announcement',
  templateUrl: './favourite-announcement.page.html',
  styleUrls: ['./favourite-announcement.page.scss'],
})
export class FavouriteAnnouncementPage implements OnInit, OnDestroy {
  isLoading: boolean = true;
  projectId: number = 0;
  files: any = [];
  previousParentId: number = 0;
  isRoot: boolean = false;
  previousParentIds: number[] = [];
  previousParentNames: string[] = [];

  constructor(private noticeAndDocService: NoticeAndDocService, private getUserInfoService: GetUserInfoService, private router: Router) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
      // // console.log(value);
      this.projectId = Number(parseValue.project_id);
      
      this.loadFile();
      }
    })
  }

  loadFile() {
    this.noticeAndDocService.focusResidentialGetdocs(this.projectId).subscribe(
      (res) => {
        // // console.log("load", res)
        this.files = res.result.result.map((file: any) => ({
          id : file.id,
          parent_id: file.parent_id,
          is_root : file.is_root,
          name : file.name,
          document : file.document,
          document_type : file.document_type,
          path : file.path,
        }));
        this.isLoading = false;
      },
      (err) => console.error(err)
    )
  }

  private loadDocuments(parentId?: number) {
    this.noticeAndDocService.focusResidentialGetdocs(this.projectId, parentId).subscribe(
      (res) => {
        // // console.log("load", res)
        this.files = res.result.result.map((file: any) => ({
          id : file.id,
          parent_id: file.parent_id,
          is_root : file.is_root,
          name : file.name,
          document : file.document,
          document_type : file.document_type,
          path : file.path,
        }));
        this.isLoading = false
        // if (this.files.is_root = true) {
        //   this.previousParentId = 0;
        // } 
      },
      (err) => {
        console.error(err);
        // Optionally show an error message to the user
      }
    );
  }

  reqParent(id: number, name: string, parentId: any) {
    this.previousParentNames.push(name)
    // // console.log(this.previousParentNames);
    this.loadDocuments(id);
    if (parentId != 0) {
        // // console.log('Ada parent');
        this.isRoot = false;
        this.previousParentId = parentId;
        this.previousParentIds.push(parentId); // Simpan parentId ke array
    } else {
        // // console.log('Gaada parent');
        this.isRoot = true;
        this.previousParentIds = []; // Reset jika tidak ada parent
    }
  }
  
  backToPreviousparent() {
    this.previousParentNames.pop(); // Hapus dan ambil parentId terakhir
    if (this.previousParentIds.length > 0) {
        // Ambil parentId terakhir dari array
        const lastParentId = this.previousParentIds.pop(); // Hapus dan ambil parentId terakhir
        // // console.log(this.previousParentNames);
        this.loadDocuments(lastParentId); // Muat dokumen untuk parentId tersebut
        this.isRoot = this.previousParentIds.length === 0; // Periksa apakah masih di root
    } else {
        // // console.log("tes");
        this.previousParentId = 0;
        this.isRoot = false;
        this.loadFile(); // Kembali ke file utama jika tidak ada parent
    }
  }

  async downloadFile(path: any) {
    const title = "document";
    try {
      const byteCharacters = atob(path);
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
        this.downloadFileFinal(href, `${title}.pdf`);
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

  downloadFileFinal(href: string, filename: string) {
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
