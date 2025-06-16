import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

@Component({
  selector: 'app-client-register-visitor',
  templateUrl: './client-register-visitor.page.html',
  styleUrls: ['./client-register-visitor.page.scss'],
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
export class ClientRegisterVisitorPage implements OnInit {

  constructor(
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private router: Router,
    private alertController: AlertController,
    private getUserInfoService: GetUserInfoService
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id;
      this.loadClient()
    })
  }

  project_id = 0

  formData = {
    name: '',
    company_name: '',
    contact_number: '',
    selection_type: '',
    vehicle_number: '',
  }

  onSubmit() {
    let errMsg = ''
    if (this.formData.name == ''){
      errMsg += 'Name is required!'
    }
    if (this.formData.company_name == ''){
      errMsg += 'Company name is required!'
    }
    if (this.formData.contact_number == ''){
      errMsg += 'Contact number is required!'
    }
    if (this.formData.contact_number) {
      if (this.formData.contact_number.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (this.formData.vehicle_number == '' && this.formData.selection_type == 'drive_in'){
      errMsg += 'Vehicle number is required!'
    }
    console.log(this.formData)
    if (errMsg != '') {
      this.functionMain.presentToast(errMsg, 'danger')
    } else {
      this.clientMainService.getApi(this.formData, '/client/post/add_ma_visitor').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.status_code === 200) {
            this.toggleShowActive()
            this.functionMain.presentToast(`Success!`, 'success');
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
  }

  today = new Date().setHours(0,0,0,0)
  
  isLoading = false
  async loadClient() {
    this.isLoading = true
    let params = {}
    if (this.isActive) {
      params = {page: this.currentPage, limit: this.functionMain.limitHistory, is_active: this.isActive}
    } else {
      params = {page: this.currentPage, limit: this.functionMain.limitHistory, is_active: this.isActive, issue_date: this.startDateFilter, end_issue_date: this.endDateFilter}
    }
    this.activeVisitor = []
    this.historyVisitor = []
    this.showVisitorList = []
    this.clientMainService.getApi(params, '/client/get/previsitor').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        if (results.result.status_code === 200) {
          if (this.isActive) {
            this.activeVisitor = results.result.data
            this.showVisitorList = this.activeVisitor
          } else {
            this.historyVisitor = results.result.data
            this.showVisitorList = this.historyVisitor
          }
          this.pagination = results.result.pagination
          
        } else {
          this.pagination = {}
          this.functionMain.presentToast(`An error occurred while trying to get the data!`, 'danger');
        }
      },
      error: (error) => {
        this.pagination = {}
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while trying to get the data!', 'danger');
        console.error(error);
      }
    });
  }

  cancelVisitor(visitor_id: number) {
    this.clientMainService.getApi({visitor_id: visitor_id}, '/client/post/cancel_invite_preregister').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.loadClient()
          this.functionMain.presentToast(`Successfully cancel invites!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while cancelling this visitor!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  textSecond = 'Active Visitor'

  isActive = true
  isHistory = false
  isNew = false
  isNewTrans = false
  isMain = true
  isDetail = false

  toggleShowActive() {
    this.isHistory = false
    this.isActive = true
    this.isNew = false
    this.textSecond = 'Active Visitor'
    this.loadClient()
  }

  toggleShowHistory() {
    this.isActive = false
    this.isHistory = true
    this.isNew = false
    this.textSecond = 'Visitor History'
    this.loadClient()
  }

  toggleShowNew() {
    this.isActive = false
    this.isHistory = false
    this.isNew = true
    this.textSecond = 'New Visitor'
    this.resetForm()
  }

  resetForm() {
    this.formData = {
      name: '',
      company_name: '',
      contact_number: '',
      selection_type: '',
      vehicle_number: '', 
    }
  }

  onBack() {
    if (this.isMain) {
      this.router.navigate(['/client-main-app'])
    } else {
      this.isDetail = false
      setTimeout(() => {
        this.textSecond = this.isActive ? 'Active Visitor'  : (this.isHistory ? 'Visitor History' : 'New Visitor')
        this.isMain = true
      }, 300)
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

  showVisitorList: any = []
  activeVisitor: any = []
  historyVisitor: any = []

  applyDateFilter() {
    // this.showVisitorList = this.visitorList.filter((visitor: any) => {
    //   const visitorDate = new Date(visitor.entry_date).setHours(0,0,0,0);

    //   const startDate = this.startDateFilter ? new Date(this.startDateFilter).setHours(0,0,0,0) : null;
    //   const endDate = this.endDateFilter ? new Date(this.endDateFilter).setHours(0,0,0,0) : null;
      
    //   const isAfterStartDate = !startDate || visitorDate >= startDate;
    //   const isBeforeEndDate = !endDate || visitorDate <= endDate;

    //   const fixedEndDate = visitorDate < new Date().setHours(0,0,0,0)

    //   return isAfterStartDate && isBeforeEndDate && fixedEndDate;
    // });
    this.currentPage = 1
    this.inputPage = 1
    this.loadClient()
  }

  resetFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyDateFilter()
  }
  
  viewDetail(visitor: any) {
    console.log(visitor)
    this.visitorDetail = visitor
    this.isMain = false
    setTimeout(() => {
      this.isDetail = true
      this.textSecond = 'Visitor Detail'
    }, 300)
  }

  visitorDetail: any = []

  public async onCancel(visitor: any) {
    const alertButtons = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: `Are you sure you want to cancel ${visitor.visitor_name}?`,
      message: '', 
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => {
            this.cancelVisitor(visitor.id)
          }
        },
        {
          text: 'Cancel',
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Canceled');
            // Logika pembatalan
          }
        },
      ]
    });
    await alertButtons.present();
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  handleRefresh(event: any) {
    this.loadClient().then(() => event.target.complete())
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  pageForward(page: number) {
    this.currentPage = page
    this.inputPage = page
    this.loadClient()
  }
}
