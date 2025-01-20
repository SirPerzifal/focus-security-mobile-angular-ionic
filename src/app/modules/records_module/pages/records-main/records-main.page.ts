import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RecordsResidentsModalPage } from '../records-residents/records-residents-modal/records-residents-modal.page';

@Component({
  selector: 'app-records-main',
  templateUrl: './records-main.page.html',
  styleUrls: ['./records-main.page.scss'],
})
export class RecordsMainPage implements OnInit {

  constructor(private router: Router, private modalController: ModalController) { }

  ngOnInit() {
  }

  recordsMenu = [
    {
      text: 'VISITOR LOGS',
      icon: 'assets/icon-vms/records_menu/Visitor_Logs.png',
      route: '/records-visitor',
      needSize: false,
      sizeClass: '',
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
    },
    {
      text: '1ST WARNING',
      icon: 'assets/icon-vms/records_menu/First_Warning.png',
      route: '/records-wheel-clamped',
      needSize: false,
      sizeClass: '',
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
      params: {
        type: 'wheel_clamp'
      }
    },
    {
      text: 'BLACKLIST',
      icon: 'assets/icon-vms/records_menu/Blacklist.png',
      route: '/records-blacklist',
      needSize: false,
      sizeClass: '',
    },
    // {
    //   text: 'RESIDENTS',
    //   icon: 'assets/icon-vms/records_menu/Residents.png',
    //   route: '/records-residents',
    //   needSize: true,
    //   sizeClass: 'mt-[5px] w-[130px] h-[90px] object-contain',
    //   params: {
    //     newOpen: true
    //   }
    // },
  ]

  toggleRecordsButton(records: any, params: any = false) {
    if (records.text == 'RESIDENTS'){
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
}
