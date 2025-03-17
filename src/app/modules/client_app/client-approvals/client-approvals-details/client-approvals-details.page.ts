import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-approvals-details',
  templateUrl: './client-approvals-details.page.html',
  styleUrls: ['./client-approvals-details.page.scss'],
})
export class ClientApprovalsDetailsPage implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService, private clientMainService: ClientMainService) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { approval: any, approval_type: string };
    if (state) {
      this.approval = state.approval
      this.approval_type = state.approval_type
    } 
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  approval: any = []
  approval_type = ''

  approveDetail(approval: any) {
    console.log(approval)
    console.log(this.approval_type)
    this.clientMainService.getApi({model_name: this.approval_type, record_id: approval.id}, '/client/approve').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.success) {
          this.approval.states = 'approved'
          this.functionMain.presentToast(`Successfully approved this data!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while trying to approve this data!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to approve this data!', 'danger');
        console.error(error);
      }
    });
  }

  rejectDetail(approval: any) {
    console.log(approval)
    console.log(this.approval_type)
    this.clientMainService.getApi({model_name: this.approval_type, record_id: approval.id}, '/client/reject').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.success) {
          this.approval.states = 'rejected'
          this.functionMain.presentToast(`Successfully rejected this data!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while trying to reject this data!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to reject this data!', 'danger');
        console.error(error);
      }
    });
  }

  onBack() {
    this.router.navigate(['/client-approvals'])
  }

}
