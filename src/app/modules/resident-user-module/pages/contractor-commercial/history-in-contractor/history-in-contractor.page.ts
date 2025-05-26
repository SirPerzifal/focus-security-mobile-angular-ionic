import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-history-in-contractor',
  templateUrl: './history-in-contractor.page.html',
  styleUrls: ['./history-in-contractor.page.scss'],
})
export class HistoryInContractorPage implements OnInit {

  navButtonsMain: any[] = [
    {
      text: 'Daily Invite',
      active: false,
      action: 'route',
      routeTo: '/contractor-commercial-main'
    },
    {
      text: 'History',
      active: true,
      action: 'route',
      routeTo: '/history-in-contractor'
    },
  ]

  userType: string = '';

  isLoading: boolean = true;
  historyData: Array<{
    company_name: string
    purpose: string;
    visitor_name: string;
    visitor_date: Date;
    inviting_date: Date;
    visitor_entry_time: string;
    visitor_exit_time: string;
    mode_of_entry: string;
    vehicle_number: string;
    point_of_entry: string;
    mobile_number: string;
    banned: boolean;
    id: number;
    identification_number: string;
    identification_type: string
  }> = [];

  filteredData: any[] = [];
  selection: any[] = [];
  selectionNew: any[] = [];

  startDateFilter = '';
  endDateFilter = '';
  showDate = ''
  dateFilter = ''
  typeFilter = 'All'

  pagination = {
    current_page: 1,    // Changed to number with default value
    per_page: 10,       // Changed to number with default value
    total_page: 1,      // Changed to number with default value
    total_records: 0    // Changed to number with default value
  }

  constructor(private router: Router, private mainApiResidentService: MainApiResidentService, public functionMain: FunctionMainService, private alertController: AlertController) { 
  }
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getHistoryList();
  }

  handleRefresh(event: any) {
    this.isLoading = true;
    this.historyData = []
    this.historyData.pop();
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 1000)
  }

  backToPrevPage() {
    this.router.navigate(['/resident-home-page'])
  }

  goToPage(event: any, want?: string) {
    const inputValue = parseInt(event.target.value, 10);
    
    // Validate input: ensure it's a number within valid range
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= this.pagination.total_page) {
      this.getHistoryList('goto', inputValue);
    } else {
      // Reset to current page if invalid input
      event.target.value = this.pagination.current_page;
      
      // Optional: Show a toast message for invalid page
      this.functionMain.presentToast('Please enter a valid page number between 1 and ' + this.pagination.total_page, 'warning');
    }
  }

  getHistoryList(type?: string, page?: number) {
    this.selection.pop();
    this.selectionNew.pop()
    this.historyData.pop();

    // Ensure page is valid and within range
    if (page !== undefined) {
      page = Math.max(1, Math.min(page, this.pagination.total_page || 1));
    }

    this.mainApiResidentService.endpointMainProcess({
      page: page
    }, 'get/contractor_history').subscribe((response) => {
      var result = response.result['response_result']
      this.historyData = []
      this.selection = []
      this.selectionNew = []
      if (response.result.response_status === 400) {
        this.isLoading = false;
        return;
      } else {
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
            id: item['contractor_id'],
            visitor_name: item['contractor_name'],
            vehicle_number: item['vehicle_number'],
            mobile_number: item['contact_number'],
            company_name: item['company_name'],
            identification_number: item['identification_number'],
            identification_type: item['identification_type'],
            mode_of_entry: item['contractor_type'],
            visitor_date: item['visit_date'] ? item['visit_date'] : new Date(),
            inviting_date: item['inviting_date'] ? item['inviting_date'] : new Date(),
            visitor_entry_time: item['entry_time'],
            visitor_exit_time: item['exit_time'],
            point_of_entry: item['point_of_entry'],
            banned: item['is_banned'],
          });
          
          this.isLoading = false;
        });
        this.pagination = {
          current_page: response.result.pagination.current_page ? Number(response.result.pagination.current_page) : 1,
          per_page: response.result.pagination.per_page ? Number(response.result.pagination.per_page) : 10,
          total_page: response.result.pagination.total_pages ? Number(response.result.pagination.total_pages) : 1,
          total_records: response.result.pagination.total_records ? Number(response.result.pagination.total_records) : 0
        }
      }
      this.selection = [...this.selectionNew]
      this.filteredData = [...this.historyData];
      console.log(this.filteredData);
      
    })
  }

  onChangeVisitorType(event: Event) {
    const target = event.target as HTMLInputElement;
    // console.log("typefilter", target.value)
    this.typeFilter = target.value;
    this.applyFilters();
  }
  
  onChangeStartDate(value: any) {
    const date = new Date(value);
    this.startDateFilter = this.functionMain.formatDate(date);
    this.applyFilters();
  }

  onChangeEndDate(value: any) {
    const date = new Date(value);
    this.endDateFilter = this.functionMain.formatDate(date);
    this.applyFilters();
  }

  clearDateFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.typeFilter = 'All';
    this.dateFilter = '';
    this.showDate = '';
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredData = this.historyData.filter(item => {
        const visitorDate = new Date(item.visitor_date);
        visitorDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for date comparison
        
        const [ dayStart, monthStart, yearStart ] = this.startDateFilter.split('/');
        const setDefaultValueDateStart = `${yearStart}-${monthStart}-${dayStart}`;
        const [ dayEnd, monthEnd, yearEnd ] = this.endDateFilter.split('/');
        const setDefaultValueDateEnd = `${yearEnd}-${monthEnd}-${dayEnd}`;
        
        // Convert the selected start and end dates to Date objects
        const selectedStartDate = this.startDateFilter ? new Date(setDefaultValueDateStart) : null;
        const selectedEndDate = this.endDateFilter ? new Date(setDefaultValueDateEnd) : null;

        // Set time to 00:00:00 for comparison
        if (selectedStartDate) {
            selectedStartDate.setHours(0, 0, 0, 0);
        }
        if (selectedEndDate) {
            selectedEndDate.setHours(0, 0, 0, 0);
        }
        const dateMatches = (!selectedStartDate || visitorDate >= selectedStartDate) && (!selectedEndDate || visitorDate <= selectedEndDate);
        const typeMatches = this.typeFilter && this.typeFilter !== 'All' ? 
            (this.typeFilter === 'Other' ? 
                !(item.purpose === 'Delivery' || item.purpose === 'Collections' || item.purpose === 'Meeting') : 
                item.purpose === this.typeFilter) : 
            true;

        return dateMatches && typeMatches;
    });
  }

  openDetails(historyData: any) {
    this.router.navigate(['/detail-history-in-commercial'], {
      state: {
        historyData: historyData
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
