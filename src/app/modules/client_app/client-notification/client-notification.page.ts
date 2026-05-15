import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { RecordsResidentService } from 'src/app/service/vms/records/records-resident.service';

interface NotificationGroup {
  date: string;
  dayName: string;
  notifications: any[];
}

@Component({
  selector: 'app-client-notification',
  templateUrl: './client-notification.page.html',
  styleUrls: ['./client-notification.page.scss'],
})
export class ClientNotificationPage implements OnInit {

  constructor(public functionMain: FunctionMainService, private clientMainService: ClientMainService, private recordsResidentService: RecordsResidentService, private router: Router) { }

  ngOnInit() {
    this.loadNotification()
  }

  Notifications: any = []
  filteredNotifications: any = []
  groupedNotifications: NotificationGroup[] = []
  faPhone = faPhone

  isLoading = false
  async loadNotification() {
    this.isLoading = true
    this.functionMain.vmsPreferences().then((value: any) => {
      this.clientMainService.getApi({ text: this.searchTerm }, '/client/get/notifications').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code == 200) {
            this.Notifications = results.result.notifications
            this.filteredNotifications = this.Notifications
            this.groupedNotifications = this.groupByDate(this.filteredNotifications)
          } else {
            this.functionMain.presentToast(`An error occurred while loading notifications!`, 'danger');
          }
          this.isLoading = false
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while loading notifications!', 'danger');
          console.error(error);
          this.isLoading = false
        }
      });
    })
  }

  onBack() {
    this.router.navigate(['/client-main-app'], { queryParams: { reload: true } })

  }

  handleRefresh(event: any) {
    this.loadNotification().then(() => event.target.complete())
  }

  searchTerm = ''

  markAllAsRead() {
    this.clientMainService.getApi({ read_all: true }, '/client/get/notifications').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.Notifications = results.result.notifications
          this.filteredNotifications = this.Notifications
          this.groupedNotifications = this.groupByDate(this.filteredNotifications)
        } else {
          this.functionMain.presentToast(`An error occurred while marking all notifications as read!`, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while marking all notifications as read!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  goTo(path: string, notification_id: number) {
    this.clientMainService.getApi({ notification_id: notification_id }, '/client/get/notifications').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.Notifications = results.result.notifications
          this.filteredNotifications = this.Notifications
          this.groupedNotifications = this.groupByDate(this.filteredNotifications)
        } else {
          this.functionMain.presentToast(`An error occurred while marking all notifications as read!`, 'danger');
        }
        this.isLoading = false
        if (path === '') {
          return
        } else {
          this.router.navigate([path]);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while marking all notifications as read!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  groupByDate(notifications: any[]): NotificationGroup[] {
    const groups: { [date: string]: any[] } = {};
    const dayNames: { [date: string]: string } = {};
    notifications.forEach((notification: any) => {
      const rawDate = this.functionMain.convertNewDateTZ(notification.date);
      const datePart = rawDate.split(' ')[0];
      if (!groups[datePart]) {
        groups[datePart] = [];
        // Parse the raw ISO-like date string for day name
        const dateObj = new Date(notification.date.replace(' ', 'T'));
        dayNames[datePart] = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      }
      groups[datePart].push(notification);
    });
    return Object.keys(groups).map(date => ({ date, dayName: dayNames[date], notifications: groups[date] }));
  }
}

