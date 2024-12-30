import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-closed-polling',
  templateUrl: './closed-polling.page.html',
  styleUrls: ['./closed-polling.page.scss'],
})
export class ClosedPollingPage implements OnInit {
  showGraph: boolean = false;

  constructor() { }

  ngOnInit() { }

  toggleGraph() {
    this.showGraph = !this.showGraph;
  }
}