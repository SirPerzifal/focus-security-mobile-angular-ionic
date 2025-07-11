import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AlertController, IonDatetime } from '@ionic/angular';
import { CalendarEvent, CalendarView, CalendarDateFormatter } from 'angular-calendar';
import { Subscription } from 'rxjs';
import { CustomDateFormatter } from 'src/utils/custom-date-formatter';
import { trigger, style, animate, transition } from '@angular/animations';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-client-upcoming-events',
  templateUrl: './client-upcoming-events.page.html',
  styleUrls: ['./client-upcoming-events.page.scss'],
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
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  encapsulation: ViewEncapsulation.None // Disable encapsulation
})
export class ClientUpcomingEventsPage implements OnInit {

  viewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  view: CalendarView = CalendarView.Month; // Tampilan default (Week)
  CalendarView = CalendarView; // Enum untuk binding
  events: CalendarEvent[] = [];
  upcomingEvents: any[] = [];
  activeEvents: any[] = [];

  task: any = [];
  showCompletedTasks: boolean = false; // Menyimpan status untuk menampilkan tugas yang diselesaikan
  newTaskTitle: string = ''; // Menyimpan judul tugas baru

  viewDateForDatet: string = this.viewDate.toISOString().split('T')[0]; // Tanggal yang akan ditampilkan dalam

  isDatePickerOpen: boolean = false; // Menyimpan status modal
  
  isDayClick: boolean = false; // Menyimpan status modal
  viewDateForDay: Date = new Date();
  showDate: string = '';
  eventDayClick: any = [];

  isAddEventClick: boolean = false; //

  @ViewChild('datePicker', { static: false }) datePicker?: IonDatetime;

  constructor(
    private router: Router,
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  onBack() {
    this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
  }

  ngOnInit() {
    this.loadUpcomingEvents();
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     const url = event['url'].split('?')[0];
    //     console.log(url);
    //     if (url !== '/client-upcoming-events') {
          
    //     }
    //   }
    // });
    this.viewDate = new Date();
    this.route.queryParams.subscribe(params => {
      console.log("WORK HERE", params)
      if (params) {
        if (params['reload']){
          this.loadUpcomingEvents()
        }
      }
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isLoading = false
  async loadUpcomingEvents() {
    this.isLoading = true
    const now = new Date();
    let params = {
      page: this.currentPage, 
      limit: this.functionMain.limitHistory, 
      is_active: this.isActive,
      issue_date: this.startDateFilter, 
      end_issue_date: this.endDateFilter
    }
    if (this.isActive) {
      this.activeEvents = []
    } else {
      this.pagination = {}
      this.events = [];
    }
    this.clientMainService.getApi(params, '/client/get/upcoming_event').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          const newEvents = results.result.result.map((result: any) => ({
            id: result.id,
            start: new Date(result.start_date), // 12:00 PM
            end: new Date(result.end_date), // 1:00 PM
            title: result.event_title,
            description: result.event_description,
            facility_name: result.registered_coach_facility_name,
            start_date: result.start_date, // 12:00 PM
            end_date: result.end_date, // 1:00 PM
            room_name: result.room_name,
            registered_coach_id: result.registered_coach_id,
            registered_coach_name: result.registered_coach_name,
            color: { primary: result.secondary_color_hex_code, secondary: result.primary_color_hex_code },
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
          }));
          if (this.isActive) {
            this.activeEvents = [...newEvents];
            this.pagination = results.result.pagination
          } else {
            this.pagination = {}
            this.events = [...newEvents];
          }
        } else if (results.result.response_code == 402)  {
          this.pagination = {}
        } else {
          this.functionMain.presentToast(`Failed!`, 'danger');
          this.pagination = {}
        }
        this.isLoading = false
      },
      error: (error) => {
        this.pagination = {}
        this.isLoading = false
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  async onLiftBan(upcomingEvent: any) {
    const alertButtons = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: `Are you sure you want to cancel this event?`,
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => {
            this.cancelupcomingEvent(upcomingEvent)
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  cancelupcomingEvent(upcomingEvent: any) {
    this.clientMainService.getApi({ event_id: upcomingEvent.id, is_client: true }, '/resident/post/delete_upcoming_event').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.loadUpcomingEvents()
          this.functionMain.presentToast(`Successfully cancel the event!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while cancelling the event!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while cancelling the event!', 'danger');
        console.error(error);
      }
    });
  }

  calculateEventDuration(event: CalendarEvent): string {
    const start = event.start;
    const end = event.end;
  
    const startHours = start.getHours();
    const startMinutes = start.getMinutes();
    const endHours = end?.getHours();
    const endMinutes = end?.getMinutes();
  
    // Format the time as HH:MM
    const startTime = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
    const endTime = `${endHours?.toString().padStart(2, '0')}:${endMinutes?.toString().padStart(2, '0')}`;
  
    return `${startTime} - ${endTime}`;
  }

  handleClickDay(day: any) {
    this.router.navigate(['client-events-day-view'], {
      state: {
        day: day,
      }
    })
  }

  handleEvent(event: CalendarEvent) {
    console.log('Event clicked:', event);
  }

  secondText = 'Calendar View'

  toggleDirecttoActiveEvent() {
    this.isMain = false
    this.isActive = true
    this.secondText = 'Active Event'
    this.resetFilter()
  }

  isMain = true
  isActive = false
  toggleDirecttoHis() {
    this.isActive = false
    this.isMain = true
    this.secondText = 'Calendar View'
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

  returnReadDate(date_input: any) {
    let date_temp = new Date(date_input)
    let hours = (date_temp.getHours()).toString().padStart(2, '0')
    let minutes = (date_temp.getMinutes()).toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  returnDate(date_input: any) {
    let date_temp = new Date(date_input)
    let day = date_temp.getDate()
    let month = (date_temp.getMonth() + 1).toString().padStart(2, '0')
    let year = date_temp.getFullYear()
    return `${day}/${month}/${year}`
  }

  viewDetail(record: any) {
    console.log(record)
    this.router.navigate(['/client-events-detail'], {state: {bookingData: record}})
  }

  onStartDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.startDateFilter = input.value;
    this.applyDateFilter();
  }

  onEndDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.endDateFilter = input.value;
    this.applyDateFilter();
  }

  startDateFilter = ''
  endDateFilter = ''

  applyDateFilter() {
    this.currentPage = 1
    this.inputPage = 1
    this.loadUpcomingEvents()
  }

  resetFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyDateFilter()
  }

  handleRefresh(event: any) {
    this.loadUpcomingEvents().then(() => event.target.complete())
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  pageForward(page: number) {
    this.currentPage = page
    this.inputPage = page
    this.loadUpcomingEvents()
  }
}
