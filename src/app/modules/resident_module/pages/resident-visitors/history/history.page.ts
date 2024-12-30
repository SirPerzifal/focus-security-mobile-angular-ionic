import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
    visitor_entry_time: string;
    visitor_exit_time: string;
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

  showStartDate = '';
  showEndDate = '';
  startDateFilter = '';
  endDateFilter = '';
  showDate = ''
  dateFilter = ''
  typeFilter = ''

  getHistoryList() {
    this.historyData.pop()
    this.historyService.getHistoryList().subscribe(
      res => {
        var result = res.result['response_result']
        this.historyData = []
        result.forEach((item: any) => {
          const [entryHours, entryMinutes] = item['entry_time'].split(':').map(Number);
          const entryDate = new Date();
          entryDate.setHours(entryHours, entryMinutes, 0, 0); 
          entryDate.setHours(entryDate.getHours() + 1);
          const exitTime = `${entryDate.getHours().toString().padStart(2, '0')}:${entryDate.getMinutes().toString().padStart(2, '0')}`;
          const visitDate = item['visit_date'] ? item['visit_date'] : new Date();
          const dateParts = visitDate.split('-'); // Misalnya, '2023-10-15' menjadi ['2023', '10', '15']
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

          this.historyData.push({
            purpose: item['purpose'],
            visitor_name: item['visitor_name'],
            visitor_date: item['visit_date'] ? item['visit_date'] : new Date(),
            visitor_entry_time: item['entry_time'],
            visitor_exit_time: exitTime,
            mode_of_entry: item['mode_of_entry'],
            vehicle_number: item['vehicle_number'],
            point_of_entry: item['point_of_entry'],
            mobile_number: item['contact_number'],
            delivery_type: item['delivery_type'],
            vehicle_type: item['vehicle_type'],
            banned: false,
            id: item['id']
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
    const dateParts = this.dateFilter.split('-'); // Misalnya, '2023-10-15' menjadi ['2023', '10', '15']
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; 
    this.showDate = formattedDate;
    this.applyFilters();
  }
  
  onChangeStartDate(value: Event) {
    const input = value.target as HTMLInputElement;
    this.startDateFilter = input.value;
    const dateParts = this.startDateFilter.split('-');
    this.showStartDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Format to dd/mm/yyyy
    this.applyFilters();
  }

  onChangeEndDate(value: Event) {
    const input = value.target as HTMLInputElement;
    this.endDateFilter = input.value;
    const dateParts = this.endDateFilter.split('-');
    this.showEndDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Format to dd/mm/yyyy
    this.applyFilters();
  }

  clearDateFilter() {
    this.showStartDate = '';
    this.showEndDate = '';
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.typeFilter = '';
    this.dateFilter = '';
    this.showDate = '';
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
      visitorDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for date comparison
  
      // Convert the selected start and end dates to Date objects
      const selectedStartDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
      const selectedEndDate = this.endDateFilter ? new Date(this.endDateFilter) : null;
  
      // Set time to 00:00:00 for comparison
      if (selectedStartDate) {
        selectedStartDate.setHours(0, 0, 0, 0);
      }
      if (selectedEndDate) {
        selectedEndDate.setHours(0, 0, 0, 0);
      }
  
      const dateMatches = (!selectedStartDate || visitorDate >= selectedStartDate) &&
                          (!selectedEndDate || visitorDate <= selectedEndDate);
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

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
