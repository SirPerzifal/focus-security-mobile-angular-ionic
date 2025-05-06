import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-ticket-detail',
  templateUrl: './client-ticket-detail.page.html',
  styleUrls: ['./client-ticket-detail.page.scss'],
})
export class ClientTicketDetailPage implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService, private clientMainService: ClientMainService) { }

  ngOnInit() {
    this.loadProject()
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { ticket: any, filter: any, is_open: boolean, menu: any, issue: boolean };
    if (state) {
      this.ticket = state.ticket
      this.filter = state.filter
      this.is_active = state.is_open
      this.selectedMenu = state.menu
      this.is_issue = state.issue
      console.log(this.ticket)
      this.loadDetail(true)
      if (this.is_issue) {
        this.topTitle = 'Report App Issue'
        this.secondTitle = 'Issue Detail'
      }
    } 
  }

  async loadProject() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.replyForm.user_id = value.user_id
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  selectedMenu: any = []
  is_active: boolean = true
  ticket: any = []
  ticketDetail: any = []
  messageDetail: any = []
  filter: any = []
  is_issue = false
  topTitle = 'Ticket'
  secondTitle = 'Details'

  onBack(is_include_id: boolean = false) {
    let params = is_include_id ? {queryParams: {close_id: this.ticket.id}} : {}
    if(this.is_issue) {
      this.router.navigate(['/client-app-issues'], params)
    } else {
      this.router.navigate(['/client-raise-ticket'], params)
    }
  }

  @ViewChild('clientTicketDetailAttachment') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }
  fileName = ''

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.selectedFile = file;
        this.fileName = file.name
        this.replyForm.ir_attachment_name = file.name;
        console.log(file.name)
  
        // Konversi file ke base64
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Hapus prefix data URL jika ada
          const base64 = e.target.result.split(',')[1] || e.target.result;
          this.replyForm.ir_attachment_datas = base64;
        };
        reader.readAsDataURL(file);
      } else {
        this.fileName = ''
        this.functionMain.presentToast("Can only receive png, jpg, and jpg files!", 'danger')
      }     
    }
  }

  replyForm = {
    user_id: '',
    ticket_id: 0,
    ir_attachment_datas: '',
    ir_attachment_name: '',
    ir_attachment_mimetype: '',
    body: ''
  }

  messageArray = [
    {
      user: 2,
      message: 'Hello and thank you for your report, please wait a moment so we can solve this issue.'
    },
    {
      user: 1,
      message: 'Okay, take your moment.'
    }
  ]

  // Method untuk mengupload file (opsional, bisa dihapus jika tidak diperlukan)
  uploadFile() {
    if (this.selectedFile) {
      this.functionMain.presentToast(`File ${this.selectedFile.name} ready to upload`, 'success');
    } else {
      this.functionMain.presentToast('Choose your file first', 'danger');
    }
  }

  isLoading = false
  isLoadingFirst = false
  loadDetail(loadingFirst: boolean = false){
    if (loadingFirst) {
      this.isLoadingFirst = true
    }
    this.isLoading = true
    this.clientMainService.getApi({ticket_id: this.ticket.id}, '/client/get/report_issue_detail').subscribe({
      next: (results) => {
        this.isLoading = false
        this.isLoadingFirst = false
        console.log(results)
        if (results.result.response_code == 200) {
          this.messageDetail = results.result.conversation_result.filter((item: any) => item.body !== '')
          this.ticketDetail = results.result.result[0]
          // this.ticketDetail.attachment = results.result.result[0].attachment.map((item:any) => this.functionMain.getImage(item) )
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`Failed!`, 'danger');
        }
      },
      error: (error) => {
        this.isLoading = false
        this.isLoadingFirst = false
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  showFile = true
  submitReply(is_close: boolean = false) {
    if (!this.replyForm.body) {
      this.functionMain.presentToast('Reply content is required!', 'danger')
      return
    }
    this.replyForm.ticket_id = this.ticket.id
    console.log(this.replyForm)
    this.clientMainService.getApi(this.replyForm, is_close ? '/client/post/reply_ticket_and_close' : '/client/post/reply_ticket').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.showFile = false
          this.functionMain.presentToast(`Successfully add new reply!`, 'success');
          if (is_close) {
            this.ticket.ticket_status = 'Solved'
            this.ticket.solved_on = results.result.close_date
            this.onBack(true)
          } else {
            this.replyForm.body = ''
            this.replyForm.ir_attachment_datas = ''
            this.fileName = ''
            this.loadDetail()
          }
          setTimeout(() => {
            this.showFile = true
          }, 300)
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

  onUploadImage(file: any): void {
    if (file){
      let data = file;
      this.replyForm.ir_attachment_datas = file.image
      this.replyForm.ir_attachment_name = file.name
      this.replyForm.ir_attachment_mimetype = file.type
      console.log(data)
    }
  }
  
  
}
