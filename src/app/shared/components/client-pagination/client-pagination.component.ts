import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-client-pagination',
  templateUrl: './client-pagination.component.html',
  styleUrls: ['./client-pagination.component.scss'],
})
export class ClientPaginationComponent  implements OnInit {

  constructor() { }

  @Input() currentPage: any = 1
  @Input() inputPage: any = 1
  @Input() total_pages: any = 0
  @Input() pagination: any = {}

  @Output() pageForward = new EventEmitter<any>();

  changePage(page: number) {
    let tempPage = page
    console.log(tempPage, this.pagination.total_pages)
    if (tempPage > 0 && tempPage <= this.pagination.total_pages) {
      this.currentPage = tempPage
      this.pageForward.emit(this.currentPage)
    } else {
    }
    this.inputPage = this.currentPage
  }

  ngOnInit() {}

}
