import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-docs',
  templateUrl: './client-docs.page.html',
  styleUrls: ['./client-docs.page.scss'],
})
export class ClientDocsPage implements OnInit {

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.loadNotices(0)
    })
  }

  project_id = 0
  previousParentId: number = 0;
  isRoot: boolean = false;
  // previousParentIds: number[] = [];
  previousParentNames: any = [];
  // currentParentId: any = []

  onBack() {
    this.router.navigate(['/client-main-app'])
  }

  Files: any = []
  isLoading = false
  loadNotices(id: number = 0){
    this.isLoading = true
    let params = {}
    if (id) {
      params = {
        project_id: this.project_id,
        parent_id: id
      }
    } else {
      params = {project_id: this.project_id}
    }
    this.clientMainService.getApi(params, '/resident/get/docs').subscribe(
      (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.Files = results.result.result.map((file: any) => ({
            id : file.id,
            parent_id: file.parent_id,
            is_root : file.is_root,
            name : file.name,
            document : file.document,
            document_type : file.document_type,
            path : file.path,
          }));
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Error fetching notices:', error);
        this.isLoading = false
      }
    );
  }

  reqParent(id: number, name: string, parentId: any) {
    this.previousParentNames.push({id: id, name: name})
    // this.currentParentId.push(id)
    this.loadNotices(id);
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
        this.loadNotices(lastParentId); // Muat dokumen untuk parentId tersebut
        this.isRoot = this.previousParentNames.length === 0; // Periksa apakah masih di root
    } else {
        // // console.log("tes");
        this.previousParentId = 0;
        this.isRoot = false;
        this.loadNotices(); // Kembali ke file utama jika tidak ada parent
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
    this.loadNotices(id)
  }

  downloadFile(file: any) {
    console.log(file)
  }

  isOpenModal = false
  addItem() {
    // console.log(this.currentParentId)
    this.isOpenModal = true
  }

  closeModal() {
    this.isOpenModal = false
    this.selectedFile = null
    this.fileName = ''
  }

  @ViewChild('clientUploadDocument') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }
  fileName = ''
  attachment_name = ''

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

  uploadFile() {
    if (this.selectedFile) {
      console.log(this.selectedFile)
      this.functionMain.presentToast(`File ${this.selectedFile.name} ready to upload`, 'success');
    } else {
      this.functionMain.presentToast('Choose your file first', 'danger');
    }
  }

  uploadDocument() {
    let parent_id = this.previousParentNames.length > 0 ? this.previousParentNames[this.previousParentNames.length - 1].id : false
    let params = {
      project_id: this.project_id,
      name: this.attachment_name,
      parent_id: parent_id,
      attachment: this.attachment
    }
    let errMsg = ''
    if (!this.attachment_name) {
      errMsg += 'File name is required! \n'
    }
    if (!this.attachment) {
      errMsg += 'Document is required! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    console.log(params)
    this.clientMainService.getApi(params, '/client/post/docs_document').subscribe(
      (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast('Successfully upload new document!', 'success')
          this.selectedFile = null
          this.fileName = ''
          this.isOpenModal = false
          if (parent_id) {
            this.loadNotices(parent_id)
          } else {
            this.loadNotices()
          }
        } else {
          this.functionMain.presentToast('An error occurred while uploading new document!', 'danger')
        }
      },
      (error) => {
        console.error('Error fetching notices:', error);
      }
    );
  }
}
