import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-voting-graph',
  templateUrl: './voting-graph.component.html',
  styleUrls: ['./voting-graph.component.scss'],
})
export class VotingGraphComponent implements AfterViewInit {
  chart: any;

  constructor() {
    // Register all necessary components
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('votingChart', {
      type: 'bar',
      data: {
        labels: ['Option A', 'Option B', 'Option C'],
        datasets: [{
          label: 'Votes',
          data: [12, 19, 3], // Example data
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}