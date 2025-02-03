import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-make-an-event',
  templateUrl: './make-an-event.page.html',
  styleUrls: ['./make-an-event.page.scss'],
})
export class MakeAnEventPage implements OnInit {

  faPlus = faPlus;
  ViewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  CatchFromCalendarView: any = [];
  Events: any = [];
  aboutDate = {
    longDay: '',
    shortDay: '',
    dayNumber: '',
    longMonth: '',
    shortMonth: '',
    year: '',
  }
  isDayClick: boolean = false; // Menyimpan status modal

  constructor(private router: Router,) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { day: any };
    if (state) {
      console.log('tes',state);
      this.ViewDate = state.day.date;
      this.handleCatchFromCalendarView(state);
      if (this.CatchFromCalendarView && this.Events && this.aboutDate) {
        console.log("jadi ni", this.CatchFromCalendarView);
        console.log("jadi ni", this.Events);
        console.log("jadi ni", this.aboutDate);
      }
    } 
  }

  handleCatchFromCalendarView(state: any) {

    // Mendapatkan nama hari dalam singkatan
    const optionsLongWeekday: Intl.DateTimeFormatOptions = { 
      weekday: 'short' // Mengambil singkatan hari
    };
    const LongWeekday = state.day.date.toLocaleDateString('en-US', optionsLongWeekday);
    this.aboutDate.shortDay = LongWeekday;
    // Mendapatkan nama hari dalam singkatan
    const optionsWeekday: Intl.DateTimeFormatOptions = { 
      weekday: 'short' // Mengambil singkatan hari
    };
    const shortWeekday = state.day.date.toLocaleDateString('en-US', optionsWeekday);
  
    // Mendapatkan tanggal
    const optionsDate: Intl.DateTimeFormatOptions = { 
        day: 'numeric' // Mengambil tanggal
      };
    const dayNumber = state.day.date.toLocaleDateString('en-US', optionsDate);
    this.aboutDate.dayNumber = dayNumber;
  
    // Mendapatkan Bulan
    const optionsMonth: Intl.DateTimeFormatOptions = { 
        month: 'long',
      };      
    const longMonth = state.day.date.toLocaleDateString('en-US', optionsMonth)
  
    // Mendapatkan Tahun
    const optionsYear: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
    };      
    const longYear = state.day.date.toLocaleDateString('en-US', optionsYear)
    
    // Menggabungkan singkatan hari dan tanggal
    this.CatchFromCalendarView = `${shortWeekday}, ${dayNumber} ${longMonth} ${longYear}`;
    
    this.Events = state.day.events.map((event: any) => ({
      start: new Date(event.start), // pastikan ini adalah tanggal yang valid
      end: new Date(event.end), // pastikan ini adalah tanggal yang valid
      title: event.title, // judul event
      color: { primary: '#1e90ff', secondary: '#D1E8FF' } // warna event
    }));
  }

  ngOnInit() {
    console.log("tes");
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
