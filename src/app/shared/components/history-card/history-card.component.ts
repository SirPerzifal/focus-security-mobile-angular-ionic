import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-card',
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss'],
})
export class HistoryCardComponent  implements OnInit {

  constructor(private router: Router) { }

  @Input() historyData!: {
    purpose: string;
    visitor_name: string;
    visitor_date: Date;
    visitor_entry_time: number;
    visitor_exit_time: number;
    mode_of_entry: string;
    vehicle_number: string;
    point_of_entry: string;
    mobile_number: string;
    delivery_type: string;
    vehicle_type: string;
    banned: boolean;
    id: number;
  };

  ngOnInit() {
    // console.log(this.historyData)
  }

  openDetails() {
    this.router.navigate(['/history-details'], {
      state: {
        historyData: this.historyData
      }
    });
  }

}
