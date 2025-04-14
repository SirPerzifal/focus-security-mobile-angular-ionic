import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import { NotificationService } from 'src/app/service/resident/notification/notification.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

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
  partnerId: number = 0;
  unitId: number = 0;
  isLoading: boolean = true;

  notifications: Notification[] = []; // Ubah ke array of Notification
  filteredNotifications: Notification[] = []; // Ubah ke array of Notification
  searchTerm: string = '';

  constructor(
    private notificationService: NotificationService, 
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.unitId = estate.unit_id;
            this.partnerId = estate.family_id;
            // Load polling data
            this.filteredNotifications = this.notifications; // Initialize with all notifications
            this.loadNotification();
          }
        })
      }
    })
  }

  loadNotification() {
    this.notificationService.getNotifications(this.unitId, this.partnerId).subscribe(
      response => {
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

          // // console.log("this notifications", this.notifications)
          // // console.log("thisfilterednotifications", this.filteredNotifications)
        } else {
          console.error('Error fetching notifications:', response);
        }
      },
      error => {
        console.error('HTTP Error:', error);
      }
    );
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
