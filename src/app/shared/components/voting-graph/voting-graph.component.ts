import { Component, AfterViewInit, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-voting-graph',
  templateUrl: './voting-graph.component.html',
  styleUrls: ['./voting-graph.component.scss'],
})
export class VotingGraphComponent implements AfterViewInit {
  @Input() chartData: any; // Input property to receive data
  chart: any;

  constructor() {
    // Register all necessary components
    Chart.register(...registerables);
    Chart.register(ChartDataLabels); // Register the Data Labels plugin
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    if (!this.chartData) {
      console.error('No chart data provided!');
      return;
    }
    
    this.chart = new Chart('votingChart', {
      type: 'bar',
      data: {
        labels: this.chartData.forChart.labels, // Use the labels from the input data
        datasets: [{
          data: this.chartData.forChart.datasets.data, // Use the data from the input data
          backgroundColor: this.chartData.forChart.datasets.backgroundColor,
          borderColor: this.chartData.forChart.datasets.borderColor,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            anchor: 'center', // Position the label in the center of the bar
            align: 'center', // Align the label in the center of the bar
            formatter: (value) => {
              return value; // Display the value
            },
            color: 'black' // Change the color of the label
          }
        }
      }
    });
  }
}