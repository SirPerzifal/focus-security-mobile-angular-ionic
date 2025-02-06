import { Component, OnInit } from '@angular/core';
import { ReportIssueService } from 'src/app/service/resident/report-issue/report-issue.service';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resident-report-an-issue',
  templateUrl: './resident-report-an-issue.page.html',
  styleUrls: ['./resident-report-an-issue.page.scss'],
})
export class ResidentReportAnIssuePage implements OnInit {
  reporterDetailsFrom = {
    requestorId: 1,
    blokId: 1,
    unitId: 1,
    name: 'John Doe',
    contactNumber: '1234567890',
    email: 'johndoe@example.com',
    blockAndUnit: 'Block 123, Unit 456',
    placeOfResidence: '123 Main St, City',
    typeReport: 0,
    summaryReport: ''
  };
  extend_mb = false
  typeOfReport: any = []

  constructor(private reportIssueService: ReportIssueService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    console.log("tes");
    this.loadType();
  }
  
  loadType() {
    this.reportIssueService.getReportCondoTypeOfIssue().subscribe(
      (response) => {
        // console.log(response);
        this.typeOfReport = response.result.result;
        this.presentToast(response.result.message, 'success');
      },
      (error) => {
        this.presentToast('Failed to load your report. Please try again later.', 'danger');
        console.error(error);
      }
    );
  }
  
  onTypeReportChange(event: any){
    // console.log(event.target.value);
    const type = event.target.value;
    this.reporterDetailsFrom.typeReport = parseInt(type);
  }

  onSubmit() {
    // Simpan data ke server
    this.reportIssueService.postReportIssue(
      this.reporterDetailsFrom.typeReport,
      this.reporterDetailsFrom.requestorId,
      this.reporterDetailsFrom.summaryReport,
      this.reporterDetailsFrom.unitId,
      this.reporterDetailsFrom.blokId,
    ).subscribe(
      (response) => {
        console.log(response);
        this.presentToast(response.result.message, 'success');
        this.router.navigateByUrl('/record');
      },
      (error) => {
        this.presentToast('Failed to submit your report. Please try again later.', 'danger');
        console.error(error);
      }
    );
  }

  testAddMb(status: boolean = false) {
    this.extend_mb = status
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