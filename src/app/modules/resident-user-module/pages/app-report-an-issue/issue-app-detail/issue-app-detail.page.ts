import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-issue-app-detail',
  templateUrl: './issue-app-detail.page.html',
  styleUrls: ['./issue-app-detail.page.scss'],
})
export class IssueAppDetailPage implements OnInit {

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  private isUserScrolling: boolean = false; // Variabel untuk menyimpan status scroll

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    if (!this.isUserScrolling) { // Hanya scroll ke bawah jika pengguna tidak menggulir
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        setTimeout(() => {
          this.messageContainer.nativeElement.scrollTo({
            top: this.messageContainer.nativeElement.scrollHeight,
            behavior: 'smooth' // Animasi smooth scrolling
          });
        }, 300); // Delay kecil untuk memastikan elemen sudah dirender
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    // Jika pengguna menggulir ke atas, set isUser Scrolling ke true
    this.isUserScrolling = scrollTop + clientHeight < scrollHeight;
  }

  ticketDetail: any = {}
  fromWhere: string = '';

  messageDetail: any = []

  constructor(private router: Router, public functionMain: FunctionMainService, private clientMainService: ClientMainService, private mainApi: MainApiResidentService,) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { ticketDetail: any, fromWhere: string };
    if (state) {
      this.fromWhere = state.fromWhere;
      // // console.log(state);
      this.ticketDetail = state.ticketDetail;
      // this.exit_date = temp_schedule.setHours(temp_schedule.getHours() + 1);
      if (this.ticketDetail = state.ticketDetail) {
        this.loadDetail()
      }
    } 
  }

  isLoading: boolean = false;
  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.loadDetail();
      event.target.complete();
    }, 1000)
  }

  ngOnInit() {
  }

  extend_mb = false

  testAddMb(status: boolean = false) {
    this.extend_mb = status
  }

  loadDetail(){
    this.mainApi.endpointMainProcess({ticket_id: this.ticketDetail.ticket_id}, 'get/report_issue_detail').subscribe({
      next: (results) => {
        // console.log(results)
        if (results.result.response_code == 200) {
          this.isLoading = false;
          this.messageDetail = results.result.conversation_result.filter((item: any) => item.body !== '')
          this.ticketDetail = results.result.result[0]
          // this.ticketDetail.attachment = results.result.result[0].attachment.map((item:any) => this.functionMain.getImage(item) )
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`Failed!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  replyForm = {
    ticket_id: 0,
    ir_attachments: [],
    body: ''
  }

  // @ViewChild('clientTicketDetailAttachment') fileInput!: ElementRef;
  // openFileInput() {
  //   this.fileInput?.nativeElement.click();
  // }
  // fileName = ''

  // selectedFile: File | null = null;
  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
  //       this.isModalChooseUpload = !this.isModalChooseUpload;
  //       this.selectedFile = file;
  //       this.fileName = file.name
  //       this.replyForm.ir_attachment_name = file.name;
  //       // console.log(file.name)
  
  //       // Konversi file ke base64
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         // Hapus prefix data URL jika ada
  //         const base64 = e.target.result.split(',')[1] || e.target.result;
  //         this.replyForm.ir_attachment_datas = base64;
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       this.functionMain.presentToast("Can only receive png, jpg, and jpg files!", 'danger')
  //     }     
  //   }
  // }
  
  isModalChooseUpload: boolean = false;
  chooseWhereToChoose() {
    console.log("tes");
    this.isModalChooseUpload = !this.isModalChooseUpload;
  }

  // New function to handle camera capture
  // async openCamera() {
  //   try {
  //     // Request camera permissions
  //     const permissionStatus = await Camera.checkPermissions();
  //     if (permissionStatus.camera !== 'granted') {
  //       await Camera.requestPermissions();
  //     }
      
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       // allowEditing: true,
  //       resultType: CameraResultType.Base64,
  //       source: CameraSource.Camera,
  //       promptLabelHeader: 'Take a photo',
  //       promptLabelCancel: 'Cancel',
  //       promptLabelPhoto: 'Take Photo',
  //     });
      
  //     if (image && image.base64String) {
  //       this.isModalChooseUpload = !this.isModalChooseUpload;
  //       // Update the form data with the base64 image
  //       this.replyForm.ir_attachment_datas = image.base64String;

  //       const timestamp = new Date().toISOString().split('T')[0];
  //       // Update display name to show a camera capture was made
  //       this.fileName = `Camera_Photo_${timestamp}`+ '.' + image.format;
  //       this.replyForm.ir_attachment_name = this.fileName
        
  //       // Display success message
  //       this.functionMain.presentToast('Photo captured successfully', 'success');
  //     } else {
  //       this.fileName = ''; // Reset if no file is selected
  //     }
  //   } catch (error) {
  //     console.error('Camera error:', error);
  //     this.functionMain.presentToast(String(error), 'danger');
  //   }
  // }

  onUploadImage(file: any): void {
    if (file){
      this.replyForm.ir_attachments = file.map((data: any) => {return {ir_attachment_name: data.name, ir_attachment_datas: data.image, ir_attachment_mimetype: data.type }});
      console.log(this.replyForm)
    }
  }

  // uploadFile() {
  //   if (this.selectedFile) {
  //     this.functionMain.presentToast(`File ${this.selectedFile.name} ready to upload`, 'success');
  //   } else {
  //     this.functionMain.presentToast('Choose your file first', 'danger');
  //   }
  // }

  fileResetValue = []
  submitReply(is_close: boolean = false) {
    if (!this.replyForm.body) {
      this.functionMain.presentToast('Reply content is required!', 'danger')
      return
    }
    // this.fileName = '';
    this.replyForm.ticket_id = this.ticketDetail.ticket_id
    this.mainApi.endpointMainProcess(this.replyForm, is_close ? 'post/reply_ticket_and_close' : 'post/reply_ticket').subscribe((results: any) => {
      if (results.result.response_code == 200) {
        this.functionMain.presentToast(`Successfully add new reply!`, 'success');
        if (is_close) {
          this.onBack(true)
        } else {
          this.replyForm.body = ''
          this.replyForm.ir_attachments = []
          this.fileResetValue = []
          this.loadDetail()
        }
        
      } else {
        this.functionMain.presentToast(`An error occurred while trying to add new reply!`, 'danger');
      }
    })
  }

  showFile = true
  onBack(is_reload: boolean = false) {
    if ( this.fromWhere === 'fromCondo') {
      this.router.navigate(['/condo-report-main'], is_reload ? {queryParams: {reload: true}} : {})
    } else {
      this.router.navigate(['/app-report-main'], is_reload ? {queryParams: {reload: true}} : {})
    }
  }

}
