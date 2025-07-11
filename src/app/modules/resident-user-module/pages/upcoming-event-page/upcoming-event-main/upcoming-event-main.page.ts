import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
  CalendarDateFormatter
} from 'angular-calendar';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IonDatetime } from '@ionic/angular';

import { CustomDateFormatter } from 'src/utils/custom-date-formatter';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-upcoming-event-main',
  templateUrl: './upcoming-event-main.page.html',
  styleUrls: ['./upcoming-event-main.page.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  encapsulation: ViewEncapsulation.None // Disable encapsulation
})
export class UpcomingEventMainPage implements OnInit {
  isLoading: boolean = false;
  navButtonsMain: any[] = [
    {
      text: 'Calendar View',
      active: true,
      action: 'route',
      routeTo: '/upcoming-event-page-main'
    },
    {
      text: 'Active Event',
      active: false,
      action: 'route',
      routeTo: '/history-of-event'
    },
  ]

  viewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  view: CalendarView = CalendarView.Month; // Tampilan default (Week)
  CalendarView = CalendarView; // Enum untuk binding
  events: CalendarEvent[] = [];

  isDatePickerOpen: boolean = false; // Menyimpan status modal

  @ViewChild('datePicker', { static: false }) datePicker?: IonDatetime;

  constructor(
    private router: Router,
    private mainApi: MainApiResidentService,
    public functionMain: FunctionMainService,
    private route: ActivatedRoute,
  ) {}

  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.loadUpcomingEvents();
      event.target.complete();
    }, 1000)
  }

  ngOnInit() {
    this.loadUpcomingEvents();
    this.route.queryParams.subscribe(params => {
      // console.log("JAAAAIi")
      if (params ) {
        if (params['reload']){
          this.loadUpcomingEvents()
        }
      }
    })
    
  }

  async loadUpcomingEvents() {
    this.mainApi.endpointMainProcess({}, 'get/upcoming_event').subscribe((response: any) => {
      // console.log(results)
      if (response.result.response_code == 200) {
        const newEvents = response.result.result.map((result: any) => ({
          id: result.id,
          start: new Date(result.start_date), // 12:00 PM
          end: new Date(result.end_date), // 1:00 PM
          title: result.event_title,
          description: result.event_description,
          registered_coach_id: result.registered_coach_id,
          color: { primary: result.secondary_color_hex_code, secondary: result.primary_color_hex_code },
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
        }));
        this.isLoading = false;
        // Ganti array Events dengan referensi baru agar Angular mendeteksi perubahan
        this.events = [...newEvents];

        // console.log(this.events);
      } else {
        this.isLoading = false;
      }
    })
    // const now = new Date();
  }

  handleEvent(event: CalendarEvent) {
    // this.router.navigate(['event-detail'], {
    //   state: {
    //     event: event,
    //   }
    // })
  }

  handleClickDay(day: any) {
    this.router.navigate(['make-a-new-event'], {
      state: {
        day: day,
      }
    })
  }

  prev() {
    const currentDate = new Date(this.viewDate);
    currentDate.setMonth(currentDate.getMonth() - 1);
    this.viewDate = currentDate;
  }

  next() {
    const currentDate = new Date(this.viewDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    this.viewDate = currentDate;
  }

  openDatePicker() {
    this.isDatePickerOpen = true; // Membuka modal pemilih tanggal
  }

  onDateChange(event: any) {
    this.viewDate = new Date(event.detail.value);
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
