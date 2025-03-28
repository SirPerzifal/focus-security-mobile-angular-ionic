import { Component, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-closed-polling',
  templateUrl: './closed-polling.page.html',
  styleUrls: ['./closed-polling.page.scss'],
})
export class ClosedPollingPage implements OnInit, OnDestroy {
  isLoading: boolean = true;
  familyId: number = 0;
  projectId: number = 0;
  
  showGraph: boolean = false;
  dataForGraph: any = [];
  closingGraph: boolean = false; // Flag for closing animation
  openingGraph: boolean = false; // Flag for opening animation
  voteData: any = [
    // {
    //   id: 1,
    //   title: 'Block Colour Voting',
    //   time_close: '01-01-2025',
    //   you_vote: 'B',
    //   result: 'B',
    //   forChart: {
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
    //   time_close: '15-02-2025',
    //   you_vote: 'A',
    //   result: 'A',
    //   forChart: {
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
    //   time_close: '30-03-2025',
    //   you_vote: 'C',
    //   result: 'C',
    //   forChart: {
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

  constructor(private getUserInfoService: GetUserInfoService, private pollingService: PollingService, private router: Router, public funcitonMain: FunctionMainService) { }

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

  toggleGraph(voteDetal?: any) {
    if (this.showGraph) {
      this.closingGraph = true; // Set closing animation
      setTimeout(() => {
        this.showGraph = false; // Hide graph after animation
        this.closingGraph = false; // Reset closing animation
      }, 500); // Match the duration of the animation
    } else {
      this.openingGraph = true; // Set opening animation
      this.showGraph = true; // Show graph
      this.dataForGraph = voteDetal; // Set data for graph
      // // console.log(voteDetal)
      setTimeout(() => {
        this.openingGraph = false; // Reset opening animation
      }, 500); // Match the duration of the animation
    }
  }

  generateRandomColor() {
    const randomColor = () => Math.floor(Math.random() * 256);
    return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.2)`;
  };
  
  generateBorderColor(backgroundColor: any) {
    return backgroundColor.replace('0.2', '1');
  };

  isArrayAndJoin(options: VotedOption | VotedOption[]): string {
    if (Array.isArray(options)) {
      return options.map(v => v.option).join(', ') || '-';
    } else {
      return options.option || '-';
    }
  }

  loadPolling() {
    this.pollingService.getPolling(
      this.familyId,
      this.projectId
    ).subscribe(
      (response: any) => {
        if (response.result.response_code === 200) {  
          this.voteData = response.result.result
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
              states: this.funcitonMain.uppercaseFirst(polling.states),
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
      },
      (error) => {
        console.error(error);
      }
    )
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}