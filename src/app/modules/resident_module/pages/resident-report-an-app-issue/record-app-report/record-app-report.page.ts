import { Component, OnInit } from '@angular/core';
import { ReportIssueService } from 'src/app/service/resident/report-issue/report-issue.service';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-record-app-report',
  templateUrl: './record-app-report.page.html',
  styleUrls: ['./record-app-report.page.scss'],
})
export class RecordAppReportPage implements OnInit {
  unitId: number = 1;
  isReportApp: string = '1';
  allData: any = [];

  constructor(private reportIssueService: ReportIssueService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    // console.log("tes");
    this.loadTicketFromBackend();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/record-app-report'){
          this.allData = []
          this.loadTicketFromBackend();
        }
         // Panggil fungsi lagi saat halaman dibuka
      }
    });
  }

  loadTicketFromBackend() {
    this.reportIssueService.getAllDataReportForUse(
      this.unitId,
      this.isReportApp
    ).subscribe(
      (response) => {
        // console.log(response);
        if (response.result.response_code === 200) {
          this.allData = response.result.result;
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
    this.router.navigate(['/issue-app-detail'], {
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
