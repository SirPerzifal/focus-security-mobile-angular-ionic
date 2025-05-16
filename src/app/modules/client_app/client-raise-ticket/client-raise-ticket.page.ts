import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-client-raise-ticket',
  templateUrl: './client-raise-ticket.page.html',
  styleUrls: ['./client-raise-ticket.page.scss'],
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
export class ClientRaiseTicketPage implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService, private clientMainService: ClientMainService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadMenuItems()
    this.functionMain.vmsPreferences().then((value) => {
      this.newTicket.user_id = value.user_id
      this.newTicket.family_id = value.family_id
      console.log(this.newTicket);
      
    })
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if (params) {
        if (params['close_id']){
          console.log("enter here")
          console.log(this.closedTicket)
          console.log(this.openTicket)
          if (this.closedTicket.length > 0) {
            this.closedTicket.push((this.openTicket.filter((item: any) => item.id === parseInt(params['close_id'])))[0])
          }
          this.openTicket = this.openTicket.filter((item: any) => item.id != parseInt(params['close_id']))
          this.changePage()
          console.log(this.closedTicket)
          console.log(this.openTicket)
        }
      }
    })
  }
  

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isHome = true
  isData = false
  isNotMain = false
  textSecond = ''

  menuItems: any[] = [];
  selectedMenu : any = []

  isMainLoading = false
  loadMenuItems() {
    this.isMainLoading = true
    this.clientMainService.getApi({}, '/client/get/report_app_type_of_issues').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          if (results.result.result.length > 0){
            this.menuItems = results.result.result.map((result: any) => ({
              id: result.id,
              src: result.image, 
              alt: 'Icon for' + result.name, 
              route: '', 
              text: result.name
            }))
          } else {
          }
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while trying to get ticket type!`, 'danger');
        }
        this.isMainLoading = false
      },
      error: (error) => {
        this.isMainLoading = false
        this.functionMain.presentToast('An error occurred while trying to get ticket type!', 'danger');
        console.error(error);
      }
    });
  }

  isLoading = false
  loadTicketList(menu: any) {
    let url = ''
    if (this.isActive) {
      if (this.openTicket.length > 0) {
        this.changePage()
        return
      }
      url = '/client/get/open_ticket_by_type_of_issue'
    } else {
      if (this.closedTicket.length > 0) {
        this.changePage()
        return
      }
      url = '/client/get/closed_ticket_by_type_of_issue'
    }
    this.isLoading = true
    this.clientMainService.getApi({ticket_type_id: menu.id}, url).subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.ticketList = results.result.result
          if (this.isActive) {
            this.openTicket = this.ticketList
          } else {
            this.closedTicket = this.ticketList
          }
          this.changePage()
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while trying to get ticket!`, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while trying to get ticket!', 'danger');
        console.error(error);
      }
    });
  }

  changePage() {
    if (this.isActive) {
      this.showTicketList = this.openTicket
    } else {
      this.resetFilter()
    }
  }

  onClickMenu(menu: any) {
    this.loadTicketList(menu)
    this.selectedMenu = menu
    this.newTicket.ticket_type_id = menu.id
    this.isHome = false
    setTimeout(() => {
      this.isData = true
      this.isNotMain = true
      this.textSecond = menu.text
    }, 300)
    if (menu.route == "") {

    } else {
      console.log(menu.route)
    }
  }

  onBack() {
    if (this.isHome) {
      this.router.navigate(['/client-main-app'])
    } else {
      this.resetFilter()
      this.openTicket = []
      this.closedTicket = []
      this.showTicketList = []
      this.isActive = true
      this.isClosed = false
      this.isNew = false
      this.isNew = false
      this.isData = false
      this.isNotMain = false
      setTimeout(() => {
        this.textSecond = ''
        this.isHome = true
      }, 300)
    }
  }

  ticketList: any = []
  showTicketList: any = []
  openTicket: any = []
  closedTicket: any = []

  isActive = true
  isClosed = false
  isNew = false
  isNewTrans = false
  toggleShowActive() {
    this.isClosed = false
    this.isActive = true
    this.isNew = false
    this.isData = true
    this.loadTicketList(this.selectedMenu)
  }

  toggleShowClosed() {
    this.isActive = false
    this.isClosed = true
    this.isNew = false
    this.isData = true
    this.loadTicketList(this.selectedMenu)
  }

  toggleShowNew() {
    if (!this.isNew) {
      this.isActive = false
      this.isClosed = false
      this.isNew = true
      this.isData = false
      this.newTicket.ir_attachment_datas = ''
      this.newTicket.ir_attachment_mimetype = ''
      this.newTicket.ir_attachment_name = ''
      this.newTicket.summary = ''
      this.fileName = ''
    }
  }

  onStartDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.startDateFilter = input.value;
    this.applyDateFilter();
  }

  onEndDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.endDateFilter = input.value;
    this.applyDateFilter();
  }

  startDateFilter = ''
  endDateFilter = ''

  applyDateFilter() {
    this.showTicketList = this.closedTicket.filter((ticket: any) => {
      const ticketDate = new Date(ticket.issued_on.split(' ')[0]);

      const startDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
      const endDate = this.endDateFilter ? new Date(this.endDateFilter) : null;

      const isAfterStartDate = !startDate || ticketDate >= startDate;
      const isBeforeEndDate = !endDate || ticketDate <= endDate;
      return isAfterStartDate && isBeforeEndDate;
    });
  }

  resetFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.showTicketList = this.ticketList;
    this.applyDateFilter()
  }

  typeFilter = 'All'
  onChangeGroup(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log("typefilter", target.value)
    this.typeFilter = target.value;
  }

  viewDetail(ticket: any) {
    this.router.navigate(['/client-ticket-detail'], {
      state: {
        ticket: ticket,
      }
    })
  }

  newTicket: any = {
    ticket_type_id: '',
    summary: '',
    user_id: '',
    family_id: 0,
  }

  @ViewChild('clientTicketNewAttachment') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }
  fileName = ''

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file)
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.selectedFile = file;
        this.newTicket.ir_attachment_name = file.name;
        this.fileName = file.name
        console.log(file.name)
  
        // Konversi file ke base64
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Hapus prefix data URL jika ada
          const base64 = e.target.result.split(',')[1] || e.target.result;
          this.newTicket.ir_attachment_datas = base64;
        };
        reader.readAsDataURL(file);
        
      } else {
        this.fileName = ''
        this.functionMain.presentToast("Can only receive png, jpg, and jpg files!", 'danger')
      }
      
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

  submitTicket() {
    console.log(this.newTicket)
  }

  createNewTicket() {
    console.log(this.newTicket)
    if (!this.newTicket.summary) {
      this.functionMain.presentToast('Report summary is required!', 'danger')
      return
    }
    this.clientMainService.getApi(this.newTicket, '/client/post/create_ticket').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast(`Successfully create new ticket!`, 'success');
          this.openTicket = []
          this.toggleShowActive()
        } else {
          this.functionMain.presentToast(`An error occurred while creating new ticket!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while creating new ticket!', 'danger');
        console.error(error);
      }
    });
  }

  onUploadImage(file: any): void {
    if (file){
      this.newTicket.ir_attachments = file.map((data: any) => {return {ir_attachment_name: data.name, ir_attachment_datas: data.image, ir_attachment_mimetype: data.type }});
      console.log(this.newTicket)
    }
  }

}
