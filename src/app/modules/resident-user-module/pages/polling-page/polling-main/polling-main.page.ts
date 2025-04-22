import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { PollingService } from 'src/app/service/resident/polling/polling.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

interface VotedOption {
  id: number;
  option: string;
}

@Component({
  selector: 'app-polling-main',
  templateUrl: './polling-main.page.html',
  styleUrls: ['./polling-main.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class PollingMainPage implements OnInit {

  pageName: string = 'Open Polling';
  isLoading: boolean = true;
  navButtonsMain: any[] = [
    {
      text: 'Open',
      active: true,
      action: 'click',
    },
    {
      text: 'Upcoming',
      active: false,
      action: 'click',
    },
    {
      text: 'Closed',
      active: false,
      action: 'click',
    },
  ]

  showOpen: boolean = true;
  showUpcoming: boolean = false;
  showClosed: boolean = false;

  chooseOptionId: any[] = [];
  voteNow: boolean = false;
  dataForVote: any = [];
  closeVote: boolean = false; // Flag for closing animation
  openVote: boolean = false; // Flag for opening animation
  voteData: any = [];

  upcomingVoteData: any = [];
  hourStart: number = 0;

  closedVoteData: any = [];
  showGraph: boolean = false;
  dataForGraph: any = [];
  closingGraph: boolean = false; // Flag for closing animation
  openingGraph: boolean = false; // Flag for opening animation

  constructor(
    private mainApi: MainApiResidentService,
    private pollingService: PollingService,
    public functionMain: FunctionMainService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPolling();
  }

  onBack() {
    if (this.pageName === 'Open Polling' && this.voteNow === true) {
      this.closeVote = true; // Set closing animation
      this.chooseOptionId = [];
      setTimeout(() => {
        this.voteNow = false; // Hide graph after animation
        this.closeVote = false; // Reset closing animation
      }, 500); // Match the duration of the animation
    } else if (this.showGraph === true && this.pageName === 'Closed Polling') {
      this.closingGraph = true; // Set closing animation
      setTimeout(() => {
        this.showGraph = false; // Hide graph after animation
        this.closingGraph = false; // Reset closing animation
      }, 500); // Match the duration of the animation
    } else {
      this.router.navigate(['/resident-home-page'])
    }
  }

  onClick(event: any) {
    if (event[1] === 'Upcoming') {
      this.pageName = 'Upcoming Polling';
      this.voteData = [];
      this.closedVoteData = [];
      this.showOpen = false;
      this.showClosed = false;
      this.showUpcoming = true;
      this.navButtonsMain[0].active = false;
      this.navButtonsMain[2].active = false;
      this.navButtonsMain[1].active = true;
      this.loadUpcomingPolling();
    } else if (event[1] === 'Closed') {
      this.pageName = 'Closed Polling';
      this.voteData = [];
      this.upcomingVoteData = [];
      this.showOpen = false;
      this.showUpcoming = false;
      this.showClosed = true;
      this.navButtonsMain[0].active = false;
      this.navButtonsMain[1].active = false;
      this.navButtonsMain[2].active = true;
      this.loadClosedPolling();
    } else if (event[1] === 'Open') {
      this.pageName = 'Open Polling';
      this.closedVoteData = [];
      this.upcomingVoteData = [];
      this.showUpcoming = false;
      this.showClosed = false;
      this.showOpen = true;
      this.navButtonsMain[0].active = true;
      this.navButtonsMain[1].active = false;
      this.navButtonsMain[2].active = false;
      this.loadPolling();
    }
  }

  voteNowOn(voteData?: any) {
    this.openVote = true; // Set opening animation
    this.voteNow = true; // Show graph
    this.dataForVote = voteData; // Set data for graph
    this.chooseOptionId = this.dataForVote.voted_option.map((v: VotedOption) => v.id); // Initialize chooseOptionId
    setTimeout(() => {
      this.openVote = false; // Reset opening animation
    }, 500); // Match the duration of the animation
  }

  loadPolling() {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/polling').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
        console.log(todayString);
        

        this.voteData = response.result.result
        .filter((polling: any) => {
          const states = polling.states;
          return states === 'open'; // Memfilter polling yang tidak dalam status 'closed'
        }).filter((polling: any) => {
          const pollingDate = new Date(polling.polling_start_date).toISOString().split('T')[0];
          return pollingDate <= todayString; // Memfilter polling yang dimulai setelah hari ini
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
        console.log(this.voteData);
        
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    })
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
    this.mainApi.endpointMainProcess({
      polling_option_ids: this.chooseOptionId
    }, 'post/vote_polling').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        window.location.reload();
      }
    }, (error) => {
      console.error(error);
    })
  }

  loadUpcomingPolling() {
    this.isLoading = true;
    this.mainApi.endpointMainProcess({}, 'get/polling').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        console.log(today);
        

        this.upcomingVoteData = response.result.result
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
        console.log(this.upcomingVoteData);
        
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    })
  }

  toggleGraph(voteDetal?: any) {
    this.openingGraph = true; // Set opening animation
    this.showGraph = true; // Show graph
    this.dataForGraph = voteDetal; // Set data for graph
    // // console.log(voteDetal)
    setTimeout(() => {
      this.openingGraph = false; // Reset opening animation
    }, 500); // Match the duration of the animation
  }

  generateRandomColor() {
    const randomColor = () => Math.floor(Math.random() * 256);
    return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.2)`;
  };
  
  generateBorderColor(backgroundColor: any) {
    return backgroundColor.replace('0.2', '1');
  };

  loadClosedPolling() {
    this.mainApi.endpointMainProcess({}, 'get/polling').subscribe((response: any) => {
      if (response.result.response_code === 200) {  
        this.closedVoteData = response.result.result
        .filter((polling: any) => {
          const states = polling.states
          return states === 'closed'; // Memfilter polling yang tidak dimulai pada tanggal yang diberikan
        })
        .map((polling: any) => {
          // Ambil labels dan data dari polling.options
          const labels = polling.options.map((option: any) => option.options);
          const data = polling.options.map((option: any) => option.vote_count);

          // Menghasilkan warna acak untuk backgroundColor dan borderColor
          const backgroundColor = labels.map(() => this.generateRandomColor());
          const borderColor = backgroundColor.map((color: any) => this.generateBorderColor(color));

          return {
            polling_name: polling.polling_name,
            polling_start_date: polling.polling_start_date,
            polling_end_date: polling.polling_end_date,
            states: this.functionMain.uppercaseFirst(polling.states),
            winning_response: polling.winning_response,
            voted_option: Array.isArray(polling.voted_option) ? polling.voted_option.map((voted_option: any) => {
              return {
                id: voted_option.id,
                option: voted_option.option,
              };
            }) : polling.voted_option,
            options: polling.options.map((option: any) => {
              return {
                id: option.id,
                options: option.options,
                vote_count: option.vote_count,
              }
            }),
            forChart: {
              labels: labels,
              datasets: {
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
              }
            }
          }
        });
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    })
  }

}
