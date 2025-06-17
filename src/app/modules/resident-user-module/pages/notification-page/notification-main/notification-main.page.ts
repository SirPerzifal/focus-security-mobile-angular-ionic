import { Component, OnInit } from '@angular/core';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

interface Notification {
  id: number;
  title: string;
  body: string;
  date: string;
  time : string;
}

@Component({
  selector: 'app-notification-main',
  templateUrl: './notification-main.page.html',
  styleUrls: ['./notification-main.page.scss'],
})
export class NotificationMainPage implements OnInit {
  isLoading: boolean = true;

  notifications: Notification[] = []; // Ubah ke array of Notification
  filteredNotifications: Notification[] = []; // Ubah ke array of Notification
  searchTerm: string = '';

  pagination = {
    current_page: 1,    // Changed to number with default value
    per_page: 10,       // Changed to number with default value
    total_page: 1,      // Changed to number with default value
    total_records: 0    // Changed to number with default value
  }

  constructor(
    private mainApi: MainApiResidentService,
    private functionMain: FunctionMainService
  ) { }

  handleRefresh(event: any) {
    this.clearFilter();
    this.notifications = []
    this.isLoading = true;
    setTimeout(() => {
      this.loadNotification();
      event.target.complete();
    }, 1000)
  }

  ngOnInit() {
    this.loadNotification();
  }

  goToPage(event: any, want?: string) {
    const inputValue = parseInt(event.target.value, 10);
    
    // Validate input: ensure it's a number within valid range
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= this.pagination.total_page) {
      this.loadNotification('goto', inputValue);
    } else {
      // Reset to current page if invalid input
      event.target.value = this.pagination.current_page;
      
      // Optional: Show a toast message for invalid page
      this.functionMain.presentToast('Please enter a valid page number between 1 and ' + this.pagination.total_page, 'warning');
    }
  }

  loadNotification(type?: string, page?: number) {
    this.mainApi.endpointMainProcess({
      page: page
    }, 'get/notifications').subscribe((response: any) => {
      if (response.result.response_code === 200) {
        // Mengisi notifications dengan objek
        this.notifications = response.result.notifications; // Simpan objek notifikasi
        // // console.log(response.result.notifications);
        
        
        // Format tanggal untuk setiap notifikasi
        this.notifications = this.notifications.map(notification => {
          const formattedDate = this.formatDate(notification.date); // Format the date

          return {
            ...notification,
            time: formattedDate[0], // Set the time
            date: formattedDate[1], // Set the date
          };
        });
        this.filteredNotifications = this.notifications; // Update filtered notifications
        this.isLoading = false; // Ubah loading status ke false

        this.pagination = {
          current_page: response.result.pagination.current_page ? Number(response.result.pagination.current_page) : 1,
          per_page: response.result.pagination.per_page ? Number(response.result.pagination.per_page) : 10,
          total_page: response.result.pagination.total_pages ? Number(response.result.pagination.total_pages) : 1,
          total_records: response.result.pagination.total_records ? Number(response.result.pagination.total_records) : 0
        }

        // // console.log("this notifications", this.notifications)
        // // console.log("thisfilterednotifications", this.filteredNotifications)
      } else {
        console.error('Error fetching notifications:', response);
      }
    })
  }

  formatDate(dateString: string): Array<string> {
    // Memisahkan tanggal dan waktu
    const [datePart, timePart] = dateString.split(' ');

    // Memisahkan tahun, bulan, dan hari
    const [year, month, day] = datePart.split('-');

    // Memisahkan jam, menit, dan detik
    const [hours, minutes, seconds] = timePart.split(':');

    // Mengubah format jam menjadi 24-jam
    const formattedHours = hours.padStart(2, '0');
    
    // Mengembalikan format dd-mm-yyyy hh:mm:ss
    return [`${formattedHours}:${minutes}`, `${day}-${month}-${year}`];
  }

  searchNotifications() {
    this.filteredNotifications = this.notifications.filter(notification =>
      notification.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearFilter() {
    this.searchTerm = '';
    this.filteredNotifications = this.notifications; // Reset to all notifications
  }

}
