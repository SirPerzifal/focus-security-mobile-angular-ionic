import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resident-polling',
  templateUrl: './resident-polling.page.html',
  styleUrls: ['./resident-polling.page.scss'],
})
export class ResidentPollingPage implements OnInit {
  voteNow: boolean = false;
  dataForVote: any = [];
  closeVote: boolean = false; // Flag for closing animation
  openVote: boolean = false; // Flag for opening animation
  voteData: any = [
    {
      id: 1,
      title: 'Block Colour Voting',
      time_close: '01-01-2025 23:00:00',
      time_you_vote: '',
      you_vote: '',
      forSelectionChoise: {
        labels: ['Option A', 'Option B', 'Option C'],
        datasets: {
          data: [15, 25, 10], // Different vote counts
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ]
        }
      }
    },
    {
      id: 2,
      title: 'Unit Colour Voting',
      time_close: '15-02-2025 23:00:00',
      time_you_vote: '',
      you_vote: '',
      forSelectionChoise: {
        labels: ['Option D', 'Option E', 'Option F'],
        datasets: {
          data: [20, 15, 5], // Different vote counts
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ]
        }
      }
    },
    {
      id: 3,
      title: 'Garden Colour Voting',
      time_close: '30-03-2025 23:00:00',
      time_you_vote: '',
      you_vote: '',
      forSelectionChoise: {
        labels: ['Option G', 'Option H', 'Option I'],
        datasets: {
          data: [30, 10, 20], // Different vote counts
          backgroundColor: [
            'rgba(255, 205, 86, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 205, 86, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ]
        }
      }
    }
  ];

  voteNowOn(voteData?: any) {
    if (this.voteNow) {
      this.closeVote = true; // Set closing animation
      setTimeout(() => {
        this.voteNow = false; // Hide graph after animation
        this.closeVote = false; // Reset closing animation
      }, 500); // Match the duration of the animation
    } else {
      this.openVote = true; // Set opening animation
      this.voteNow = true; // Show graph
      this.dataForVote = voteData; // Set data for graph
      console.log(voteData)
      setTimeout(() => {
        this.openVote = false; // Reset opening animation
      }, 500); // Match the duration of the animation
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
