import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-records-contractor-detail',
  templateUrl: './records-contractor-detail.page.html',
  styleUrls: ['./records-contractor-detail.page.scss'],
})
export class RecordsContractorDetailPage implements OnInit {

  constructor(public functionMain: FunctionMainService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any[] };
    if (state) {
      this.record = state.record
      console.log(this.record)
    }
  }

  ngOnInit() {
    this.loadProjectName()
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_name = value.project_name.toUpperCase()
      this.project_config = value.config
    })
  }
  project_name = ''
  project_config: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  record: any = []
  isMain = true

  onClickDetail() {
    this.isMain = false
  }

  onBack() {
    if (this.isMain) {
      this.router.navigate(['/records-contractor'])
    } else {
      this.isMain = true
    }
  }

  onHomeClick() {
    this.router.navigate(['/home-vms'])
  }

}
