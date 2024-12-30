import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NotificationService } from 'src/app/service/resident/notification/notification.service';

interface Notification {
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-resident-notification',
  templateUrl: './resident-notification.page.html',
  styleUrls: ['./resident-notification.page.scss'],
})
export class ResidentNotificationPage implements OnInit {
  partnerId = 5;
  unitId = 1;

  notifications: Notification[] = []; // Ubah ke array of Notification
  filteredNotifications: Notification[] = []; // Ubah ke array of Notification
  searchTerm: string = '';

  constructor(private notificationService: NotificationService, private toast: ToastController) { }

  ngOnInit() {
    this.filteredNotifications = this.notifications; // Initialize with all notifications
    this.loadNotification();
  }

  loadNotification() {
    this.notificationService.getNotifications(this.unitId, this.partnerId).subscribe(
      response => {
        if (response.result.response_code === 200) {
          // Mengisi notifications dengan objek
          this.notifications = response.result.notifications; // Simpan objek notifikasi
          this.filteredNotifications = this.notifications; // Update filtered notifications
          console.log("heres the data", response);
        } else {
          this.presentToast('Data fetched failed!', 'danger');
          console.error('Error fetching notifications:', response);
        }
      },
      error => {
        this.presentToast('Data fetched failed!', 'danger');
        console.error('HTTP Error:', error);
      }
    );
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      if (color == 'success'){
        pingSound.play().catch((err) => console.error('Error playing sound:', err));
      } else {
        errorSound.play().catch((err) => console.error('Error playing sound:', err));
      }
    });
  }

  searchNotifications() {
    this.filteredNotifications = this.notifications.filter(notification =>
      notification.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      notification.body.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearFilter() {
    this.searchTerm = '';
    this.filteredNotifications = this.notifications; // Reset to all notifications
  }
}