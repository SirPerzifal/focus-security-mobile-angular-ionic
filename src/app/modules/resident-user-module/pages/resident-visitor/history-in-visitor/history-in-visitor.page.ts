import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-history-in-visitor',
  templateUrl: './history-in-visitor.page.html',
  styleUrls: ['./history-in-visitor.page.scss'],
})
export class HistoryInVisitorPage implements OnInit, OnDestroy {

  navButtonsMain: any[] = [
    {
      text: 'Daily Invite',
      active: false,
      action: 'route',
      routeTo: '/visitor-main'
    },
    {
      text: 'Hired Car',
      active: false,
      action: 'route',
      routeTo: '/hired-card-in-visitor'
    },
    {
      text: 'History',
      active: true,
      action: 'route',
      routeTo: '/history-in-visitor'
    },
  ]
  userType: string = '';

  isLoading: boolean = true;
  historyData: any[] = [];

  filteredData: any[] = [];

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

  handleRefresh(event: any) {
    this.typeFilter = 'All';
    this.isLoading = true;
    this.historyData = []
    this.historyData.pop();
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 1000)
  }

  ionViewWillEnter(){
    this.getHistoryList();
  }

  directTo() {
    this.router.navigate(['/resident-home-page'])
  }

  goToPage(event: any) {
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
    this.isLoading = true;
    this.historyData.pop();

    if (page !== undefined) {
      page = Math.max(1, Math.min(page, this.pagination.total_page || 1));
    }

    this.mainApiResidentService.endpointMainProcess({
      page: page
    }, 'get/visitor_history').subscribe((response) => {
      var result = response.result['response_result']
      this.historyData = []
      if (response.result.response_status === 400) {
        this.isLoading = false;
        return;
      } else {
        result.forEach((item: any) => {
          const [entryHours, entryMinutes] = item['entry_time'].split(':').map(Number);
          const entryDate = new Date();
          entryDate.setHours(entryHours, entryMinutes, 0, 0); 
          entryDate.setHours(entryDate.getHours() + 1);
          const visitDate = item['visit_date'] ? item['visit_date'] : new Date();
          const dateParts = visitDate.split('-'); // Misalnya, '2023-10-15' menjadi ['2023', '10', '15']

          this.historyData.push({
            purpose: item['purpose'],
            id: item['visitor_id'],
            visitor_name: item['visitor_name'],
            vehicle_number: item['vehicle_number'],
            mobile_number: item['contact_number'],
            mode_of_entry: item['mode_of_entry'],
            visitor_type: item['visitor_type'],
            visitor_date: item['visit_date'] ? item['visit_date'] : new Date(),
            visitor_entry_time: item['entry_time'],
            visitor_exit_time: item['exit_time'],
            point_of_entry: item['point_of_entry'],
            delivery_type: item['delivery_type'],
            vehicle_type: item['vehicle_type'],
            banned: item['is_banned'],
            reason_for_banning: item['reason_for_banning'],
            company_name: item['company_name'],
          });
        });
        this.pagination = {
          current_page: response.result.pagination.current_page ? Number(response.result.pagination.current_page) : 1,
          per_page: response.result.pagination.per_page ? Number(response.result.pagination.per_page) : 10,
          total_page: response.result.pagination.total_pages ? Number(response.result.pagination.total_pages) : 1,
          total_records: response.result.pagination.total_records ? Number(response.result.pagination.total_records) : 0
        }
        this.isLoading = false;
      }
      this.filteredData = [...this.historyData];
      console.log(JSON.stringify(result));
      
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
      const setDefaultValueDateStart = `${yearStart}-${monthStart}-${dayStart}`
      const [ dayEnd, monthEnd, yearEnd ] = this.endDateFilter.split('/');
      const setDefaultValueDateEnd = `${yearEnd}-${monthEnd}-${dayEnd}`
      
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
      const typeMatches = this.typeFilter && this.typeFilter !== 'All' ? item.purpose === this.typeFilter : true;
  
      return dateMatches && typeMatches;
    });
  }

  openDetails(historyData: any) {
    
    this.router.navigate(['/detail-history-in-visitor'], {
      state: {
        historyData: historyData
      }
    });
  }

  public async showAlertButtons(headerName: string, className: string, historyData: any) {
    const alertButtons = await this.alertController.create({
      cssClass: className,
      header: headerName + " this visitor?",
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.reinstateProcess(historyData);
            // console.log(historyData);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert cancel');
          },
        },
      ]
    });
    await alertButtons.present ();
  }

  reinstateProcess(historyData: any) {
    console.log("tes");
    this.mainApiResidentService.endpointMainProcess({
      contact_no: historyData.mobile_number,
      vehicle_number: historyData.vehicle_number
    }, 'post/reinstate_visitor').subscribe(
      (response) => {
        console.log('Success:', response);
        // this.router.navigate(['resident-my-profile']);
      },
    )
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
