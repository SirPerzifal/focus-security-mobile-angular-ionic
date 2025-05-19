import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-refresher-page',
  templateUrl: './refresher-page.component.html',
  styleUrls: ['./refresher-page.component.scss'],
})
export class RefresherPageComponent  implements OnInit {

  @Output() eventEmitter = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  handleRefresh(event: any) {
    this.eventEmitter.emit(event)
  }

}
