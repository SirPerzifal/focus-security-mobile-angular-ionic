import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { ReportIssueService } from 'src/app/service/resident/report-issue/report-issue.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {

  unitId: number = 1;
  isReportCondo: string = '1';
  allData: any = [];

  constructor(private reportIssueService: ReportIssueService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    // console.log("tes");
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.unitId = Number(parseValue.unit_id);
        this.loadTicketFromBackend();
      }
    })
  }

  loadTicketFromBackend() {
    this.reportIssueService.getAllDataReportForUse(
      this.unitId,
      '',
      this.isReportCondo
    ).subscribe(
      (response) => {
        // // console.log(response);
        if (response.result.response_code === 200) {
          this.allData = response.result.result;
          // // console.log(this.allData);
          // this.allData = response.result.result;
          // if (this.allData.length == 0) {
          //   // console.log(this.allData);
            
          // }
          // this.presentToast(response.result.message, 'success');
        } else {
          // this.presentToast(response.result.error_message, 'danger');
        }
      },
      (error) => {
        // this.presentToast(error.error.message, 'danger');
      }
    );
  }

  seeDetail(ticket: any) {
    // // console.log(ticket);
    this.router.navigate(['/issue-an-detail'], {
      state: {
        ticketDetail: ticket
      }
    });
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

}
