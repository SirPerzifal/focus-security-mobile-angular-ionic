import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { NewNoticeForm } from 'src/models/client/clientNoticeModel.model';

@Component({
  selector: 'app-client-notices',
  templateUrl: './client-notices.page.html',
  styleUrls: ['./client-notices.page.scss'],
})
export class ClientNoticesPage implements OnInit {

  dataUser = {
    unit_id: 0,
    block_id: 0
  }

  constructor(private router: Router, public functionMain: FunctionMainService, private blockUnitService: BlockUnitService, private clientMainService: ClientMainService, private getUserInfoService: GetUserInfoService) { }

  ngOnInit() {
    this.getUserInfoService.getPreferenceStorage(['block', 'unit', 'project_id']).then(
      (value) => {
        console.log(value)
        this.dataUser.block_id = value.block
        this.dataUser.unit_id = value.unit
        this.newNoticeForm.project_id = value.project_id
        this.loadNotice();
      }
    )
    this.loadBlock()
    this.loadUnit()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isNotice = true
  isNew = false

  textSecond = ''

  onBack() {
    this.router.navigate(['/client-main-app'])
  }

  toggleShowNotice() {
    this.isNotice = true
    this.isNew = false
    this.textSecond = ''
    this.newNoticeForm = {
      notice_title: '',
      notice_content: '',
      notice_attachment: '',
      post_to: 'all',
      unit_ids: [],
      block_ids: [],
      start_time: new Date(),
      end_time: new Date,
      project_id: 191
    }
    this.startDate = '';
    this.endDate = '';
  }

  toggleShowNew() {
    this.isNotice = false
    this.isNew = true
    this.textSecond = 'New Notices'
    this.getUserInfoService.getPreferenceStorage(['project_id']).then(
      (value) => {
        this.newNoticeForm.project_id = value.project_id
      }
    )
  }

  showNotice: any = []

  loadNotice() {
    const params = {
      unit_id: [this.dataUser .unit_id], // Pastikan ini adalah array
      block_id: [this.dataUser .block_id] // Pastikan ini adalah array
    };
  
    this.clientMainService.getApi({}, '/client/get/notice').subscribe(
      (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.showNotice = results.result.response_result.map((notice: any) => {
            return {
              id: notice.id,
              title: notice.notice_title,
              notice_date: notice.start_date,
              remark: notice.notice_content,
              notice_attachment: notice.notice_attachment,
              start_time: notice.start_date,
              end_time: notice.end_date,
            };
          })
        }
      },
      (error) => {
        console.error('Error fetching notices:', error);
      }
    );
  }

  deleteNotice(notice: any) {
    const notice_id = notice.id;
    this.clientMainService.getApi({notice_id}, '/client/post/delete_notice').subscribe(
      (results) => {
        if (results.result.response_code == 200) {
          this.loadNotice()
          this.showNotice = [];
          this.loadNotice();
          this.functionMain.presentToast(`Successfully deleted the notice!`,'success');
        } else {
          this.functionMain.presentToast(`An error occurred while deleting the notice!`, 'danger');
        }
      }, (error) => {
        this.functionMain.presentToast(`An error occurred while deleting the notice!`, 'danger');
        console.error(error);
      }
    )
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

  // new notice 
  screenExtend: boolean = false;
  isArrayAndJoin(options: any, names: string[]): string {
    if (Array.isArray(options) && Array.isArray(names)) {
      return names.join(', ') || '-'; // Mengembalikan nama yang disimpan
    } else {
      return options.option || '-';
    }
  }
  onChangeStartDate(event: any) {
    this.startDate = event.target.value;
    this.newNoticeForm.start_time = new Date(this.startDate);
    // console.log(event.target.value);
  }
  onChangeEndDate(event: any) {
    this.endDate = event.target.value;
    this.newNoticeForm.end_time = new Date(this.endDate);
    // console.log(event.target.value);
  }

  @ViewChild('clientNoticeNewAttachment') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }
  fileName = ''

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name

      // Konversi file ke base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Hapus prefix data URL jika ada
        const base64 = e.target.result.split(',')[1] || e.target.result;
        this.newNoticeForm.notice_attachment = base64;
      };
      reader.readAsDataURL(file);
    }
  }
  // Method untuk mengupload file (opsional, bisa dihapus jika tidak diperlukan)
  uploadFile() {
    if (this.selectedFile) {
      this.functionMain.presentToast(`File ${this.selectedFile.name} ready to upload`, 'success');
    } else {
      this.functionMain.presentToast('Choose your file first', 'danger');
    }
  }

  setDropdownPostTo = false;
  toggleDropdownPostTo() {
    this.setDropdownPostTo = !this.setDropdownPostTo; // Toggle dropdown
    this.screenExtend = true
    this.newNoticeForm.block_ids = []
    this.blockArrayProcess = []
    this.blockNames = []
    this.newNoticeForm.unit_ids = []
    this.unitArrayProcess= []
    this.unitNames = []
    this.setDropdownChooseBlock = false;
    this.setDropdownChooseUnit = false;
  }
  hideDropdownPostTo() {
    this.setDropdownPostTo = false; // Menyembunyikan dropdown
  }
  // Menangani pemilihan opsi
  selectOptionPostTo(value: string) {
      // console.log(`Selected option: ${value}`); // Tindakan yang diinginkan saat opsi dipilih
      this.newNoticeForm.post_to = value;
      this.hideDropdownPostTo(); // Menyembunyikan dropdown setelah memilih opsi
  }

  Block: any = []
  blockNames: string[] = [];
  blockArrayProcess: any = []
  setDropdownChooseBlock = false;
  toggleDropdownChooseBlock() {
    this.setDropdownChooseBlock = !this.setDropdownChooseBlock; // Toggle dropdown
  }
  hideDropdownChooseBlock() {
    this.setDropdownChooseBlock = false; // Menyembunyikan dropdown
  }
  // Menangani pemilihan opsi
  selectOptionChooseBlock(block_id: number) {
    // console.log(`Selected option: ${block_id}`); // Tindakan yang diinginkan saat opsi dipilih
    this.onBlockChange(block_id);
  }
  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result.map((item: any) => {return {id: item.id, name: item.block_name}});
        } else {
          this.functionMain.presentToast('Failed to load block data', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading block data', 'danger');
        console.error('Error:', error);
      }
    });
  }
  onBlockChange(block_id: any) {
    const block = this.Block.find((b: any) => b.id === block_id); // Temukan blok berdasarkan ID
    if (block) {
      const index = this.blockArrayProcess.indexOf(block_id);
      if (index !== -1) {
        // Jika ada, hapus block_id dari array
        this.blockArrayProcess.splice(index, 1);
        this.blockNames.splice(index, 1); // Hapus nama dari array
      } else {
        // Jika tidak ada, tambahkan block_id ke dalam array
        this.blockArrayProcess.push(block_id);
        this.blockNames.push(block.block_name); // Tambahkan nama ke array
      }
    }
  
    // Update newNoticeForm.block_ids
    this.newNoticeForm.block_ids = [...this.blockArrayProcess]; // Menggunakan spread operator untuk menyalin array
  }

  Unit: any = []
  showUnit: any = []
  unitNames: any[] = [];
  unitArrayProcess: any = []
  setDropdownChooseUnit = false;
  @ViewChild('unit_typing') unitInput!: ElementRef;
  @ViewChild('before_click_unit') beforeUnitInput!: ElementRef;
  toggleDropdownChooseUnit() {
    console.log(this.unitInput)
    if (this.unitInput) {
      this.unitInput?.nativeElement.focus()
    } else {
      this.beforeUnitInput?.nativeElement.focus()
    }
    this.setDropdownChooseUnit = !this.setDropdownChooseUnit; // Toggle dropdown
  }
  hideDropdownChooseUnit() {
    this.setDropdownChooseUnit = false; // Menyembunyikan dropdown
  }
  // Menangani pemilihan opsi
  selectOptionChooseUnit(unitId: number) {
    this.unit_key = ''
    this.showUnit = this.Unit
    // console.log(`Selected option: ${value}`); // Tindakan yang diinginkan saat opsi dipilih
    this.onUnitChange(unitId)
  }

  optionCheck(unit_id: number) {
    let filter = this.unitNames.filter((item: any) => item.id == unit_id)
    return filter.length > 0
  }

  loadUnit() {
    this.clientMainService.getApi({}, '/residential/get/all/units_by_project_id').subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => {return {id: item.id, name: item.unit_name}});
          this.showUnit = this.Unit
        } else {
          this.functionMain.presentToast('Failed to load unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }
  onUnitChange(unitId: any) {
    const unit = this.Unit.find((u: any) => u.id === unitId); // Temukan unit berdasarkan ID
    if (unit) {
      const index = this.unitArrayProcess.indexOf(unitId);
      if (index !== -1) {
        // Jika ada, hapus unit_id dari array
        this.unitArrayProcess.splice(index, 1);
        this.unitNames = this.unitNames.filter((item: any) => {console.log(item, item.id, unitId) ;return item.id !== unitId}); // Hapus nama dari array
      } else {
        // Jika tidak ada, tambahkan unit_id ke dalam array
        this.unitArrayProcess.push(unitId);
        this.unitNames.push({'name': unit.unit_name, 'id': unitId}); // Tambahkan nama ke array
      }
    }
  
    // Update newNoticeForm.unit_ids
    this.newNoticeForm.unit_ids = [...this.unitArrayProcess]; // Menggunakan spread operator untuk menyalin array
    console.log(this.unitNames)
  }

  unit_key = ''
  onUnitKeyUp(event: any) {
    console.log(event.target.value)
    this.setDropdownChooseUnit = true
    this.showUnit = this.Unit.filter((item: any) => item.unit_name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  unitChange(event: any) {
    console.log(event)
    this.newNoticeForm.unit_ids = event
  }

  blockChange(event: any) {
    console.log(event)
    this.newNoticeForm.block_ids = event
  }

  startDate = '';
  endDate = '';
  newNoticeForm: NewNoticeForm = {
    notice_title: '',
    notice_content: '',
    notice_attachment: '',
    post_to: 'all',
    unit_ids: [], // Sekarang ini adalah array of numbers
    block_ids: [], // Sekarang ini adalah array of numbers
    start_time: new Date(),
    end_time: new Date(),
    project_id: 191,
  }
  onSubmitPost() {
    console.log(this.newNoticeForm)
    let errMsg = ''
    if (!this.newNoticeForm.notice_title) {
      errMsg += "Notice attachment is required! \n"
    }
    if (!this.startDate) {
      errMsg += "Start date is required! \n"
    }
    if (!this.endDate) {
      errMsg += "End date is required! \n"
    }
    if (!this.newNoticeForm.notice_attachment) {
      errMsg += "Notice attachment is required! \n"
    }
    if (this.newNoticeForm.post_to == 'block' && this.newNoticeForm.block_ids.length == 0) {
      errMsg += "At least one block must be selected! \n"
    }
    if (this.newNoticeForm.post_to == 'unit' && this.newNoticeForm.unit_ids.length == 0) {
      errMsg += "At least one unit must be selected! \n"
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    this.clientMainService.getApi(this.newNoticeForm, '/client/post/notice').subscribe(
      (results) => {
        // console.log(results
        if (results.result.response_code == 200) {
          this.functionMain.presentToast('Notice posted successfully','success');
          this.showNotice = [];
          this.toggleShowNotice();
          this.loadNotice();
          this.newNoticeForm = {
            notice_title: '',
            notice_content: '',
            notice_attachment: '',
            post_to: 'all',
            unit_ids: [],
            block_ids: [],
            start_time: new Date(),
            end_time: new Date(),
            project_id: 191
          }
          this.blockArrayProcess = []
          this.blockNames = []
          this.unitArrayProcess= []
          this.unitNames = []
          this.screenExtend = false
        } else {
          console.log(results);
          this.functionMain.presentToast('Failed to post notice', 'danger');
        }
      },
      (error) => {
        console.error('Error posting notice:', error);
        this.functionMain.presentToast('Failed to post notice', 'danger');
      }
    )
  }
}
