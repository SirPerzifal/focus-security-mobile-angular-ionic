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
  Events: any = [];

  isDayClick: boolean = false; // Menyimpan status modal
  isTaskClick: boolean = false; //
  // isBgOn: boolean = false; // Pastikan ini diinisialisasi di constructor atau di tempat yang sesuai

  private _selectedDate: string = '';

  task: any = [];
  hasTasks: boolean = false; // Menyimpan status apakah ada tugas
  showCompletedTasks: boolean = false; // Menyimpan status untuk menampilkan tugas yang diselesaikan
  newTaskTitle: string = ''; // Menyimpan judul tugas baru
  timeTask: string = ''; 

  constructor(private router: Router,) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { day: any };
    if (state) {
      this.ViewDate = state.day.date;
      if (this.ViewDate) {
        this.selectedDate = new Date(this.ViewDate.getTime() - (this.ViewDate.getTimezoneOffset() * 80000)).toISOString();
      }
    } 
  }

  get selectedDate(): string {
    return this._selectedDate;
  }
  
  set selectedDate(value: string) {
    this._selectedDate = value;
    this.ViewDate = new Date(value); // Update ViewDate saat selectedDate berubah
    this.loadTask(); // Panggil loadTask untuk memperbarui daftar tugas
  }

  ngOnInit() {
    console.log("tes");
    this.loadTask();
    this.loadEvents();
  }

  loadEvents() {
    const now = new Date();
    this.Events = [
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
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0), // 12:00 PM
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0), // 1:00 PM
        title: 'Event 3',
        color: { primary: '#1e90ff', secondary: '#D1E8FF' },
      }
    ];
  }

  loadTask() {
    // Simulasi load data task
    const now = new Date();
    const tasks = [
      {
        id: 1,
        title: 'Task 1',
        completed: false,
        due_date: '12:23',
        day: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0), // 10:00 AM
      },
      {
        id: 2,
        title: 'Task 2',
        completed: true,
        due_date: '13:23',
        day: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0), // 10:00 AM
      },
    ];
  
    // Filter tasks berdasarkan tanggal
    this.task = tasks.filter(t => {
      // Membandingkan tahun, bulan, dan hari
      return t.day.getFullYear() === this.ViewDate.getFullYear() &&
             t.day.getMonth() === this.ViewDate.getMonth() &&
             t.day.getDate() === this.ViewDate.getDate();
    });

    // Perbarui status hasTasks
    this.hasTasks = this.task.length > 0; // Jika ada tugas, set true
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
        due_date: this.timeTask, // Atur tanggal jatuh tempo (Anda bisa menyesuaikannya)
        day: this.ViewDate // Atur hari tugas baru (Anda bisa menyesuaikannya)
      };
      this.task.push(newTask); // Tambahkan tugas baru ke array
      this.newTaskTitle = ''; // Reset input
      this.isTaskClick = false;
      this.hasTasks = true
    }
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // bgOn() {
  //   // if (this.isBgOn === true) {
  //   //   this.isBgOn = false;
  //   // } else {
  //   //   this.isBgOn = true;
  //   // }
  //   this.isBgOn = true;
  // }

  // bgOn() {
  //   if (this.isBgOn) {
  //     // Jika isBgOn sudah true, set menjadi false untuk memulai fadeOut
  //     this.isBgOn = false;

  //     // Tunggu animasi selesai sebelum menghapus elemen
  //     setTimeout(() => {
  //       this.isBgOn = false; // Hapus elemen setelah animasi selesai
  //     }, 500); // Sesuaikan dengan durasi animasi fadeOut
  //   } else {
  //     // Jika isBgOn false, set menjadi true untuk memulai fadeIn
  //     this.isBgOn = true;
  //   }
  // }

}
