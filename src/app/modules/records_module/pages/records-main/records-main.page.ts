import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RecordsResidentsModalPage } from '../records-residents/records-residents-modal/records-residents-modal.page';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-records-main',
  templateUrl: './records-main.page.html',
  styleUrls: ['./records-main.page.scss'],
})
export class RecordsMainPage implements OnInit {

  constructor(private router: Router, private modalController: ModalController, public functionMain: FunctionMainService) {
    this.checkScreenSize();
   }

  ngOnInit() {
    this.loadProjectName().then(() => {
      this.loadRecords()
    })
  }

  project_config: any = []

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_name = value.project_name.toUpperCase()
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }
  project_name = ''
  project_id = 0

  recordsMenu: any = []
  loadRecords() {
    this.recordsMenu = [
      {
        text: 'VISITOR LOGS',
        icon: 'assets/icon-vms/records_menu/Visitor_Logs.png',
        route: '/records-visitor',
        needSize: false,
        sizeClass: '',
        project_config: this.project_config.is_allow_vms_record_logs,
        params: {
          type: 'visitor'
        }
      },
      {
        text: 'VEHICLE LOGS',
        icon: 'assets/icon-vms/records_menu/Vehicle_Logs.png',
        route: '/records-visitor',
        needSize: true,
        sizeClass: 'w-[130px] h-[90px] object-contain',
        project_config: this.project_config.is_allow_vms_record_logs,
        params: {
          type: 'vehicle'
        }
      },
      {
        text: 'FACILITY BOOKINGS',
        icon: 'assets/icon-vms/records_menu/Facility_Bookings.png',
        route: '/records-facility',
        needSize: true,
        sizeClass: 'w-[130px] h-[90px] object-contain',
        project_config: this.project_config.is_allow_vms_record_facility,
      },
      {
        text: '1ST WARNING',
        icon: 'assets/icon-vms/records_menu/First_Warning.png',
        route: '/records-wheel-clamped',
        needSize: false,
        sizeClass: '',
        project_config: this.project_config.is_allow_vms_record_offence,
        params: {
          type: 'first_warning'
        }
      },
      {
        text: '2ND WARNING',
        icon: 'assets/icon-vms/records_menu/Second_Warning.png',
        route: '/records-wheel-clamped',
        needSize: false,
        sizeClass: '',
        project_config: this.project_config.is_allow_vms_record_offence,
        params: {
          type: 'second_warning'
        }
      },
      {
        text: 'WHEEL CLAMPED',
        icon: 'assets/icon-vms/records_menu/Wheel_Clamped.png',
        route: '/records-wheel-clamped',
        needSize: false,
        sizeClass: '',
        project_config: this.project_config.is_allow_vms_record_offence,
        params: {
          type: 'wheel_clamp'
        }
      },
      {
        text: 'CONTRACTOR LOGS',
        icon: 'assets/icon-vms/Homepage/Contractors.png',
        route: '/records-contractor',
        needSize: false,
        sizeClass: '',
        project_config: this.project_config.is_allow_vms_contractor,
      },
      {
        text: 'BLACKLIST',
        icon: 'assets/icon-vms/records_menu/Blacklist.png',
        route: '/records-blacklist',
        needSize: false,
        sizeClass: '',
        project_config: this.project_config.is_allow_vms_record_blacklist,
      },
      {
        text: this.project_config.is_industrial ? 'EMPLOYEES' :  'RESIDENTS',
        icon: 'assets/icon-vms/records_menu/Residents.png',
        route: '/records-residents',
        needSize: true,
        sizeClass: 'mt-[5px] w-[130px] h-[90px] object-contain',
        project_config: this.project_config.is_allow_vms_record_resident,
        params: {
          newOpen: true
        }
      },
    ]
  }

  toggleRecordsButton(records: any, params: any = false) {
    if (records.text == 'RESIDENTS' || records.text == 'EMPLOYEES'){
      this.presentModal()
    } else {
      if (!params) {
        this.router.navigate([records.route])
      } else {
        this.router.navigate([records.route], {queryParams: params})
      }
    }
  }
  
  async presentModal() {
    const modal = await this.modalController.create({
      component: RecordsResidentsModalPage,
      cssClass: 'record-resident-modal',
      componentProps: {}
  
    });

    history.pushState(null, '', location.href);

    const closeModalOnBack = () => {
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

    modal.onDidDismiss().then((result) => {
      if (result) {
        console.log(result.data)
        if(result.data){
          console.log("SUCCEED")
        }
      }
    });

    return await modal.present();
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
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }
}
