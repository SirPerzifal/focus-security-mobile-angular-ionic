import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { PollingService } from 'src/app/service/resident/polling/polling.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-upcoming-polling',
  templateUrl: './upcoming-polling.page.html',
  styleUrls: ['./upcoming-polling.page.scss'],
})
export class UpcomingPollingPage implements OnInit {
  isloading: boolean = true;
  familyId: number = 0;
  projectId: number = 0;

  voteData: any = [];
  hourStart: number = 0;

  constructor(private getUserInfoService: GetUserInfoService, private pollingService: PollingService, private router: Router, public functionMainService: FunctionMainService) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.familyId = parseValue.family_id;
        this.projectId = parseValue.project_id;
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        this.loadPolling(today);
      }
    })
  }

  loadPolling(excludeDate: string) {
    this.pollingService.getPolling(
      this.familyId,
      this.projectId
    ).subscribe(
      (response: any) => {
        if (response.result.response_code === 200) {
          const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  
          this.voteData = response.result.result
            .filter((polling: any) => {
              const pollingDate = new Date(polling.polling_start_date).toISOString().split('T')[0];
              return pollingDate > today; // Memfilter polling yang dimulai setelah hari ini
            })
            .filter((polling: any) => {
              const states = polling.states;
              return states !== 'closed'; // Memfilter polling yang tidak dalam status 'closed'
            })
            .map((polling: any) => {
              return {
                polling_name: polling.polling_name,
                polling_start_date: polling.polling_start_date
              };
            });
          this.isloading = false;
          // // console.log(this.voteData);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  filteredPolling(start_date: any) {

  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
