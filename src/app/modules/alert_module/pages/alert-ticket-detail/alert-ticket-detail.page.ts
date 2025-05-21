import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-alert-ticket-detail',
  templateUrl: './alert-ticket-detail.page.html',
  styleUrls: ['./alert-ticket-detail.page.scss'],
})
export class AlertTicketDetailPage implements OnInit {

  constructor(
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
    private router: Router
  ) {
    
   }

  ngOnInit() {
    this.loadProjectName()
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { ticket_id: any};
    if (state) {
      console.log(state)
      this.params.ticket_id = state.ticket_id
      this.loadTicketsDetail(true)
    } 
  }

  showFile = true
  
  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBackTicket() {
    console.log("BACK")
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.user_id = value.user_id
    })
  }

  user_id = 0

  alert: any = []
  messages: any = []

  params = {
    ticket_id: ''
  }

  isLoading = false
  isLoadingFirst = false
  loadTicketsDetail(is_first: boolean = false){
    if (is_first) {
      this.isLoadingFirst = true
    }
    this.isLoading = true
    this.clientMainService.getApi({ticket_id: this.params.ticket_id}, '/vms/get/report_issue_detail').subscribe({
      next: (results) => {
        this.isLoadingFirst = false
        this.isLoading = false
        console.log('tickets', results)
        if (results.result.response_code === 200) {
          this.alert = results.result.result[0]
          this.messages = results.result.conversation_result
          console.log(this.alert)
          console.log(this.messages)
        } 
      },
      error: (error) => {
        this.isLoadingFirst = false
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading tickets detail!', 'danger');
        console.error(error);
      }
    });
  }

  reply_message = ''
  // returnDate(body_date: string) {
  //   new Date
  // }

  onReplySubmit(is_close: boolean = false) {
    let errMsg = ''
    if (this.reply_message == ''){
      this.functionMain.presentToast('Please fill in the reply message before submitting!', 'danger')
      return
    }
    let apiUrl = '/vms/post/reply_ticket'
    if (is_close){
      apiUrl = '/vms/post/reply_ticket_and_close'
    }
    this.clientMainService.getApi({ticket_id: this.params.ticket_id, body: this.reply_message, ir_attachment_datas: this.image_file, ir_attachment_name: this.image_name, user_id: this.user_id}, apiUrl).subscribe({
      next: (results) => {
        console.log('tickets', results)
        this.showFile = false
        if (results.result.response_code === 200) {
          if (is_close){
            this.router.navigate(['/alert-main'], {queryParams: { ticket: true }})
          } else {
            this.reply_message = ''
            this.image_file = ''
            this.image_name = ''
            this.loadTicketsDetail()
          }
          
        } 
        setTimeout(() => {
          this.showFile = true
        }, 300)
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading tickets detail!', 'danger');
        console.error(error);
      }
    });
  }

  image_file = ''
  image_name = ''
  image_mimetype = ''
  onUploadImage(file: any): void {
    if (file){
      let data = file;
      this.image_file = file.image
      this.image_name = file.name
      this.image_mimetype = file.type
      console.log(data)
    }
    //   if (['image/png', 'application/pdf', 'application/msword', 'image/jpeg', 'image/jpg'].includes(data.type)) {
    //     this.image_name = data.name
    //     console.log(this.image_name)
    //     this.convertToBase64(data).then((base64: string) => {
    //       this.image_file = base64.split(',')[1]
    //     }).catch(error => {
    //       console.error('Error converting to base64', error);
    //     });
    //   } else {
    //     this.image_name = ''
    //     this.functionMain.presentToast("Can only receive pdf, doc, png, jpg, and jpg files!", 'danger')
    //   }
    // } 
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  handleRefresh(event: any) {
    this.loadTicketsDetail()
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }
}
