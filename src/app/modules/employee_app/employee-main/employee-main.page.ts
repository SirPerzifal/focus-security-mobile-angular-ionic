import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-employee-main',
  templateUrl: './employee-main.page.html',
  styleUrls: ['./employee-main.page.scss'],
})
export class EmployeeMainPage implements OnInit {

  constructor(
    public functionMain: FunctionMainService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initMenu()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  project_config: any = []

  async loadProject() {
    
  }

  menuItems: any = []

  initMenu() {
    this.menuItems = [
      { src: "assets/icon/resident-icon/icon1.png", alt: "Icon for Schedule", text: "HR Module", route: "/employee-leave-application", permission: [true, true], menu_show: this.project_config.is_allow_client_hr_approval },
      { src: "assets/icon/resident-icon/Approvals.png", alt: "Icon for Schedule", text: "OPS Module", route: "/employee-schedule", permission: [true, true], menu_show: this.project_config.is_allow_client_approval },
      { src: "assets/icon/home-icon/sound.webp", alt: "Icon for Docs", text: "Documents", route: "/client-docs", permission: [true, true], menu_show: this.project_config.is_allow_client_docs },
      { src: "assets/icon/exc-client/house_rules.png", alt: "Icon for House Rules", text: "Employee Handbook", route: "/client-house-rules", permission: [true, true], menu_show: this.project_config.is_allow_client_house_rules },
      { src: "assets/icon/resident-icon/quick-dials.png", alt: "Icon for Quick Dials", text: "Quick Dials", route: "/client-quick-dials", permission: [true, true], menu_show: this.project_config.is_allow_client_quick_dials },
    ];
  }
  
  onClickMenu(route: string) {
    console.log(route)
    if (route == "") {

    } else {
      this.router.navigate([route])
    }
  }


}
