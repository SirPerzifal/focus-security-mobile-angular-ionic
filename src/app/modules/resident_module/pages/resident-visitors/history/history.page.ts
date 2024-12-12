import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { HistoryService } from 'src/app/service/resident/history/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor(private router: Router, private historyService: HistoryService) { }

  historyData: Array<{
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
  }> = [];

  filteredData: any[] = [];

  dateFilter = ''
  typeFilter = ''

  getHistoryList() {
    this.historyData.pop()
    this.historyService.getHistoryList().subscribe(
      res => {
        var result = res.result['response_result']
        this.historyData = []
        result.forEach((item: any) => {
          this.historyData.push({
            purpose: item['purpose'],
            visitor_name: item['visitor_name'],
            visitor_date: item['visit_date'] ? item['visit_date'] : new Date(),
            visitor_entry_time: 0,
            visitor_exit_time: 0,
            mode_of_entry: item['mode_of_entry'],
            vehicle_number: item['vehicle_number'],
            point_of_entry: item['point_of_entry'],
            mobile_number: item['contact_number'],
            delivery_type: item['delivery_type'],
            vehicle_type: item['vehicle_type'],
            banned: false,
            id: 0
          });
        });
        this.filteredData = [...this.historyData];
        console.log(this.filteredData)
      },
      error => {
        console.log(error)
      }
    )
  }

  onChangeDateFilter(value: Event) {
    const input = value.target as HTMLInputElement;
    this.dateFilter = input.value;
  
    this.applyFilters();
  }
  
  clearDateFilter() {
    this.typeFilter = '';
    this.dateFilter = '';
    this.applyFilters();
  }
  
  onChangeVisitorType(event: Event) {
    const target = event.target as HTMLInputElement;
    this.typeFilter = target.value;
  
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredData = this.historyData.filter(item => {
      const visitorDate = new Date(item.visitor_date);
      visitorDate.setHours(0, 0, 0, 0);  // Set waktu ke 00:00:00 untuk perbandingan tanggal
  
      const selectedDate = this.dateFilter ? new Date(this.dateFilter).setHours(0, 0, 0, 0) : null;
  
      const dateMatches = selectedDate ? visitorDate.getTime() === selectedDate : true;
      const typeMatches = this.typeFilter ? item.purpose === this.typeFilter : true;
  
      return dateMatches && typeMatches;
    });
  }

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    // this.router.navigate(['history']);
  }

  ngOnInit() {
    this.getHistoryList()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/history-page'){
          this.getHistoryList();
        }
      }
    });
  }

}
