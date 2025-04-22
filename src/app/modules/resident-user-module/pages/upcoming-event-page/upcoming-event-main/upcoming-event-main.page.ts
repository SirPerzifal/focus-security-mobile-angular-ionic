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
  viewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  view: CalendarView = CalendarView.Month; // Tampilan default (Week)
  CalendarView = CalendarView; // Enum untuk binding
  events: CalendarEvent[] = [];

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
    private mainApi: MainApiResidentService,
    public functionMain: FunctionMainService,
    private route: ActivatedRoute,
  ) {}

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

  addTask() {
    if (this.newTaskTitle.trim()) { // Pastikan input tidak kosong
      const newTask = {
        id: this.task.length + 1, // Atur ID baru (Anda mungkin ingin menggunakan cara yang lebih baik untuk mengelola ID)
        title: this.newTaskTitle,
        completed: false,
        due_date: new Date().toLocaleString(), // Atur tanggal jatuh tempo (Anda bisa menyesuaikannya)
      };
      this.task.push(newTask); // Tambahkan tugas baru ke array
      this.newTaskTitle = ''; // Reset input
    }
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
            beforeStart: true,
            afterEnd: true,
          },
        }));

        // Ganti array Events dengan referensi baru agar Angular mendeteksi perubahan
        this.events = [...newEvents];

        // console.log(this.events);
      } else {
      }
    })
    // const now = new Date();
  }
 
  toggleTaskCompletion(task: any) {
    task.completed = !task.completed; // Toggle status completed
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

  loadTask() {
    // Simulasi load data task
    this.task = [
      {
        id: 1,
        title: 'Task 1',
        completed: false,
        due_date: '15.30 am',
      },
      {
        id: 2,
        title: 'Task 2',
        completed: true,
        due_date: '15.31 am',
      },
    ];
  }

  handleClickDay(day: any) {
    // this.viewDateForDay = day.date; // Mengambil tanggal yang di-click
  
    // // Mendapatkan nama hari dalam singkatan
    // const optionsWeekday: Intl.DateTimeFormatOptions = { 
    //   weekday: 'short' // Mengambil singkatan hari
    // };
    // const shortWeekday = this.viewDateForDay.toLocaleDateString('en-US', optionsWeekday);
  
    // // Mendapatkan tanggal
    // const optionsDate: Intl.DateTimeFormatOptions = { 
    //     day: 'numeric' // Mengambil tanggal
    //   };
    // const dayNumber = this.viewDateForDay.toLocaleDateString('en-US', optionsDate);
  
    // const optionsMonth: Intl.DateTimeFormatOptions = { 
    //     month: 'long',
    //   };      
    // const longMonth = this.viewDateForDay.toLocaleDateString('en-US', optionsMonth)
  
    // const optionsYear: Intl.DateTimeFormatOptions = { 
    //   year: 'numeric',
    // };      
    // const longYear = this.viewDateForDay.toLocaleDateString('en-US', optionsYear)
    
    // // Menggabungkan singkatan hari dan tanggal
    // this.showDate = `${shortWeekday}, ${dayNumber} ${longMonth} ${longYear}`;
    
    // // Menggunakan map untuk mendapatkan array judul event
    // this.eventDayClick = day.events.map((event: any) => event); // Mengambil hanya judul dari setiap event
    // // // console.log(this.eventDayClick.title)
    // // console.log(this.showDate);
    // this.isDayClick = true;
    // // console.log('Day Click', day);
    this.router.navigate(['make-a-new-event'], {
      state: {
        day: day,
      }
    })
  }

  handleEvent(event: CalendarEvent) {
    // console.log('Event clicked:', event);
  }

  toggleDirecttoActiveEvent() {
    // Logic to toggle to active events
    this.router.navigate(['history-of-event']);
  }

  toggleDirecttoHis() {
    // Logic to toggle to history
    this.router.navigate(['upcoming-event-page-main']);
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
