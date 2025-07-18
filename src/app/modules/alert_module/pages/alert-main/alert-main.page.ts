import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { OvernightParkingModalPage } from 'src/app/modules/overnight_parking_list_module/pages/overnight-parking-modal/overnight-parking-modal.page';
import { AlertModalPage } from '../alert-modal/alert-modal.page';
import { RecordsWheelClampedNewPage } from 'src/app/modules/records_module/pages/records-wheel-clamped/records-wheel-clamped-new/records-wheel-clamped-new.page';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-alert-main',
  templateUrl: './alert-main.page.html',
  styleUrls: ['./alert-main.page.scss'],
})
export class AlertMainPage implements OnInit {

  constructor(
    private router: Router,
    private offensesService: OffensesService,
    private toastController: ToastController,
    private clientMainService: ClientMainService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    public functionMain: FunctionMainService,
  ) {
    this.checkScreenSize();
   }

  alertsIssues: any = [];

  showIssues: any[] = this.alertsIssues

  onActionClick() {
    this.router.navigate(['/alert-paynow'], {
      state: {
        alert: alert
      }
    })
  }

  main = true
  unregisteredTotal = 0
  overstayTotal = 0
  wheelClampedTotal = 0
  ticketsTotal = 0
  firstWarningTotal = 0
  secondWarningTotal = 0
  issueTotal = 0

  unregisteredRedTotal = 0
  overstayRedTotal = 0
  wheelClampedRedTotal = 0
  ticketsRedTotal = 0
  firstWarningRedTotal = 0
  secondWarningRedTotal = 0
  issueRedTotal = 0

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params ) {
        if (params['alert']){
          this.loadProjectName().then(() => {
            this.loadRecordsWheelClamp('wheel_clamp')
          })
        }
        if (params['ticket']){
          this.loadProjectName().then(() => {
            this.loadTickets()
          })
        }
        if (params['unregistered']){
          this.loadProjectName().then(() => {
            this.loadUnregisteredCar()
          })
        }
      }
    })
    
    // this.loadAll()
    this.onLoadCount()
  }

  result: any = {}
  onLoadCount() {
    let params = {project_id: this.project_id}
    this.loadProjectName().then(()=>{
      this.clientMainService.getApi(params, '/vms/get/offenses_count').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code === 200) {
            this.result = results.result.response_result[0]
            console.log(this.result)
            this.overstayRedTotal = this.result.total_overstay_offences_red
            this.overstayTotal = this.result.total_overstay_offences
            this.unregisteredTotal = this.result.total_unregistered_offences
            this.ticketsTotal = this.result.total_ticket_offences
            this.ticketsRedTotal = this.result.total_ticket_offences_red
            this.firstWarningTotal = this.result.total_first_warning_offences
            this.firstWarningRedTotal = this.result.total_first_warning_offences_red
            this.secondWarningTotal = this.result.total_second_warning_offences
            this.secondWarningRedTotal = this.result.total_second_warning_offences_red
            this.wheelClampedTotal = this.result.total_wheel_clamp_offences
          } else {
            this.overstayRedTotal = 0
            this.overstayTotal = 0
            this.unregisteredTotal = 0
            this.ticketsTotal = 0
            this.ticketsRedTotal = 0
            this.firstWarningTotal = 0
            this.firstWarningRedTotal = 0
            this.secondWarningTotal = 0
            this.secondWarningRedTotal = 0
            this.wheelClampedTotal = 0
          }
          console.log(this.overstayRedTotal,this.overstayTotal,this.unregisteredTotal,this.ticketsTotal,this.ticketsRedTotal,this.firstWarningTotal,this.firstWarningRedTotal,this.secondWarningTotal,this.secondWarningRedTotal,this.wheelClampedTotal)
          this.actionTotalIssue()
          this.recordAction()
        },
        error: (error) => {
          console.error(error);
        }
      });
    })
  }


  loadAll() {
    this.loadProjectName().then(() => {
      this.loadRecordsWheelClamp('wheel_clamp')
      this.loadRecordsWheelClamp('first_warning')
      this.loadRecordsWheelClamp('second_warning')
      this.loadUnregisteredCar()
      this.loadOverstay()
      this.loadTickets()
    }) 
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
      this.project_name = value.project_name.toUpperCase()
    })
  }

  project_id = 0
  project_name = 0
  project_config: any = {}

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  actionTotalIssue() {
    this.issueTotal = this.unregisteredTotal + this.overstayTotal + this.wheelClampedTotal + this.ticketsTotal + this.firstWarningTotal + this.secondWarningTotal
    this.issueRedTotal = this.unregisteredRedTotal + this.overstayRedTotal + this.wheelClampedRedTotal + this.ticketsRedTotal + this.firstWarningRedTotal + this.secondWarningRedTotal
  }

  loadRecordsWheelClamp(offenceType: string = 'wheel_clamp') {
    if (!this.main) {
      this.isLoading = true
    }
    this.alertsIssues = this.alertsIssues.filter((item: any) => item.type !== offenceType);
    let params = {
      is_alert: true, 
      is_active: true, 
      alert_type: offenceType, 
      project_id: this.project_id,
      limit: this.functionMain.limitHistory, 
      page: this.currentPage
    }
    this.clientMainService.getApi(params, '/vms/get/offenses').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          this.alertsIssues.push({ type: offenceType, data: results.result.response_result, total_pages: results.result.pagination.total_pages })
          this.total_pages = results.result.pagination.total_pages
          if (offenceType == 'wheel_clamp') {
            this.wheelClampedTotal = results.result.pagination.total_records
          }
          else if (offenceType == 'first_warning') {
            this.firstWarningTotal = results.result.pagination.total_records
            this.firstWarningRedTotal = results.result.pagination.total_red_records
          }
          else {
            this.secondWarningTotal = results.result.pagination.total_records
            this.secondWarningRedTotal = results.result.pagination.total_red_records
          }
        } else {
          this.alertsIssues.push({ type: offenceType, data: [], total_pages: 0 })
          if (offenceType == 'wheel_clamp') {
            this.wheelClampedTotal = 0
          }
          else if (offenceType == 'first_warning') {
            this.firstWarningTotal = 0
            this.firstWarningRedTotal = 0
          }
          else {
            this.secondWarningTotal = 0
            this.secondWarningRedTotal = 0
          }
          this.isLoading = false
          this.total_pages = 0
        }
        this.recordAction();
        this.actionTotalIssue()
        if (!this.main) {
          this.showIssues = this.alertsIssues.filter((item: any) => item.type === this.active_type)
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
        this.alertsIssues.push({ type: offenceType, data: [], total_pages: 0 })
        if (offenceType == 'wheel_clamp') {
          this.wheelClampedTotal = 0
        }
        else if (offenceType == 'first_warning') {
          this.firstWarningTotal = 0
          this.firstWarningRedTotal = 0
        }
        else {
          this.secondWarningTotal = 0
          this.secondWarningRedTotal = 0
        }
        if (!this.main) {
          this.showIssues = this.alertsIssues.filter((item: any) => item.type === this.active_type)
        }
        this.isLoading = false
        this.total_pages = 0
        this.recordAction();
        this.actionTotalIssue()
      }
    });
  }

  loadUnregisteredCar(){
    if (!this.main) {
      this.isLoading = true
    }
    this.alertsIssues = this.alertsIssues.filter((item: any) => item.type !== 'unregistered');
    this.clientMainService.getApi({project_id: this.project_id, limit: this.functionMain.limitHistory, page: this.currentPage}, '/vms/get/unregistered_car_list').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          this.alertsIssues.push({ type: 'unregistered', data: results.result.response_result, total_pages: results.result.pagination.total_pages})
          this.unregisteredTotal = results.result.pagination.total_records
          this.total_pages = results.result.pagination.total_pages
        } else {
          this.alertsIssues.push({ type: 'unregistered', data: [], total_pages: 0 })
          this.unregisteredTotal = 0
          this.unregisteredRedTotal = 0
          this.total_pages = 0
        }
        console.log(this.showIssues)
        this.recordAction();
        this.actionTotalIssue()
        if (!this.main) {
          this.showIssues = this.alertsIssues.filter((item: any) => item.type === this.active_type)
        }
        this.isLoading = false
      },
      error: (error) => {
        this.alertsIssues.push({ type: 'unregistered', data: [], total_pages: 0  })
        this.presentToast('An error occurred while loading unregistered car data!', 'danger');
        console.error(error);
        this.unregisteredTotal = 0
        this.unregisteredRedTotal = 0
        this.total_pages = 0
        this.isLoading = false
        this.recordAction();
        this.actionTotalIssue()
        if (!this.main) {
          this.showIssues = this.alertsIssues.filter((item: any) => item.type === this.active_type)
        }
      }
    });
  }

  loadOverstay(){
    if (!this.main) {
      this.isLoading = true
    }
    this.alertsIssues = this.alertsIssues.filter((item: any) => item.type !== 'overstay');
    this.clientMainService.getApi({project_id: this.project_id,  limit: this.functionMain.limitHistory, page: this.currentPage}, '/vms/get/overstay_list').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.alertsIssues.push({ type: 'overstay', data: results.result.response_result, total_pages: results.result.pagination.total_pages })
          this.overstayRedTotal = results.result.pagination.total_red_records
          this.overstayTotal = results.result.pagination.total_records
          this.total_pages = results.result.pagination.total_pages
          console.log(this.overstayRedTotal)
        } else {
          this.alertsIssues.push({ type: 'overstay', data: [], total_pages: 0 })
          this.overstayTotal = 0
          this.overstayRedTotal = 0
          this.total_pages = 0
        }
        this.recordAction();
        this.actionTotalIssue()
        if (!this.main) {
          this.showIssues = this.alertsIssues.filter((item: any) => item.type === this.active_type)
        }
        this.isLoading = false
      },
      error: (error) => {
        this.presentToast('An error occurred while loading overstay car data!', 'danger');
        console.error(error);
        this.alertsIssues.push({ type: 'overstay', data: [], total_pages: 0 })
        this.overstayTotal = 0
        this.overstayRedTotal = 0
        this.isLoading = false
        if (!this.main) {
          this.showIssues = this.alertsIssues.filter((item: any) => item.type === this.active_type)
        }
        this.total_pages = 0
        this.recordAction();
        this.actionTotalIssue()
        this.isLoading = false
      }
    });
  }

  loadTickets(){
    if (!this.main) {
      this.isLoading = true
    }
    this.alertsIssues = this.alertsIssues.filter((item: any) => item.type !== 'tickets');
    this.clientMainService.getApi({project_id: this.project_id, limit: this.functionMain.limitHistory, page: this.currentPage}, '/vms/get/report_issue').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.alertsIssues.push({ type: 'tickets', data: results.result.response_result, total_pages: results.result.pagination.total_pages })
          this.ticketsRedTotal = results.result.pagination.total_red_records
          this.ticketsTotal = results.result.pagination.total_records
          this.total_pages = results.result.pagination.total_pages
          this.isLoading = false
        } else {
          this.alertsIssues.push({ type: 'tickets', data: [], total_pages: 0 })
          this.ticketsTotal = 0
          this.ticketsRedTotal = 0
          this.total_pages = 0
          this.isLoading = false
        }
        this.recordAction();
        this.actionTotalIssue()
        if (!this.main) {
          this.showIssues = this.alertsIssues.filter((item: any) => item.type === this.active_type)
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading tickets!', 'danger');
        console.error(error);
        this.alertsIssues.push({ type: 'tickets', data: [], total_pages: 0 })
        this.ticketsTotal = 0
        this.ticketsRedTotal = 0
        this.total_pages = 0
        this.isLoading = false
        if (!this.main) {
          this.showIssues = this.alertsIssues.filter((item: any) => item.type === this.active_type)
        }
        this.recordAction();
        this.actionTotalIssue()
      }
    });
  }

  recordsMenu: any = []
  recordAction() {
    this.recordsMenu = [
      {
        text: 'OVERSTAY',
        icon: 'assets/icon-vms/records_menu/Visitor_Logs.png',
        isActive: true,
        route: '/records-main',
        needSize: false,
        isWarning: this.overstayRedTotal,
        totalWarning: this.overstayTotal,
        type: 'overstay',
        extraTextClass: ""
      },
      {
        text: 'UNREGISTERED',
        icon: 'assets/icon-vms/records_menu/Vehicle_Logs.png',
        isActive: true,
        route: '/records-main',
        needSize: true,
        isWarning: this.unregisteredTotal,
        totalWarning: this.unregisteredTotal,
        type: 'unregistered',
        extraTextClass: ''
      },
      {
        text: 'TICKETS',
        icon: 'assets/icon-vms/records_menu/Facility_Bookings.png',
        isActive: true,
        route: '/records-main',
        needSize: false,
        isWarning: this.ticketsRedTotal,
        totalWarning: this.ticketsTotal,
        type: 'tickets',
        extraTextClass: ""
      },
      {
        text: 'WARNING NOTICE 1',
        icon: 'assets/icon-vms/records_menu/First_Warning.png',
        isActive: true,
        route: '/records-wheel-clamped',
        needSize: false,
        isWarning: this.firstWarningRedTotal,
        totalWarning: this.firstWarningTotal,
        type: 'first_warning',
        extraTextClass: "",
      },
      {
        text: 'WARNING NOTICE 2',
        icon: 'assets/icon-vms/records_menu/Second_Warning.png',
        isActive: true,
        route: '/records-wheel-clamped',
        needSize: false,
        isWarning: this.secondWarningRedTotal,
        totalWarning: this.secondWarningTotal,
        type: 'second_warning',
        extraTextClass: "",
      },
      {
        text: 'WHEEL CLAMPED',
        icon: 'assets/icon-vms/records_menu/Wheel_Clamped.png',
        isActive: true,
        route: '/records-wheel-clamped',
        needSize: false,
        isWarning: this.wheelClampedTotal,
        totalWarning: this.wheelClampedTotal,
        type: 'wheel_clamp',
        extraTextClass: "",
      },
    ]
    if (!this.main) {
      this.selectedMenu = this.recordsMenu.filter((item: any) => item.type === this.active_type)
    }
  }

  record_text = ''
  active_type = ''
  selectedMenu: any[] = []
  Datas: any = []

  toggleRecordsButton(records: any) {
    if (records.type == this.active_type) {
      this.main = true
      this.record_text = ''
      records.isActive = true
      this.active_type = ''
      this.currentPage = 1
      this.inputPage = 1
      this.total_pages = 0
    } else {
      this.main = false
      this.record_text = records.text
      this.active_type = records.type
      records.isActive = true
      // this.total_pages = this.alertsIssues.filter((item: any) => item.type === records.type)[0].total_pages
      console.log(this.alertsIssues.filter((item: any) => item.type === records.type)[0])
      // this.showIssues = this.alertsIssues.filter((item: any) => item.type === records.type)
      // if (!this.showIssues[0]) {
      //   this.showIssues = [{
      //     type: this.active_type,
      //     data: []
      //   }]
      // }
      this.selectedMenu = this.recordsMenu.filter((item: any) => item.type === records.type)
      if (this.active_type == 'unregistered') {
        this.loadUnregisteredCar()
      } else if (this.active_type == 'overstay') {
        this.loadOverstay()
      } else if (this.active_type == 'tickets') {
        this.loadTickets()
      } else {
        this.loadRecordsWheelClamp(this.active_type)
      }
    }
  }

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); 
    return `${day}/${month}/${year}`; 
  }

  onBackDetail() {
    this.currentPage = 1
    this.inputPage = 1
    this.main = !this.main
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  onCheckOut(id: number, type: string) {
    let params = {
      offence_id: id,
      is_checkout: type == 'checkout',
      is_release: type != 'checkout',
      is_unregistered: this.active_type == 'unregistered' || this.active_type == 'overstay',
    }
    if (true) {
      this.clientMainService.getApi(params, '/vms/post/checkout_or_release_offence').subscribe({
        next: (results) => {
          if (results.result.response_code === 200) {
            this.presentToast(`Successfully ${type} this vehicle!`, 'success');
            if (this.active_type == 'unregistered' || this.active_type == 'overstay') {
              this.loadUnregisteredCar()
              this.loadOverstay()
            } else {
              this.loadRecordsWheelClamp(this.active_type)
            }
          } else {
            this.presentToast(`Failed to ${type} this vehicle!`, 'danger');
          }
          
  
        },
        error: (error) => {
          this.presentToast('An error occurred while processing function!', 'danger');
          console.error(error);
        }
      });
    }
    
  }

  async presentModal(issue: string = this.active_type, vehicle: any = []) {
    const modal = await this.modalController.create({
      component: OvernightParkingModalPage,
      cssClass: 'record-modal',
      componentProps: {
        issue: issue == 'none' ? issue : (issue == 'second_warning' ? 'wheel_clamp' : 'first_warning'),
        vehicle: vehicle,
        alert: true,
      }

    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    modal.onDidDismiss().then((result) => {
      if (result) {
        if (result.data) {
          if (this.active_type == 'first_warning') {
            this.loadRecordsWheelClamp('first_warning')
            this.loadRecordsWheelClamp('second_warning')
          }
          else {
            this.loadRecordsWheelClamp('second_warning')
            this.loadRecordsWheelClamp('wheel_clamp')
          }
        }
      }
    });

    return await modal.present();
  }

  onPaymentClick(alert: any = []) {
    this.router.navigate(['records-wheel-clamped-payment'], {
      state: {
        vehicle: alert,
        alert: true
      },
    });
  }

  async presentModalRelease(id: number, type: string, vehicle: any) {
    const modal = await this.modalController.create({
      component: AlertModalPage,
      cssClass: 'nric-scan-modal',
      componentProps: {
        id: id,
        type: type
      }
  
    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    modal.onDidDismiss().then((result) => {
      if (result) {
        if(result.data){
          this.loadRecordsWheelClamp(this.active_type)
        }
      }
    });

    return await modal.present();
  }

  public async showAlertButtons(id: number, type: string, vehicle_number: string) {
    const alertButtons = await this.alertController.create({
      cssClass: 'checkout-alert',
      header: `Are you sure you want to ${type} this vehicle?`,
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.onCheckOut(id, type)
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  backHome() {
    this.router.navigate(['/home-vms'])
  }

  async presentModalFirstWarning(vehicle_number: any, entry_type: any, issue_time: any, issue_type: any) {
    let comp = {
      type: issue_type,
      vehicle_number: vehicle_number,
      issue_time: issue_time,
    }
    const modal = await this.modalController.create({
      component: RecordsWheelClampedNewPage,
      cssClass: 'record-modal',
      componentProps: comp
    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    modal.onDidDismiss().then((result) => {
      if (result) {
        if(result.data){
          this.loadRecordsWheelClamp(result.data)
          if (this.active_type == 'unregistered') {
            this.loadUnregisteredCar()
          } else if (this.active_type == 'overstay') {
            this.loadOverstay()
          }
        }
      }
    });

    return await modal.present();
  }

  ticketDetail(ticket_id: any) {
    this.router.navigate(['/alert-ticket-detail'], {
      state: {
        ticket_id: ticket_id
      }
    })
  }

  refreshClicked() {
    this.onLoadCount()
  }

  isSmallScreen = false;

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 720;
  }

  handleRefresh(event: any) {
    if (this.main) {
      this.onLoadCount()
    } else {
      if (this.active_type == 'unregistered') {
        this.loadUnregisteredCar()
      } else if (this.active_type == 'overstay') {
        this.loadOverstay()
      } else if (this.active_type == 'tickets') {
        this.loadTickets()
      } else {
        this.loadRecordsWheelClamp(this.active_type)
      }
    }
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

  total_pages = 0
  inputPage = 1
  currentPage = 1

  changePage(page: number) {
    let tempPage = page
    console.log(tempPage)
    console.log(tempPage, this.total_pages)
    if (tempPage > 0 && tempPage <= this.total_pages) {
      this.currentPage = tempPage
      if (this.active_type == 'unregistered') {
        this.loadUnregisteredCar()
      } else if (this.active_type == 'overstay') {
        this.loadOverstay()
      } else if (this.active_type == 'tickets') {
        this.loadTickets()
      } else {
        this.loadRecordsWheelClamp(this.active_type)
      }
    } else {
    }
    this.inputPage = this.currentPage
  }

  isLoading = false

  addUnregistered() {
    this.router.navigate(['/unregistered-simulation-module'])
  }

}
