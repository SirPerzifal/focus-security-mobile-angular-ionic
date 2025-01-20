import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';
import { OvernightParkingModalPage } from 'src/app/modules/overnight_parking_list_module/pages/overnight-parking-modal/overnight-parking-modal.page';
import { AlertModalPage } from '../alert-modal/alert-modal.page';

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
    private mainVmsService: MainVmsService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) { }

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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['alert']) {
        console.log(params)
        this.loadRecordsWheelClamp('wheel_clamp')
      }
    })
    this.loadRecordsWheelClamp('wheel_clamp')
    this.loadRecordsWheelClamp('first_warning')
    this.loadRecordsWheelClamp('second_warning')
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  actionTotalIssue() {
    this.issueTotal = this.unregisteredTotal + this.overstayTotal + this.wheelClampedTotal + this.ticketsTotal + this.firstWarningTotal + this.secondWarningTotal
  }

  loadRecordsWheelClamp(offenceType: string = 'wheel_clamp') {
    this.alertsIssues = this.alertsIssues.filter(item => item.type !== offenceType);
    this.offensesService.getOfffenses(offenceType, true).subscribe({
      next: (results) => {
        console.log(results.result)
        if (results.result.response_code === 200) {
          console.log("HELLOOOO")
          this.alertsIssues.push({ type: offenceType, data: results.result.response_result })
          if (offenceType == 'wheel_clamp') {
            this.wheelClampedTotal = results.result.response_result.length
          }
          else if (offenceType == 'first_warning') {
            this.firstWarningTotal = results.result.response_result.length
          }
          else {
            this.secondWarningTotal = results.result.response_result.length
          }
          this.recordAction();

          this.actionTotalIssue()
          console.log(this.alertsIssues)
          if (!this.main) {
            console.log("HEY THIS WORK")
            this.showIssues = this.alertsIssues.filter(item => item.type === this.active_type)
            console.log(this.showIssues)
          }
        } else {
          this.presentToast('There is no data in the system!', 'danger');
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

  recordsMenu: any = []
  recordAction() {
    this.recordsMenu = [
      {
        text: 'OVERSTAY',
        icon: 'assets/icon-vms/records_menu/Visitor_Logs.png',
        isActive: true,
        route: '/records-main',
        needSize: false,
        isWarning: this.overstayTotal,
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
        type: 'unregistered',
        extraTextClass: ''
      },
      {
        text: 'TICKETS',
        icon: 'assets/icon-vms/records_menu/Facility_Bookings.png',
        isActive: true,
        route: '/records-main',
        needSize: false,
        isWarning: this.ticketsTotal,
        type: 'tickets',
        extraTextClass: ""
      },
      {
        text: 'WARNING NOTICE 1',
        icon: 'assets/icon-vms/records_menu/First_Warning.png',
        isActive: true,
        route: '/records-wheel-clamped',
        needSize: false,
        isWarning: this.firstWarningTotal,
        type: 'first_warning',
        extraTextClass: "",
      },
      {
        text: 'WARNING NOTICE 2',
        icon: 'assets/icon-vms/records_menu/Second_Warning.png',
        isActive: true,
        route: '/records-wheel-clamped',
        needSize: false,
        isWarning: this.secondWarningTotal,
        type: 'second_warning',
        extraTextClass: "",
      },
      {
        text: 'WHEEL CLAMPEDED',
        icon: 'assets/icon-vms/records_menu/Wheel_Clamped.png',
        isActive: true,
        route: '/records-wheel-clamped',
        needSize: false,
        isWarning: this.wheelClampedTotal,
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
      console.log(this.showIssues[0])
      if (!this.showIssues[0]) {
        this.showIssues = [{
          type: this.active_type,
          data: []
        }]
      }
      this.selectedMenu = this.recordsMenu.filter((item: any) => item.type === records.type)
    }
    console.log(this.active_type, records.type)
  }

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
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
      is_release: type != 'checkout'
    }
    console.log(params)
    this.mainVmsService.getApi(params, '/vms/post/checkout_or_release_offence').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.presentToast(`Successfully ${type} vehicle!`, 'success');
          this.loadRecordsWheelClamp(this.active_type)
        } else {
          this.presentToast(`Failed to ${type} vehicle!`, 'danger');
        }
        

      },
      error: (error) => {
        this.presentToast('An error occurred while submitting coach data!', 'danger');
        console.error(error);
      }
    });
  }

  async presentModal(issue: string = this.active_type, vehicle: any = []) {
    console.log("TRY OPEN MODAL")
    const modal = await this.modalController.create({
      component: OvernightParkingModalPage,
      cssClass: issue == 'second_warning' ? 'record-modal' : 'record-modal-notice',
      componentProps: {
        issue: issue == 'second_warning' ? 'wheel_clamp' : 'first_warning',
        vehicle: vehicle,
        alert: true
      }

    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if (result.data) {
          console.log("SUCCEED")
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
      cssClass: 'record-modal-notice',
      componentProps: {
        id: id,
        type: type
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if(result.data){
          console.log("SUCCEED")
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

}
