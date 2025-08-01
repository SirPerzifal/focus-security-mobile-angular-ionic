import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-issue-an-detail',
  templateUrl: './issue-an-detail.page.html',
  styleUrls: ['./issue-an-detail.page.scss'],
})
export class IssueAnDetailPage implements OnInit, AfterViewChecked, AfterViewInit {

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

  messageDetail: any = []

  constructor(private router: Router, public functionMain: FunctionMainService, private clientMainService: ClientMainService) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { ticketDetail: any};
    if (state) {
      // // console.log(state);
      this.ticketDetail = state.ticketDetail;
      // this.exit_date = temp_schedule.setHours(temp_schedule.getHours() + 1);
      if (this.ticketDetail = state.ticketDetail) {
        this.loadDetail()
      }
    } 
  }

  ngOnInit() {
    this.loadProjectName()
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      // this.user_id = value.user_id
    })
  }

  family_id = 0

  extend_mb = false

  testAddMb(status: boolean = false) {
    this.extend_mb = status
  }

  loadDetail(){
    this.clientMainService.getApi({ticket_id: this.ticketDetail.ticket_id}, '/client/get/report_issue_detail').subscribe({
      next: (results) => {
        // console.log(results)
        if (results.result.response_code == 200) {
          this.messageDetail = results.result.conversation_result.filter((item: any) => item.body !== '')
          this.ticketDetail = results.result.result[0]
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
      this.functionMain.presentToast('Reply content is required!')
      return
    }
    this.replyForm.ticket_id = this.ticketDetail.ticket_id
    // console.log(this.replyForm)
    this.clientMainService.getApi(this.replyForm, is_close ? '/resident/post/reply_ticket_and_close' : '/resident/post/reply_ticket').subscribe({
      next: (results) => {
        // console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast(`Successfully add new reply!`, 'success');
          if (is_close) {
            this.onBack()
          } else {
            this.replyForm.body = ''
            this.replyForm.ir_attachments = []
            
            this.loadDetail()
          }
          
        } else {
          this.functionMain.presentToast(`An error occurred while trying to add new reply!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to add new reply!', 'danger');
        console.error(error);
      }
    });
  }

  onBack() {
    this.router.navigate(['/record'], {
      // state: {
      //   filter: this.filter,
      //   menu: this.selectedMenu 
      // },
      // queryParams: {
      //   is_open: this.ticketDetail.length > 0 ? this.ticketDetail.ticket_status == 'Solved' : this.is_active
      // }
    })
  }

  onUploadImage(file: any): void {
    if (file){
      this.replyForm.ir_attachments = file.map((data: any) => {return {ir_attachment_name: data.name, ir_attachment_datas: data.image, ir_attachment_mimetype: data.type }});
      console.log(this.replyForm)
    }
  }

}
