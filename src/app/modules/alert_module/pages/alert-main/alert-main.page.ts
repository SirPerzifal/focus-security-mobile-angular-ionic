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

  alertsIssues: any[] = [];

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
      }
    })
    
    this.loadAll()
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
      this.project_name = value.project_name.toUpperCase()
    })
  }

  project_id = 0
  project_name = 0

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
    this.alertsIssues = this.alertsIssues.filter(item => item.type !== offenceType);
    this.offensesService.getOfffenses(offenceType, true).subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          this.alertsIssues.push({ type: offenceType, data: results.result.response_result })
          if (offenceType == 'wheel_clamp') {
            this.wheelClampedTotal = results.result.response_result.length
          }
          else if (offenceType == 'first_warning') {
            this.firstWarningTotal = results.result.response_result.length
            this.firstWarningRedTotal = results.result.response_result.filter((item: any) => item.is_overminute).length
          }
          else {
            this.secondWarningTotal = results.result.response_result.length
            this.secondWarningRedTotal = results.result.response_result.filter((item: any) => item.is_overminute).length
          }
          this.recordAction();

          this.actionTotalIssue()
          if (!this.main) {
            this.showIssues = this.alertsIssues.filter(item => item.type === this.active_type)
          }
        } else {
          // this.presentToast('There is no data in the system!', 'danger');
        }

        // this.isLoading = false;
      },
      error: (error) => {
        this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
        console.error(error);
        // this.isLoading = false;
      }
    });
  }

  loadUnregisteredCar(){
    this.alertsIssues = this.alertsIssues.filter(item => item.type !== 'unregistered');
    this.clientMainService.getApi({project_id: this.project_id}, '/vms/get/unregistered_car_list').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          this.alertsIssues.push({ type: 'unregistered', data: results.result.response_result })
          this.unregisteredTotal = results.result.response_result.length

          this.recordAction();
          this.actionTotalIssue()
          if (!this.main) {
            this.showIssues = this.alertsIssues.filter(item => item.type === this.active_type)
          }
        } 
      },
      error: (error) => {
        this.presentToast('An error occurred while loading unregistered car data!', 'danger');
        console.error(error);
      }
    });
  }

  loadOverstay(){
    this.alertsIssues = this.alertsIssues.filter(item => item.type !== 'overstay');
    this.clientMainService.getApi({project_id: this.project_id}, '/vms/get/overstay_list').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          this.alertsIssues.push({ type: 'overstay', data: results.result.response_result })
          this.overstayTotal = results.result.response_result.length
          this.overstayRedTotal = results.result.response_result.filter((item: any) => item.is_overminute).length
          console.log(this.overstayRedTotal)
          this.recordAction();
          this.actionTotalIssue()
          if (!this.main) {
            this.showIssues = this.alertsIssues.filter(item => item.type === this.active_type)
          }
        } 
      },
      error: (error) => {
        this.presentToast('An error occurred while loading overstay car data!', 'danger');
        console.error(error);
      }
    });
  }

  loadTickets(){
    this.alertsIssues = this.alertsIssues.filter(item => item.type !== 'tickets');
    this.clientMainService.getApi({project_id: this.project_id}, '/vms/get/report_issue').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.alertsIssues.push({ type: 'tickets', data: results.result.response_result })
          this.ticketsTotal = results.result.response_result.length
          this.ticketsRedTotal = results.result.response_result.filter((item: any) =>  item.message_count === 0).length
          this.recordAction();
          this.actionTotalIssue()
          if (!this.main) {
            this.showIssues = this.alertsIssues.filter(item => item.type === this.active_type)
          }
        } 
      },
      error: (error) => {
        this.presentToast('An error occurred while loading tickets!', 'danger');
        console.error(error);
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

  toggleRecordsButton(records: any) {
    if (records.type == this.active_type) {
      this.main = true
      this.record_text = ''
      records.isActive = true
      this.active_type = ''
    } else {
      this.main = false
      this.record_text = records.text
      this.active_type = records.type
      records.isActive = true
      this.showIssues = this.alertsIssues.filter(item => item.type === records.type)
      if (!this.showIssues[0]) {
        this.showIssues = [{
          type: this.active_type,
          data: []
        }]
      }
      this.selectedMenu = this.recordsMenu.filter((item: any) => item.type === records.type)
    }
  }

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); 
    return `${day}/${month}/${year}`; 
  }

  onBackDetail() {
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
        alert: true
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

  async presentModalFirstWarning(vehicle_number: any, entry_type: any) {
    const modal = await this.modalController.create({
      component: RecordsWheelClampedNewPage,
      cssClass: 'record-modal',
      componentProps: {
        type: 'first_warning',
        vehicle_number: vehicle_number,
        type_of_entry: entry_type,
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
          this.loadRecordsWheelClamp('first_warning')
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
    this.loadAll()
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
      this.loadAll()
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
    } else {
    }
    this.inputPage = this.currentPage
  }

}
