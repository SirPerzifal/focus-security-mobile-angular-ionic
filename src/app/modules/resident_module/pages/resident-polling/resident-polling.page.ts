import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { PollingService } from 'src/app/service/resident/polling/polling.service';
import { Router, NavigationStart } from '@angular/router';
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
  familyId: number = 0;
  projectId: number = 0;

  chooseOptionId: any[] = [];
  voteNow: boolean = false;
  dataForVote: any = [];
  closeVote: boolean = false; // Flag for closing animation
  openVote: boolean = false; // Flag for opening animation
  voteData: any = [
    // {
    //   id: 1,
    //   title: 'Block Colour Voting',
    //   time_close: '01-01-2025 23:00:00',
    //   time_you_vote: '',
    //   you_vote: '',
    //   forSelectionChoise: {
    //     labels: ['Option A', 'Option B', 'Option C'],
    //     datasets: {
    //       data: [15, 25, 10], // Different vote counts
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //       ],
    //       borderColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //       ]
    //     }
    //   }
    // },
    // {
    //   id: 2,
    //   title: 'Unit Colour Voting',
    //   time_close: '15-02-2025 23:00:00',
    //   time_you_vote: '',
    //   you_vote: '',
    //   forSelectionChoise: {
    //     labels: ['Option D', 'Option E', 'Option F'],
    //     datasets: {
    //       data: [20, 15, 5], // Different vote counts
    //       backgroundColor: [
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)',
    //       ],
    //       borderColor: [
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)',
    //       ]
    //     }
    //   }
    // },
    // {
    //   id: 3,
    //   title: 'Garden Colour Voting',
    //   time_close: '30-03-2025 23:00:00',
    //   time_you_vote: '',
    //   you_vote: '',
    //   forSelectionChoise: {
    //     labels: ['Option G', 'Option H', 'Option I'],
    //     datasets: {
    //       data: [30, 10, 20], // Different vote counts
    //       backgroundColor: [
    //         'rgba(255, 205, 86, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 99, 132, 0.2)',
    //       ],
    //       borderColor: [
    //         'rgba(255, 205, 86, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 99, 132, 1)',
    //       ]
    //     }
    //   }
    // }
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
    // Ambil data unit yang sedang aktif
    this.getUserInfoService.getPreferenceStorage(
      [ 
        'project_id',
        'family'
      ]
    ).then((value) => {
      // // console.log(value);
      this.familyId = Number(value.family);
      this.projectId = Number(value.project_id);
      
      // Load polling data
      this.loadPolling();
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/resident-polling'){
          this.voteData = []
          this.loadPolling();
        }
         // Panggil fungsi lagi saat halaman dibuka
      }
    });
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
