import { Component, OnInit } from '@angular/core';
import { ReportIssueService } from 'src/app/service/resident/report-issue/report-issue.service';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';

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
    console.log("tes");
    this.loadTicketFromBackend();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/record'){
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
      '',
      this.isReportCondo
    ).subscribe(
      (response) => {
        console.log(response);
        if (response.result.response_code === 200) {
          this.allData = response.result.result;
          console.log(this.allData);
          this.allData = response.result.result;
          if (this.allData.length == 0) {
            console.log(this.allData);
            
          }
          this.presentToast(response.result.message, 'success');
        } else {
          this.presentToast(response.result.error_message, 'danger');
        }
      },
      (error) => {
        this.presentToast(error.error.message, 'danger');
      }
    );
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
