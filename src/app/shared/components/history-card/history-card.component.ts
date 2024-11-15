import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-card',
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss'],
})
export class HistoryCardComponent  implements OnInit {

  constructor(private router: Router) { }

  @Input() purpose: string=''
  @Input() visitor: string=''
  @Input() visit_date: string=''
  @Input() banned: boolean=false

  ngOnInit() {
    console.log(this.purpose, this.visitor, this.visit_date, this.banned)
  }

  openDetails() {
    this.router.navigate(['/history-details'], {
      state: {
        purpose: this.purpose,
        visitor: this.visitor,
        visit_date: this.visit_date,
        banned: this.banned
      }
    });
  }

}
