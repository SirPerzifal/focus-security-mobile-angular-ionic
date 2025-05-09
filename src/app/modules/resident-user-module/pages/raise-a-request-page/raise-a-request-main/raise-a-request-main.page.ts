import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
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

  constructor(
    private mainApi: MainApiResidentService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onClickSquareBottom(event: any) {
    this.router.navigate(['raise-request-form-page'], {
      state: {
        pageName: event[1]
      }
    })
  }

  onClickNavTabs(event: any) {
    this.subPageName = `${event[1]}`;

    if (this.subPageName === 'History Request') {
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

  loadHistoryRequests() {
    this.mainApi.endpointMainProcess({}, 'get/raise_a_request_status').subscribe(      
      (response: any) => {
        // console.log(response)
        const { data } = response.result;

        const processData = (item: any, title: string, fields: string[]) => {
          return item.data.map((entry: any) => {
            const result: any = { title, states: entry.states, create_date: entry.create_date };
            fields.forEach(field => {
              result[field] = entry[field];
            });
            return result;
          });
        };

        this.accessCard = data.access_cards ? processData(data.access_cards, data.access_cards.title, ['access_card_status', 'access_card_end_date']) : [];
        this.overnight = data.overnight_parking ? processData(data.overnight_parking, data.overnight_parking.title, ['vehicle_number', 'approved_end_date']) : [];
        this.bicycle = data.bicycle_tags ? processData(data.bicycle_tags, data.bicycle_tags.title, ['bicycle_tag', 'bicycle_brand']) : [];
        this.coach = data.registered_coaches ? processData(data.registered_coaches, data.registered_coaches.title, ['coach_name', 'expected_start_date']) : [];
        this.schedule = data.request_schedules ? processData(data.request_schedules, data.request_schedules.title, ['schedule_type', 'schedule_date']) : [];
        this.pet = data.pets ? processData(data.pets, data.pets.title, ['type_of_pet', 'pet_breed']) : [];
        this.appeal = data.offences ? data.offences.data.map((appeal: any) => ({
          appeal_status: appeal.appeal_status,
          title: data.offences.title,
          is_appeal: appeal.is_appeal,
          reason_for_appeal: appeal.reason_for_appeal,
        })) : [];

        this.allDatas = [
          ...this.accessCard,
          ...this.overnight,
          ...this.bicycle,
          ...this.coach,
          ...this.schedule,
          ...this.pet,
          ...this.appeal
        ].filter(item => item); // Filter out any undefined or null items
        
        this.filteredDatas = [
          ...this.accessCard,
          ...this.overnight,
          ...this.bicycle,
          ...this.coach,
          ...this.schedule,
          ...this.pet,
          ...this.appeal,
        ].filter(item => item); // Filter out any undefined or null items
        
        this.typeSchedule = [...new Set(this.schedule.map((type: any) => type.schedule_type))];
        this.isLoading = false;
      },
      (error) => {
        console.error("Error loading history requests:", error);
      }
    )
  }

  selectedScheduleType: string = ''; // Variabel untuk menyimpan tipe jadwal yang dipilih
  onApplicationTypeChange() {
    // console.log('Selected Application Type:', this.selectedApplicationType);
    // Memfilter allDatas berdasarkan selectedApplicationType
    if (this.selectedApplicationType === 'Move In / Move Out' || this.selectedApplicationType === 'Renovation') {
      // Jika tipe aplikasi adalah Request schedules, filter berdasarkan Schedule Type
      this.selectedScheduleType = this.selectedApplicationType;
      if (this.selectedApplicationType === 'Move In / Move Out') {
        const array1 = this.schedule.filter(item => item.schedule_type === 'Move In');
        const array2 = this.schedule.filter(item => item.schedule_type === 'Move Out');
        this.filteredDatas =  array1.concat(array2); ;
      } else {
        this.filteredDatas = this.schedule.filter(item => item.schedule_type === this.selectedScheduleType);
      }
      // // console.log('Filtered Data:', this.filteredDatas);
    } else {
      this.filteredDatas = this.allDatas.filter(item => item.title === this.selectedApplicationType);
    }
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

  getRequestValue(allData: AllData, field: string): string {
    const fieldMap: { [key: string]: string } = {
      'create date': 'create_date',
      'states': 'states',
      'access card status': 'access_card_status',
      'access card end date': 'access_card_end_date',
      'vehicle number': 'vehicle_number',
      'approved end date': 'approved_end_date',
      'bicycle tag': 'bicycle_tag',
      'bicycle brand': 'bicycle_brand',
      'coach name': 'coach_name',
      'expected start date': 'expected_start_date',
      'schedule type': 'schedule_type',
      'schedule date': 'schedule_date',
      'type of pet': 'type_of_pet',
      'pet breed': 'pet_breed',
      'appeal status': 'appeal_status',
      'reason for appeal': 'reason_for_appeal',
    };

    const mappedField = fieldMap[field.toLowerCase()];

    if (!mappedField) {
        return '';
    }

    if (this.isAccessCard(allData)) {
        return String(allData[mappedField as keyof AccessCard] || '-');
    } else if (this.isOvernightParking(allData)) {
        return String(allData[mappedField as keyof OvernightParking] || '-');
    } else if (this.isBicycleTag(allData)) {
        return String(allData[mappedField as keyof BicycleTag] || '-');
    } else if (this.isRegisteredCoach(allData)) {
        return String(allData[mappedField as keyof RegisteredCoach] || '-');
    } else if (this.isRequestSchedule(allData)) {
        return String(allData[mappedField as keyof RequestSchedule] || '-');
    } else if (this.isPetRegistration(allData)) {
        return String(allData[mappedField as keyof PetRegistration] || '-');
    } else if (this.isAppeal(allData)) {
        return String(allData[mappedField as keyof Appeal] || '-');
    }

    return '';
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
