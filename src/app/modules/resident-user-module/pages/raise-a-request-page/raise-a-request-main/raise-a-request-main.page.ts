import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { AllData, AccessCard, OvernightParking, BicycleTag, RegisteredCoach, RequestSchedule, PetRegistration, Appeal } from 'src/models/resident/raiseRequestModel.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raise-a-request-main',
  templateUrl: './raise-a-request-main.page.html',
  styleUrls: ['./raise-a-request-main.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class RaiseARequestMainPage implements OnInit {

  subPageName: string = 'New Request';
  navButtonsMain: any[] = [
    {
      text: 'New Request',
      active: true,
      action: 'click',
    },
    {
      text: 'History Request',
      active: false,
      action: 'click',
    },
  ]
  squareButton: any[] = [
    {
      id: 1,
      name: 'Access Card',
      src: 'assets/icon/resident-icon/raise_request/Rectangle 2.webp',
      routeLinkTo: '/form-for-request-access-card',
    },
    {
      id: 2,
      name: 'Apply Overnight',
      src: 'assets/icon/resident-icon/raise_request/Rectangle 3.webp',
      routeLinkTo: '/form-for-request-overnight-parking'
    },
    {
      id: 3,
      name: 'Bicycle Tag',
      src: 'assets/icon/resident-icon/raise_request/Rectangle 5.webp',
      routeLinkTo: '/form-for-request-bibycle-tag-application'
    },
    {
      id: 4,
      name: 'Coach Registration',
      src: 'assets/icon/resident-icon/raise_request/Rectangle 4.webp',
      routeLinkTo: '/form-for-coach-registration'
    },
    {
      id: 5,
      name: 'Move Permit',
      src: 'assets/icon/resident-icon/raise_request/Rectangle 6.webp',
      routeLinkTo: '/form-for-request-move-in-out-permit'
    },
    {
      id: 6,
      name: 'Pet Registration',
      src: 'assets/icon/resident-icon/raise_request/Rectangle 7.webp',
      routeLinkTo: '/form-for-registration-pet'
    },
    {
      id: 7,
      name: 'Renovation Work',
      src: 'assets/icon/resident-icon/raise_request/Rectangle 8.webp',
      routeLinkTo: '/form-for-request-registration-permit'
    },
    {
      id: 8,
      name: 'Appeal Parking',
      src: 'assets/icon/resident-icon/raise_request/Rectangle 3.webp',
      routeLinkTo: '/form-and-history-appeal-parking-fines'
    }
  ]

  isLoading: boolean = true;

  selectedApplicationType: string = ''; // Deklarasi variabel untuk menyimpan tipe aplikasi yang dipilih
  allDatas: AllData[] = [];

  accessCard: any[] = [];
  titleForCard: string = '';

  overnight: any[] = [];
  titleForOvernight: string = '';

  bicycle: any[] = [];
  titleForBicycle: string = '';

  coach: any[] = [];
  titleForCoach: string = '';

  schedule: any[] = [];
  titleForSchedule: string = '';
  typeSchedule: any[] = []

  pet: any[] = [];
  titleForPet: string = '';

  appeal: any[] = [];
  titleForAppeal: string = '';

  requestorId: number = 1;
  unitId: number = 1;
  filteredDatas: any[] = []; // Variabel untuk menyimpan data yang difilter
  fieldMapping: { [key: string]: string[] } = {
    'Access cards Application.': [
      'Create Date',
      'States',
      'Access Card Status',
      'Access Card End Date'
    ],
    'Overnight parking records Application.': [
      'Create Date',
      'States',
      'Vehicle Number',
      'Approved End Date'
    ],
    'Bicycle tags Application.': [
      'Create Date',
      'States',
      'Bicycle Tag',
      'Bicycle Brand'
    ],
    'Registered coaches Application.': [
      'Create Date',
      'States',
      'Coach Name',
      'Expected Start Date'
    ],
    'Request schedules Application.': [
      'Create Date',
      'States',
      'Schedule Type',
      'Schedule Date'
    ],
    'Pets Application.': [
      'Create Date',
      'States',
      'Type Of Pet',
      'Pet Breed'
    ],
    'Offences Application.': [
      'Appeal Status',
      'Reason For Appeal'
    ]
  };

  pagination = {
    current_page: 1,    // Changed to number with default value
    per_page: 10,       // Changed to number with default value
    total_page: 1,      // Changed to number with default value
    total_records: 0    // Changed to number with default value
  }

  constructor(
    private mainApi: MainApiResidentService,
    private router: Router,
    private functionMain: FunctionMainService
  ) { }

  ngOnInit() {
  }

  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.loadHistoryRequests();
      event.target.complete();
    }, 1000)
  }

  onClickNavTabs(event: any) {
    this.subPageName = `${event[1]}`;

    if (this.subPageName === 'History Request') {
      this.selectedApplicationType = 'All'
      this.selectedScheduleType = 'All'
      this.loadHistoryRequests();
    }

    // Reset semua tombol menjadi tidak aktif
    this.navButtonsMain.forEach(button => {
      button.active = false;
    });

    // Aktifkan tombol yang sesuai
    const selectedButton = this.navButtonsMain.find(button => button.text === event[1]);
    if (selectedButton) {
      selectedButton.active = true;
    }
  }

  goToPage(event: any) {
    const inputValue = parseInt(event.target.value, 10);
    
    // Validate input: ensure it's a number within valid range
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= this.pagination.total_page) {
      this.loadHistoryRequests('goto', inputValue);
    } else {
      // Reset to current page if invalid input
      event.target.value = this.pagination.current_page;
      
      // Optional: Show a toast message for invalid page
      this.functionMain.presentToast('Please enter a valid page number between 1 and ' + this.pagination.total_page, 'warning');
    }
  }

  loadHistoryRequests(type?: string, page?: number) {
    this.isLoading = true;
    this.accessCard = [];
    this.overnight = [];
    this.bicycle = [];
    this.coach = [];
    this.schedule = [];
    this.pet = [];
    this.appeal = [];
    this.allDatas = [];
    this.filteredDatas = [];
    this.pagination = {
      current_page: 0,
      per_page: 0,
      total_page: 0,
      total_records: 0
    }
    this.mainApi.endpointMainProcess({
      page: page,
      type: type
    }, 'get/raise_a_request_status').subscribe(      
      (response: any) => {
        console.log("Response data:", JSON.stringify(response));
        
        // Process the flat array data format
        const data = response.result.data || [];
        console.log(response.result, data, response.data, response.result.data);
        
        
        // Group the data by application type
        this.accessCard = data.filter((item: any) => item.application_title === 'Access cards Application.');
        this.overnight = data.filter((item: any) => item.application_title === 'Overnight parking records Application.');
        this.bicycle = data.filter((item: any) => item.application_title === 'Bicycle tags Application.');
        this.coach = data.filter((item: any) => item.application_title === 'Registered coaches Application.');
        
        // Filter and process Request Schedules 
        const allSchedules = data.filter((item: any) => item.application_title === 'Request schedules Application.');
        this.schedule = allSchedules;
        this.typeSchedule = [...new Set(allSchedules.map((item: any) => item.schedule_type || ''))];
        
        this.pet = data.filter((item: any) => item.application_title === 'Pets Application.');
        this.appeal = data.filter((item: any) => item.application_title === 'Offences Application.');

        // Combine all data for filterable list
        this.allDatas = [...data];
        this.filteredDatas = [...data];
        
        this.isLoading = false;
        
        // Update pagination from response
        this.pagination = {
          current_page: response.result.pagination?.current_page ? Number(response.result.pagination.current_page) : 1,
          per_page: response.result.pagination?.per_page ? Number(response.result.pagination.per_page) : 10,
          total_page: response.result.pagination?.total_pages ? Number(response.result.pagination.total_pages) : 1,
          total_records: response.result.pagination?.total_records ? Number(response.result.pagination.total_records) : 0
        }
        console.log(this.pagination);
        
      },
      (error) => {
        console.error("Error loading history requests:", error);
        this.isLoading = false;
      }
    )
  }

  selectedScheduleType: string = ''; // Variabel untuk menyimpan tipe jadwal yang dipilih
  onApplicationTypeChange() {
    this.selectedScheduleType = this.selectedApplicationType;
    this.loadHistoryRequests(this.selectedScheduleType)
  }

  isAccessCard(data: AllData): data is AccessCard {
    return (data as AccessCard).access_card_status !== undefined;
  }

  isOvernightParking(data: AllData): data is OvernightParking {
      return (data as OvernightParking).vehicle_number !== undefined;
  }

  isBicycleTag(data: AllData): data is BicycleTag {
      return (data as BicycleTag).bicycle_tag !== undefined;
  }

  isRegisteredCoach(data: AllData): data is RegisteredCoach {
      return (data as RegisteredCoach).coach_name !== undefined;
  }

  isRequestSchedule(data: AllData): data is RequestSchedule {
      return (data as RequestSchedule).schedule_type !== undefined;
  }

  isPetRegistration(data: AllData): data is PetRegistration {
      return (data as PetRegistration).type_of_pet !== undefined;
  }

  isAppeal(data: AllData): data is Appeal {
      return (data as Appeal).appeal_status !== undefined;
  }

getRequestValue(allData: any, field: string): string {
  // Convert field name to property name (lowercase and replace spaces with underscores)
  const propertyName = field.toLowerCase().replace(/ /g, '_');
  
  // Check if property exists in allData
  if (propertyName in allData) {
    return allData[propertyName] !== null && allData[propertyName] !== undefined ? 
      String(allData[propertyName]) : '-';
  }
  
  // Special cases for field mapping
  switch (propertyName) {
    case 'create_date':
      return allData.create_date || '-';
    case 'states':
      return allData.states || '-';
    case 'appeal_status':
      return allData.appeal_status || '-';
    case 'reason_for_appeal':
      return allData.reason_for_appeal ? String(allData.reason_for_appeal) : '-';
    // Add more cases as needed
    default:
      return '-';
  }
}

  getIconName(state: string): string {
    switch (state) {
      case 'Approved':
        return 'checkmark';
      case 'Pending Approval':
      case 'Pending Payment':
        return 'time';
      case 'Rejected':
      case 'Cancelled':
        return 'close';
      case 'Requested':
        return 'help-circle';
      default:
        return 'help-circle';
    }
  }

}
