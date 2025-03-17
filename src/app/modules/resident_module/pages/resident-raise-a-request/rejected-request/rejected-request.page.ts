import { Component, OnInit, OnDestroy } from '@angular/core';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { Subscription } from 'rxjs';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AllData, AccessCard, OvernightParking, BicycleTag, RegisteredCoach, RequestSchedule, PetRegistration, Appeal } from 'src/models/resident/raiseRequestModel.model';

@Component({
  selector: 'app-rejected-request',
  templateUrl: './rejected-request.page.html',
  styleUrls: ['./rejected-request.page.scss'],
})
export class RejectedRequestPage implements OnInit, OnDestroy {
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

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  constructor(private raiseARequestService: RaiseARequestService, private getUserInfoService: GetUserInfoService) { }

  ngOnInit() {
    this.loadHistoryRequests();
  }

  // Tambahkan metode untuk menangani perubahan pada dropdown jika diperlukan
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

  loadHistoryRequests() {
    this.raiseARequestService.ggetAllStatusRaiseARequest(this.requestorId, this.unitId).subscribe(
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
        // console.log(this.typeSchedule);
        
        // if (this.allDatas.length) {
          //   // console.log("all Data", this.filteredDatas);
        // }
      },
      (error) => {
        console.error("Error loading history requests:", error);
      }
    );
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