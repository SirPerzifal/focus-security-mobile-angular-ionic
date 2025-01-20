import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
  CalendarDateFormatter
} from 'angular-calendar';
import { Subscription } from 'rxjs';
import { CustomDateFormatter } from 'src/utils/custom-date-formatter';
import { Router, NavigationStart } from '@angular/router';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-upcoming-event-calendar-view',
  templateUrl: './upcoming-event-calendar-view.page.html',
  styleUrls: ['./upcoming-event-calendar-view.page.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  encapsulation: ViewEncapsulation.None // Disable encapsulation
})
export class UpcomingEventCalendarViewPage implements OnInit {
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadEvents();
    this.loadTask();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const url = event['url'].split('?')[0];
        console.log(url);
        if (url !== '/upcoming-event-calendar-view') {
          this.viewDate = new Date();
        }
      }
    });
  }

  loadEvents() {
    const now = new Date();
    this.events = [
      {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0), // 10:00 AM
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0), // 11:00 AM
        title: 'Event 1',
        color: { primary: '#ad2121', secondary: '#FAE3E3' },
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0), // 12:00 PM
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0), // 1:00 PM
        title: 'Event 2',
        color: { primary: '#1e90ff', secondary: '#D1E8FF' },
      }
    ];
  }

  toggleTaskCompletion(task: any) {
    task.completed = !task.completed; // Toggle status completed
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
    this.viewDateForDay = day.date; // Mengambil tanggal yang di-click
  
    // Mendapatkan nama hari dalam singkatan
    const optionsWeekday: Intl.DateTimeFormatOptions = { 
      weekday: 'short' // Mengambil singkatan hari
    };
    const shortWeekday = this.viewDateForDay.toLocaleDateString('en-US', optionsWeekday);
  
    // Mendapatkan tanggal
    const optionsDate: Intl.DateTimeFormatOptions = { 
        day: 'numeric' // Mengambil tanggal
      };
    const dayNumber = this.viewDateForDay.toLocaleDateString('en-US', optionsDate);
  
    const optionsMonth: Intl.DateTimeFormatOptions = { 
        month: 'long',
      };      
    const longMonth = this.viewDateForDay.toLocaleDateString('en-US', optionsMonth)
  
    const optionsYear: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
    };      
    const longYear = this.viewDateForDay.toLocaleDateString('en-US', optionsYear)
    
    // Menggabungkan singkatan hari dan tanggal
    this.showDate = `${shortWeekday}, ${dayNumber} ${longMonth} ${longYear}`;
    
    // Menggunakan map untuk mendapatkan array judul event
    this.eventDayClick = day.events.map((event: any) => event); // Mengambil hanya judul dari setiap event
    // console.log(this.eventDayClick.title)
    console.log(this.showDate);
    this.isDayClick = true;
    console.log('Day Click', day);
  }

  handleEvent(event: CalendarEvent) {
    console.log('Event clicked:', event);
  }

  toggleDirecttoActiveEvent() {
    // Logic to toggle to active events
    this.router.navigate(['resident-upcoming-event']);
  }

  toggleDirecttoHis() {
    // Logic to toggle to history
    this.router.navigate(['upcoming-event-calendar-view']);
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
