import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Subscription } from 'rxjs';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-client-approvals',
  templateUrl: './client-approvals.page.html',
  styleUrls: ['./client-approvals.page.scss'],
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
export class ClientApprovalsPage implements OnInit {

  constructor(
    private router: Router, 
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private getUserInfoService: GetUserInfoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id
      this.project_config = value.config
      if (!this.project_config.is_industrial) {
        this.loadProjectTax()
      }
      this.loadMenu()
    })
    console.log("ahoy")
  }

  loadMenu() {
    if (this.project_config.is_industrial) {
      this.menuItems = this.menuItems.filter((item: any) => item.permission[1] )
    } else {
      this.menuItems = this.menuItems.filter((item: any) => item.permission[0] )
    }
  }
  
  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  project_config: any = []

  approval_type = ''
  approval_name = ''
  isHome = true
  isData = false
  textSecond = ''
  project_id = 0

  menuItems: any = [
    { src: 'assets/icon/resident-icon/raise_request/Rectangle 2.webp', alt: 'Access Card Icon', route: 'access_card', text: 'Access Card', permission: [true, false], },
    { src: 'assets/icon/resident-icon/deals/Money Bag.webp', alt: 'Refund Deposits Icon', route: 'refund_deposits', text: 'Refund Deposits', permission: [true, false], },
    { src: 'assets/icon/resident-icon/raise_request/Rectangle 3.webp', alt: 'Apply Overnight Icon', route: 'overnight', text: 'Apply Overnight', permission: [true, false], },
    { src: 'assets/icon/resident-icon/raise_request/Rectangle 5.webp', alt: 'Bicycle Tag Icon', route: 'bicycle', text: 'Bicycle Tag', permission: [true, false], },
    { src: 'assets/icon/resident-icon/raise_request/Rectangle 4.webp', alt: 'Coach Registration Icon', route: 'coach', text: 'Coach Registration', permission: [true, false], },
    { src: 'assets/icon/resident-icon/raise_request/Rectangle 6.webp', alt: 'Move Permit Icon', route: 'move_permit', text: 'Move Permit', permission: [true, false], },
    { src: 'assets/icon/resident-icon/raise_request/Rectangle 7.webp', alt: 'Pet Registration Icon', route: 'pet', text: 'Pet Registration', permission: [true, false], },
    { src: 'assets/icon/resident-icon/raise_request/Rectangle 8.webp', alt: 'Renovation Work Icon', route: 'renovation', text: 'Renovation Work', permission: [true, false], },
    { src: 'assets/icon/resident-icon/raise_request/Rectangle 3.webp', alt: 'Appeal Parking Icon', route: 'parking', text: 'Appeal Parking', permission: [true, false], },
    { src: 'assets/icon/resident-icon/icon4.png', alt: 'Vehicle', route: 'vehicle', text: 'Vehicle Approvals', permission: [true, true], },
    { src: 'assets/icon/resident-icon/icon1.png', alt: 'Residents', route: 'family', text: 'Residents', permission: [true, false], },
    { src: 'assets/icon/resident-icon/icon3.png', alt: 'Faciliy Booking', route: 'facility', text: 'Facility', permission: [true, true], },
    // { src: 'assets/icon/resident-icon/icon2.png', alt: 'Payment', route: '', text: 'Payment', permission: [true, false], },
    { src: 'assets/icon/exc-client/car_time.png', alt: 'Vehicle Extension', route: 'vehicle_extension', text: 'Vehicle Extension', permission: [true, false], },
    { src: 'assets/icon/resident-icon/icon1.png', alt: 'Employees', route: 'employee', text: 'Employees', permission: [false, false], },
    // { src: 'assets/icon/resident-icon/upcoming-event.png', alt: 'Events', route: 'events', text: 'Events', permission: [false, true], },
  ];

  onClickMenu(menu: any) {
    this.isHome = false
    setTimeout(() => {
      this.isData = true
      this.textSecond = menu.text
      this.isClosed = false
      this.isActive = true
    }, 300)
    if (menu.route == "") {
      this.activeApprovals = []
      this.showApprovals = []
      this.approval_type = menu.route
      this.approval_name = menu.text
    } else {
      this.activeApprovals = []
      this.closedApprovals = []
      this.showApprovals = []
      this.pagination = {}
      this.approval_type = menu.route
      this.approval_name = menu.text
      console.log(menu.route)
      this.toggleShowActive()
    }
  }

  isLoading = false

  async loadApproval(){
    this.isLoading = true
    console.log(this.approval_type)
    let params = {}
    if (this.isActive) {
      params = {record_list: this.approval_type, project_id: this.project_id, page: this.currentPage, limit: this.functionMain.limitHistory, is_active: this.isActive}
    } else {
      params = {record_list: this.approval_type, project_id: this.project_id, page: this.currentPage, limit: this.functionMain.limitHistory, is_active: this.isActive, issue_date: this.startDateFilter, end_issue_date: this.endDateFilter}
    }
    this.activeApprovals = []
    this.closedApprovals = []
    this.showApprovals = []
    this.clientMainService.getApi(params, '/client/get/approval_list').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.success) {
          if (this.isActive) {
            this.activePagination = results.result.pagination
            this.pagination = this.activePagination
            this.activeApprovals = results.result.booking
            this.showApprovals = this.activeApprovals
          } else {
            this.closedPagination = results.result.pagination
            this.pagination = this.closedPagination
            this.closedApprovals = results.result.booking
            this.showApprovals = this.closedApprovals
          }
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          if (this.isActive) {
            this.activePagination = {}
            this.pagination = this.activePagination
          } else {
            this.closedPagination = {}
            this.pagination = this.closedPagination
          }
          this.functionMain.presentToast(`Failed!`, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.pagination = {}
        this.isLoading = false
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  onBack() {
    if (this.isDetail) {
      this.toggleApprovalHome()
      this.selectedApproval = []
    } else {
      if (this.isHome) {
        this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
      } else {
        this.isData = false
        setTimeout(() => {
          this.textSecond = ''
          this.isHome = true
          this.startDateFilter = ''
          this.endDateFilter = ''
        }, 300)
      }
    }
  }

  activeApprovals: any = []
  closedApprovals: any = []
  showApprovals: any = []

  isActive = true
  isClosed = false
  isClosedTrans = false
  toggleShowActive() {
    this.isClosed = false
    this.isActive = true
    this.pagination = this.activePagination
    this.showApprovals = this.activeApprovals
    if (this.activeApprovals.length == 0) {
      this.loadApproval()
    }
  }

  toggleShowClosed() {
    this.isActive = false
    this.isClosed = true
    this.pagination = this.closedPagination
    this.showApprovals = this.closedApprovals
    if (this.closedApprovals.length == 0) {
      this.loadApproval()
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
    // this.showApprovals = this.activeApprovals.filter((approval: any) => {
    //   const approvalDate = new Date(this.approval_type =='overnight' ? approval.start_date : approval.application_date )

    //   const approvalType = ['rejected', 'cancel', 'approved'].includes(approval.states)

    //   const startDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
    //   const endDate = this.endDateFilter ? new Date(this.endDateFilter) : null;

    //   if (startDate) {
    //     startDate.setHours(0, 0, 0, 0);
    //   }
    //   if (endDate) {
    //     endDate.setHours(23, 59, 59, 59);
    //   }
    //   // Cek kondisi filtering
    //   const isAfterStartDate = startDate ? approvalDate >= startDate : true
    //   const isBeforeEndDate = endDate ? approvalDate <= endDate : true

    //   return isAfterStartDate && isBeforeEndDate && approvalType;
    // });
    this.currentPage = 1
    this.inputPage = 1
    this.loadApproval()
  }

  resetFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyDateFilter()
  }

  getApprovalStatusLabel(status: string): string {
    switch (status) {
      case 'approved': return 'Approved';
      case 'requested': return 'Requested';
      case 'pending_approval': return 'Pending Approval';
      case 'pending_payment': return 'Pending Payment';
      case 'rejected': return 'Rejected';
      case 'cancel': return 'Cancelled';
      default: return status;
    }
  }

  viewDetail(approval: any) {
    // this.router.navigate(['/client-approvals-details'], {
    //   state: {
    //     approval: approval,
    //     approval_type: this.approval_type
    //   }
    // })
    this.selectedApproval = approval
    console.log(this.selectedApproval)
    this.isApprovalHome = false
    setTimeout(() => {
      this.isDetail = true
    }, 300);
    
  }

  selectedApproval: any =[]

  isApprovalHome = true
  isDetail = false

  approveData(approval: any) {
    if (this.approval_type == 'vehicle') {
      this.openApprovalModal()
    } else {
      this.approveDetail(approval)
    }
  }

  approveDetail(approval: any) {
    if (this.rfid_tag != '' && (this.rfid_tag.length > 5 || this.rfid_tag.length < 5)) {
      this.functionMain.presentToast("RFID tags can only be 5 digits!", 'warning')
      return
    }
    this.clientMainService.getApi({model_name: this.approval_type, record_id: approval.id, rfid: this.rfid_tag}, '/client/post/approve').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.success) {
          this.selectedApproval.states = 'approved'
          this.loadApproval()
          this.onBack()
          this.closeApprovalModal()
          this.functionMain.presentToast(`Successfully approved this data!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while trying to approve this data!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to approve this data!', 'danger');
        console.error(error);
      }
    });
  }

  rejectDetail() {
    if (this.reject_reason == '') {
      this.functionMain.presentToast('Reason for rejection is required!', 'danger')
      return
    }
    this.clientMainService.getApi({model_name: this.approval_type, record_id: this.selectedApproval.id, reject_reason: this.reject_reason}, '/client/post/reject').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.success) {
          this.selectedApproval.states = 'rejected'
          this.isRejectModal = false
          this.reject_reason = ''
          this.loadApproval()
          this.onBack()
          this.functionMain.presentToast(`Successfully rejected this data!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while trying to reject this data!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to reject this data!', 'danger');
        console.error(error);
      }
    });
  }

  toggleApprovalHome(){
    this.isDetail = false
    setTimeout(() => {
      this.isApprovalHome = true
    }, 300);
  }

  reject_id = 0

  isRejectModal = false
  reject_reason = ''

  closeRejectModal() {
    this.isRejectModal = false
    this.reject_reason = ''
  }

  openRejectModal() {
    this.isRejectModal = true
    this.reject_reason = ''
  }

  isApproveVehicleModal = false
  rfid_tag = ''
  closeApprovalModal() {
    this.isApproveVehicleModal = false
    this.rfid_tag = ''
  }

  openApprovalModal() {
    this.isApproveVehicleModal = true
    this.rfid_tag = ''
  }

  limitRfid(event: any) {
    // if (this.rfid_tag.length > 5) {
    //   this.rfid_tag = this.rfid_tag
    //   this.functionMain.presentToast("RFID tags can only be 5 digits!", 'warning')
    // } else if ( this.rfid_tag.length < 5) {

    // } else {
    //   this.rfid_tag = event.target.value
    // }
  }

  getPdf(file: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${file}`);
  }

  getBgClass(): string {
    return this.selectedApproval.states === 'approved' ? 'bg-green-100' :
           this.selectedApproval.states === 'pending_approval' || this.selectedApproval.states === 'pending_payment' ? 'bg-sky-100' :
           this.selectedApproval.states === 'rejected' || this.selectedApproval.states === 'cancel' ? 'bg-[#E3787E]' :
           this.selectedApproval.states === 'requested' ? 'bg-[#F8F1BA]' :
           !this.selectedApproval.states ? 'bg-[#c4c4c4]' : '';
  }
  
  paymentConfig: any = []
  paymentChange: any = []
  loadProjectTax(){
    this.clientMainService.getApi({project_id: this.project_id}, '/client/get/payment_config').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.paymentConfig = results.result.config
          this.paymentChange = this.paymentConfig
          console.log(this.paymentConfig)
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to get payment config!', 'danger');
        console.error(error);
      }
    });
  }

  layerBack() {
    history.pushState(null, '', location.href);
    
    const closeModalOnBack = () => {
      this.closePaymentmodal()
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);
  }

  isPaymentModal = false
  onSetting() {
    this.paymentChange = this.paymentConfig
    this.isPaymentModal = true

    this.layerBack()
    
  }

  closePaymentmodal() {
    this.paymentChange = this.paymentConfig
    this.isPaymentModal = false
  }

  submitConfig() {
    console.log(this.paymentChange)
    this.clientMainService.getApi(this.paymentChange, '/client/post/update_payment_config').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.isPaymentModal = false
          this.paymentConfig = this.paymentChange 
          console.log(this.paymentConfig)
        } else {
          this.paymentChange = this.paymentConfig
          this.functionMain.presentToast('An error occurred while trying to update payment config!', 'danger');
        }
      },
      error: (error) => {
        this.paymentChange = this.paymentConfig
        this.functionMain.presentToast('An error occurred while trying to update payment config!', 'danger');
        console.error(error);
      }
    });
    
  }
  
  returnArray(array: any) {
    return (array.map((arr: any) => arr.name)).join(', ')
  }

  handleRefresh(event: any) {
    if (this.isHome) {
      this.loadMenu()
    } else {
      this.loadApproval().then(() => {
      })
    }
    event.target.complete()
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}
  activePagination: any = {}
  closedPagination: any = {}

  pageForward(page: number) {
    this.currentPage = page
    this.inputPage = page
    this.loadApproval()
  }
}
