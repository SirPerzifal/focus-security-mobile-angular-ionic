import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-closed-polling',
  templateUrl: './closed-polling.page.html',
  styleUrls: ['./closed-polling.page.scss'],
})
export class ClosedPollingPage implements OnInit {
  showGraph: boolean = false;
  dataForGraph: any = [];
  closingGraph: boolean = false; // Flag for closing animation
  openingGraph: boolean = false; // Flag for opening animation
  voteData: any = [
    {
      id: 1,
      title: 'Block Colour Voting',
      time_close: '01-01-2025',
      you_vote: 'B',
      result: 'B',
      forChart: {
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
      time_close: '15-02-2025',
      you_vote: 'A',
      result: 'A',
      forChart: {
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
      time_close: '30-03-2025',
      you_vote: 'C',
      result: 'C',
      forChart: {
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

  constructor() { }

  ngOnInit() { }

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
      console.log(voteDetal)
      setTimeout(() => {
        this.openingGraph = false; // Reset opening animation
      }, 500); // Match the duration of the animation
    }
  }
}