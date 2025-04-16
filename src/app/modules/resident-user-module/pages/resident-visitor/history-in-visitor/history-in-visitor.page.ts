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

  startDateFilter = '';
  endDateFilter = '';
  showDate = ''
  dateFilter = ''
  typeFilter = 'All'

  hideFilter: string = '';
  cardIfJustBan: string = '';

  constructor(private router: Router, private mainApiResidentService: MainApiResidentService, public functionMain: FunctionMainService, private alertController: AlertController) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { from: any};
    if (state) {
      // // console.log(state.from);
      this.hideFilter = state.from;
      this.cardIfJustBan = state.from;
    }
  }
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getHistoryList();
  }

  directTo() {
    if (this.cardIfJustBan === 'ban') {
      this.router.navigate(['/resident-my-profile']);
    } else {
      this.router.navigate(['/resident-homepage'])
    }
  }

  getHistoryList() {
    this.historyData.pop();
    this.mainApiResidentService.endpointMainProcess({}, 'get/visitor_history').subscribe((response) => {
      var result = response.result['response_result']
      this.historyData = []
      if (response.result.response_status === 400) {
        this.isLoading = false;
        return;
      } else {
        if (this.cardIfJustBan === 'ban') {
          const bannedItems = result.filter((item: any) => item['is_banned'] === true);
          
          bannedItems.forEach((item: any) => {
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
              banned: item['is_banned'],
              id: item['visitor_id']
            });
            this.isLoading = false;
          });
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
              banned: item['is_banned'],
              id: item['visitor_id']
            });
            this.isLoading = false;
          });
        }
      }
      this.filteredData = [...this.historyData];
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
