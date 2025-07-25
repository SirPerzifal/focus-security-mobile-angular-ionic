import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { Preferences } from '@capacitor/preferences';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Subscription } from 'rxjs';
import { ModalController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app'
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { ModalEstateHomepageComponent } from 'src/app/shared/resident-components/modal-estate-homepage/modal-estate-homepage.component';

@Component({
  selector: 'app-client-main-app',
  templateUrl: './client-main-app.page.html',
  styleUrls: ['./client-main-app.page.scss'],
})
export class ClientMainAppPage implements OnInit {

  unit_id: number = 1;
  partner_id: number = 1;
  paramForBadgeNotification: number = 0;
  condominiumName: string = '';

  userData = {
    name: '',
    name_condo: '',
    type: '',
    block: '',
    unit: '',
    email: '',
    contact: '',
    image_profile: '',
  };

  constructor(
    private webRtcService: WebRtcService,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
    private storage: StorageService,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
    private modalController: ModalController,
  ) {
      this.initializeBackButtonHandling();
    }

  callActionStatus: string = '';
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if (params) {
        if (params['reload']){
          console.log("FROM CLIENT")
          this.webRtcService.initializeSocket()
          this.webRtcService.callActionStatus.subscribe(status => {
            this.callActionStatus = status;
          });
          this.loadProject().then(()=>{
            this.loadNotificationCount()
          })
        }
      }
    })
    this.webRtcService.initializeSocket()
    this.webRtcService.callActionStatus.subscribe(status => {
      this.callActionStatus = status;
    });
  }

  initializeBackButtonHandling() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  project_config: any = []
  user_id: any = ''
  project_id: any = ''

  async loadProject() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_config = value.config
      this.user_id = value.user_id
      this.project_id = value.project_id
      this.initMenu()
      this.userData = {
        name: value.name,
        name_condo: value.project_name,
        type: value.type_family,
        block: value.block_name,
        unit: value.unit_name,
        email: value.email,
        contact: value.contact_number,
        image_profile: '',
      }
      this.storage.getValueFromStorage('USESATE_DATA').then(value => {
        if ( value ) {
          // this.webRtcService.initializeSocket()
          this.userData.image_profile = value.image_profile
        } else {
          this.isLoading = true;
          this.loadEstate(this.userData.email);
        }
      })
    })
  }

  async loadEstate( email:string ) {
    this.clientMainService.getApi({
      email: email
    }, '/resident/get/estate').subscribe((result: any) => {
      if (result.result.status_code === 200) {
        var listedEstate = []
        for (var key in result.result.response){
          if(result.result.response.hasOwnProperty(key)){
            listedEstate.push({
              user_id: result.result.response[key]?.user_id,
              family_id: result.result.response[key]?.family_id,
              family_name: result.result.response[key]?.family_name || '',
              family_nickname: result.result.response[key]?.family_nickname || '',
              image_profile: result.result.response[key]?.image_profile || '',
              family_email: result.result.response[key]?.family_email || '',
              family_mobile_number: result.result.response[key]?.family_mobile_number || '',
              family_type: result.result.response[key]?.family_type || '',
              unit_id: result.result.response[key]?.unit_id,
              unit_name: result.result.response[key]?.unit_name || '',
              block_id: result.result.response[key]?.block_id,
              block_name: result.result.response[key]?.block_name || '',
              project_id: result.result.response[key]?.project_id,
              project_name: result.result.response[key]?.project_name || '',
              project_image: result.result.response[key]?.project_image || '',
              record_type: result.result.response[key]?.record_type || '',
            })
          }
        }
        this.presentModal(listedEstate);
      } else {
        console.error('Error fetching Estate:', result);
      }
    })
  }

  async presentModal(estate: any) {
    const modal = await this.modalController.create({
      component: ModalEstateHomepageComponent,
      cssClass: 'record-modal',
      componentProps: {
        estate: estate,
        client: true,
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result) {
        this.isLoading = false;
        console.log(result.data);
        if (result.data !== 'gas ini dari resident' && result.data !== 'gas ini dari client') {
          const value = result.data;
          let storageData = {
            'image_profile': value.image_profile
          }
          this.storage.setValueToStorage('USESATE_DATA', storageData)
          this.loadConfig();
        } else if (result.data === 'gas ini dari client') {
          this.router.navigate(['/resident-home-page'], {queryParams: {reload: true}});
        } else {
          this.isLoading = true;
          this.loadEstate(this.userData.email);
        }
        console.log("FROM CLIENT MODAL")
        this.webRtcService.initializeSocket()
      }
    });

    return await modal.present();
  }

  directToNotifications() {
    this.paramForBadgeNotification = 0;
    this.router.navigate(['resident-notification']);

  }

  menuItems: any = []

  initMenu() {
    this.menuItems = [
      { src: "assets/icon/resident-icon/Approvals.png", alt: "Icon for Approvals", text: "Approvals", route: "/client-approvals", permission: [true, true], menu_show: this.project_config.is_allow_client_approval, menu_count: 0, id: 'approval', params: {}},
      { src: "assets/icon/resident-icon/Raise_Ticket.png", alt: "Icon for Raise Ticket", text: "Ticket", route: "/client-raise-ticket", permission: [true, true], menu_show: this.project_config.is_allow_client_ticket, menu_count: 0, id: 'ticket', params: {}},
      { src: "assets/icon/resident-icon/polling.png", alt: "Icon for Polling", text: "Polling", route: "/client-polling", permission: [true, true], menu_show: this.project_config.is_allow_client_polling, menu_count: 0, id: 'polling', params: {}},
      { src: "assets/icon/resident-icon/Notices.png", alt: "Icon for Notices", text: "Notices", route: "/client-notices", permission: [true, true], menu_show: this.project_config.is_allow_client_notices, menu_count: 0, id: 'notices', params: {}},
      { src: "assets/icon/home-icon/sound.webp", alt: "Icon for Docs", text: "Docs", route: "/client-docs", permission: [true, true], menu_show: this.project_config.is_allow_client_docs, menu_count: 0, id: 'docs', params: {}},
      { src: "assets/icon/exc-client/report.png", alt: "Icon for Report an Issue", text: "Records", route: "/client-reports", permission: [true, true], menu_show: this.project_config.is_allow_client_reports, menu_count: 0, id: 'records', params: {}},
      { src: "assets/icon/resident-icon/upcoming-event.png", alt: "Icon for Upcoming Events", text: "Upcoming Events", route: "/client-upcoming-events", permission: [true, true], menu_show: this.project_config.is_allow_client_events, menu_count: 0, id: 'events', params: {}},
      { src: "assets/icon/resident-icon/Register_Visitor.png", alt: "Icon for Register a Visitor", text: "My Visitors", route: "/client-register-visitor", permission: [true, true], menu_show: this.project_config.is_allow_client_visitors, menu_count: 0, id: 'visitor', params: {}},
      { src: "assets/icon/resident-icon/Facilities.png", alt: "Icon for Facilities", text: "Facilities", route: "/client-facility", permission: [true, true], menu_show: this.project_config.is_allow_client_facilities, menu_count: 0, id: 'facilities', params: {}},
      { src: "assets/icon/exc-client/house_rules.png", alt: "Icon for House Rules", text: "House Rules", route: "/client-house-rules", permission: [true, true], menu_show: this.project_config.is_allow_client_house_rules, menu_count: 0, id: 'rules', params: {}},
      { src: "assets/icon/resident-icon/quick-dials.png", alt: "Icon for Quick Dials", text: "Quick Dials", route: "/client-quick-dials", permission: [true, true], menu_show: this.project_config.is_allow_client_quick_dials, menu_count: 0, id: 'dials', params: {}},
      { src: "assets/icon/exc-client/blacklist.png", alt: "Icon for Blacklist", text: "Blacklist", route: "/client-blacklist", permission: [true, true], menu_show: this.project_config.is_allow_client_blacklist, menu_count: 0, id: 'blacklist', params: {}},
      { src: "assets/icon/exc-client/wheel.png", alt: "Icon for Wheel Clamp", text: "Wheel Clamp", route: "/client-wheel-clamp", permission: [true, true], menu_show: this.project_config.is_allow_client_wheel_clamp, menu_count: 0, id: 'clamp', params: {}},
      { src: "assets/icon/resident-icon/quick-dials.png", alt: "Icon for Residents", text: "Residents", route: "/client-residents", permission: [true, false], menu_show: this.project_config.is_allow_client_residents, menu_count: 0, id: 'residents', params: {}},
      { src: "assets/icon/resident-icon/icon1.png", alt: "Icon for Employees", text: "Employees", route: "/client-employees", permission: [false, true], menu_show: this.project_config.is_allow_client_employees, menu_count: 0, id: 'employees', params: {}},
      { src: "assets/icon/exc-client/payment_setting.png", alt: "Icon for Payment Setting", text: "Payment Setting", route: "/client-payment-settings", permission: [true, false], menu_show: this.project_config.is_allow_client_payment_setting, menu_count: 0, id: 'payment', params: {}},
      { src: "assets/icon/resident-icon/department.png", alt: "Icon for Departments", text: "Departments", route: "/client-department", permission: [true, true], menu_show: this.project_config.is_allow_client_department, menu_count: 0, id: 'departments', params: {}},
      { src: "assets/icon/exc-client/burger.png", alt: "Icon for Deliveries", text: "Food Platform", route: "/client-delivery", permission: [true, true], menu_show: this.project_config.is_allow_client_food_platform, menu_count: 0, id: 'delivery', params: {type: 'delivery'}},
      { src: "assets/icon/exc-client/package.png", alt: "Icon for Package Express", text: "Package Platform", route: "/client-delivery", permission: [true, true], menu_show: this.project_config.is_allow_client_package_platform, menu_count: 0, id: 'package', params: {type: 'package'}},
      { src: "assets/icon/resident-icon/notification.png", alt: "Icon for Notifications", text: "Notifications", route: "/client-notification", permission: [true, true], menu_show: this.project_config.is_allow_client_notifications, menu_count: 0, id: 'notifications', params: {}},
      { src: "assets/icon/resident-icon/icon1.png", alt: "Icon for User RFID List", text: "RFID User List", route: "/client-rfid-user-list", permission: [true, true], menu_show: this.project_config.is_allow_rfid_user_list, menu_count: 0, id: 'rfid', params: {}},
    ];
    console.log(this.project_config);
    if (this.project_config.is_industrial) {
      this.menuItems = this.menuItems.filter((item: any) => item.permission[1] && item.menu_show )
    } else {
      this.menuItems = this.menuItems.filter((item: any) => item.permission[0] && item.menu_show )
    }
  }
  
  onClickMenu(route: any = {}) {
    console.log(route.route)
    if (route == "") {

    } else {
      this.router.navigate([route.route], {queryParams: route.params})
    }
  }

  handleRefresh(event: any) {
    this.loadConfig()
    event.target.complete()
  }

  isLoading = false
  async loadConfig() {
    this.isLoading = true
    this.clientMainService.getApi({id: this.user_id, selected_project_id: this.project_id}, '/client/get/current_config').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          Preferences.clear()
          Preferences.set({
            key: 'USER_INFO',
            value: results.result.access_token,
          }).then(()=>{
            this.storage.clearAllValueFromStorage()
            let storageData = {
              'image_profile': results.result.image_profile
            }
            this.storage.setValueToStorage('USESATE_DATA', storageData)
            this.loadProject().then(() => {
              this.loadNotificationCount()
              this.isLoading = false
            })
          });
        } else {
          this.functionMain.presentToast('An error occurred while trying to get current config!', 'danger');
          this.isLoading = false
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to get current config!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  count: any = {}
  loadNotificationCount() {
    this.count = {}
    this.clientMainService.getApi({selected_project_id: this.project_id}, '/client/get/notification_count').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          let counts = results.result.counts
          if (counts) {
            counts.forEach((count: any) => {
              let index = this.menuItems.findIndex((item: any) => item.id == count.title)
              this.menuItems[index].menu_count = count.counts
            })
          }
        } else {
          this.functionMain.presentToast('An error occurred while trying to get notifications!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to get notifications!', 'danger');
        console.error(error);
      }
    });
  }


}
