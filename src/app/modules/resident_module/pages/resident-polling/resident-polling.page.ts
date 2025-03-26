import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { PollingService } from 'src/app/service/resident/polling/polling.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';


interface VotedOption {
  id: number;
  option: string;
}

@Component({
  selector: 'app-resident-polling',
  templateUrl: './resident-polling.page.html',
  styleUrls: ['./resident-polling.page.scss'],
})
export class ResidentPollingPage implements OnInit {
  isLoading: boolean = true;
  familyId: number = 0;
  projectId: number = 0;

  chooseOptionId: any[] = [];
  voteNow: boolean = false;
  dataForVote: any = [];
  closeVote: boolean = false; // Flag for closing animation
  openVote: boolean = false; // Flag for opening animation
  voteData: any = [
  ];

  voteNowOn(voteData?: any) {
    if (this.voteNow) {
      this.closeVote = true; // Set closing animation
      this.chooseOptionId = [];
      setTimeout(() => {
        this.voteNow = false; // Hide graph after animation
        this.closeVote = false; // Reset closing animation
      }, 500); // Match the duration of the animation
    } else {
      this.openVote = true; // Set opening animation
      this.voteNow = true; // Show graph
      this.dataForVote = voteData; // Set data for graph
      this.chooseOptionId = this.dataForVote.voted_option.map((v: VotedOption) => v.id); // Initialize chooseOptionId
      setTimeout(() => {
        this.openVote = false; // Reset opening animation
      }, 500); // Match the duration of the animation
    }
  }

  constructor(private getUserInfoService: GetUserInfoService, private pollingService: PollingService, private router: Router, public functionMain: FunctionMainService) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.familyId = parseValue.family_id;
        this.projectId = parseValue.project_id;
        this.loadPolling();
      }
    })
  }

  loadPolling() {
    this.pollingService.getPolling(
      this.familyId,
      this.projectId
    ).subscribe(
      (response: any) => {
        if (response.result.response_code === 200) {
          const today = new Date();
          const todayString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  
          this.voteData = response.result.result
          .filter((polling: any) => {
            const states = polling.states;
            return states !== 'closed'; // Memfilter polling yang tidak dalam status 'closed'
          }).map((polling: any) => {
            return {
              polling_name : polling.polling_name,
              polling_start_date : polling.polling_start_date,
              polling_end_date : polling.polling_end_date,
              states : this.functionMain.uppercaseFirst(polling.states),
              winning_response : polling.winning_response,
              is_multiple_answer : polling.is_multiple_answer,
              voted_option: Array.isArray(polling.voted_option) ? polling.voted_option.map((voted_option: any) => {
                return {
                  id: voted_option.id,
                  option: voted_option.option,
                };
              }) : polling.voted_option,
              options : polling.options.map((option: any) => {
                return {
                  id : option.id,
                  options : option.options,
                  vote_count : option.vote_count,
                }
              })
            }
          })
          this.isLoading = false;
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }
  
  isArrayAndJoin(options: VotedOption | VotedOption[]): string {
    if (Array.isArray(options)) {
      return options.map(v => v.option).join(', ') || '-';
    } else {
      return options.option || '-';
    }
  }

  isOptionSelected(optionId: number): boolean {
    if (Array.isArray(this.dataForVote.voted_option)) {
      return this.dataForVote.voted_option.some((v: VotedOption) => v.id === optionId);
    }
    return this.dataForVote.voted_option?.id === optionId; // Jika voted_option adalah objek
  }

  postChoosingOptions(optionId: number, isChecked: boolean) {
    if (isChecked) {
      // If checked, add the optionId to chooseOptionId
      this.chooseOptionId = []
      if (!this.chooseOptionId.includes(optionId)) {
        this.chooseOptionId.push(optionId);
      }
    } else {
      // If unchecked, remove the optionId from chooseOptionId
      const index = this.chooseOptionId.indexOf(optionId);
      if (index !== -1) {
        // console.log("suk sini");
        
        this.chooseOptionId.splice(index, 1);
        // if (index !== -1) {
        //   // console.log("suk sini lagi");
        //   this.chooseOptionId = this.dataForVote.voted_option.map((v: VotedOption) => v.id); // Initialize chooseOptionId
        // }
      } else {
        // console.log("suk sini ni");
        // this.chooseOptionId = []
        this.chooseOptionId.push(optionId);
        // Jika tidak ada, tambahkan block_id ke dalam array
      }
    }
  }
  
  postVote() {
    // console.log(this.chooseOptionId);
    
    this.pollingService.postPolling(
        this.familyId,
        this.chooseOptionId // Send the array of option IDs
    ).subscribe(
        (response: any) => {
            if (response.result.response_code === 200) {
                this.router.navigate(['/resident-polling']);
                window.location.reload();
            }
        },
        (error) => {
            console.error(error);
        }
    );
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
