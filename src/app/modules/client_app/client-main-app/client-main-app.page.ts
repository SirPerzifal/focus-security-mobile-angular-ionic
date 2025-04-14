import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { Preferences } from '@capacitor/preferences';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Subscription } from 'rxjs';

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
    private notificationService: NotificationService, 
    private router: Router, 
    private getUserInfoService: GetUserInfoService, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    public functionMain: FunctionMainService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params['reload']){
          this.loadProject()
        }
      }
    })
    this.loadProject()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  project_config: any = []

  async loadProject() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_config = value.config
      this.initMenu()
      this.userData = {
        name: value.name,
        name_condo: value.project_name,
        type: value.type_family,
        block: value.block_name,
        unit: value.unit_name,
        email: value.email,
        contact: value.contact_number,
        image_profile: value.image_profile,
      }
    })
  }

  // loadUserInfo() {
    
  //   this.getUserInfoService.getPreferenceStorage(['user', 'project_name', 'type_family', 'block_name', 'unit_name']).then((value) => {
  //     const parse_user = this.authService.parseJWTParams(value.user);

  //     this.userData = {
  //       name: parse_user.name,
  //       name_condo: value.project_name,
  //       type: value.type_family,
  //       block: value.block_name,
  //       unit: value.unit_name,
  //       email: parse_user.email,
  //       contact: parse_user.email,
  //     }

  //     console.log(this.userData);
      
  //   })
  // }

  // async loadPreferenceProjectName(){
  //   const projectName = await Preferences.get({key: 'PROJECT_NAME'})
  //   if(projectName?.value){
  //     this.condominiumName = projectName.value
  //   }
  // }



  // loadCountNotification() {
  //   this.notificationService.countNotifications(this.unit_id, this.partner_id)
  //     .subscribe({next: (response: any) => {
  //       if (response.result.response_code === 200) {
  //         // Map data dengan tipe yang jelas
  //         this.paramForBadgeNotification = response.result.notifications; // Simpan jumlah notifikasi baru
  //         // if (this.paramForBadgeNotification) {
  //         //   console.log('it works!', this.paramForBadgeNotification)
  //         // }
  //         console.log(response.result)
  //       } else {
  //         console.error('Error:', response);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error:', error);
  //     }
  //   });
  // }

  directToNotifications() {
    this.paramForBadgeNotification = 0;
    this.router.navigate(['resident-notification']);

  }

  menuItems: any = []

  initMenu() {
    this.menuItems = [
      { src: "assets/icon/resident-icon/Approvals.png", alt: "Icon for Approvals", text: "Approvals", route: "/client-approvals", permission: [true, true] },
      { src: "assets/icon/resident-icon/Raise_Ticket.png", alt: "Icon for Raise Ticket", text: "Ticket", route: "/client-raise-ticket", permission: [true, true] },
      { src: "assets/icon/resident-icon/polling.png", alt: "Icon for Polling", text: "Polling", route: "/client-polling", permission: [true, true] },
      { src: "assets/icon/resident-icon/Notices.png", alt: "Icon for Notices", text: "Notices", route: "/client-notices", permission: [true, true] },
      { src: "assets/icon/home-icon/sound.webp", alt: "Icon for Docs", text: "Docs", route: "/client-docs", permission: [true, true] },
      { src: "assets/icon/exc-client/report.png", alt: "Icon for Report an Issue", text: "Reports", route: "/client-reports", permission: [true, true] },
      { src: "assets/icon/resident-icon/upcoming-event.png", alt: "Icon for Upcoming Events", text: "Upcoming Events", route: "/client-upcoming-events", permission: [true, true] },
      { src: "assets/icon/resident-icon/Register_Visitor.png", alt: "Icon for Register a Visitor", text: "My Visitors", route: "/client-register-visitor", permission: [true, true] },
      { src: "assets/icon/resident-icon/Facilities.png", alt: "Icon for Facilities", text: "Facilities", route: "/client-facility", permission: [true, true] },
      { src: "assets/icon/exc-client/house_rules.png", alt: "Icon for House Rules", text: "House Rules", route: "/client-house-rules", permission: [true, true] },
      { src: "assets/icon/resident-icon/quick-dials.png", alt: "Icon for Quick Dials", text: "Quick Dials", route: "/client-quick-dials", permission: [true, true] },
      { src: "assets/icon/exc-client/blacklist.png", alt: "Icon for Blacklist", text: "Blacklist", route: "/client-blacklist", permission: [true, true] },
      { src: "assets/icon/exc-client/wheel.png", alt: "Icon for Wheel Clamp", text: "Wheel Clamp", route: "/client-wheel-clamp", permission: [true, true] },
      { src: "assets/icon/resident-icon/quick-dials.png", alt: "Icon for Residents", text: "Residents", route: "/client-residents", permission: [true, false] },
      { src: "assets/icon/resident-icon/icon1.png", alt: "Icon for Employees", text: "Employees", route: "/client-employees", permission: [false, true] },
      { src: "assets/icon/exc-client/payment_setting.png", alt: "Icon for Payment Setting", text: "Payment Setting", route: "/client-payment-settings", permission: [true, false] },
      { src: "assets/icon/resident-icon/notification.png", alt: "Icon for Notifications", text: "Notifications", route: "/client-notification", permission: [true, true] },
    ];
    if (this.project_config.is_industrial) {
      this.menuItems = this.menuItems.filter((item: any) => item.permission[1] )
    } else {
      this.menuItems = this.menuItems.filter((item: any) => item.permission[0] )
    }
  }
  
  onClickMenu(route: string) {
    console.log(route)
    if (route == "") {

    } else {
      this.router.navigate([route])
    }
  }

}
