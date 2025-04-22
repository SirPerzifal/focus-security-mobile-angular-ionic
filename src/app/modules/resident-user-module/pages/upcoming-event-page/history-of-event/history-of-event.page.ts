import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-history-of-event',
  templateUrl: './history-of-event.page.html',
  styleUrls: ['./history-of-event.page.scss'],
})
export class HistoryOfEventPage implements OnInit {
  upcomingEvents: any[] = [];

  constructor(private router: Router, private functionMain: FunctionMainService, private alertController: AlertController, private mainApi: MainApiResidentService) { }

  ngOnInit() {
    this.loadUpcomingEvents()
  }

  toggleDirecttoActiveEvent() {
    // Logic to toggle to active events
    this.router.navigate(['history-of-event']);
  }

  toggleDirecttoHis() {
    // Logic to toggle to history
    this.router.navigate(['upcoming-event-page-main']);
  }

  cancelupcomingEvent(upcomingEvent: any) {
    this.mainApi.endpointMainProcess({ event_id: upcomingEvent.id }, 'post/delete_upcoming_event').subscribe((response: any) => {
      // console.log(results)
      if (response.result.response_code == 200) {
        this.loadUpcomingEvents()
        this.functionMain.presentToast(`Successfully cancel the event!`, 'success');
      } else {
        this.functionMain.presentToast(`An error occurred while cancelling the event!`, 'danger');
      }
    })
  }

  getupcomingEventStatusLabel(status: string): string {
    switch (status) {
      case 'Approved':
        return 'Approved';
      case 'Pending Approval':
        return 'Pending Approval';
      case 'Pending Payment':
        return 'Pending Payment';
      case 'Rejected':
        return 'Rejected';
      case 'Cancelled':
        return 'Cancelled';
      case 'Requested':
        return 'Requested';
      default:
        return 'Unknown Status';
    }
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

  async loadUpcomingEvents() {
    const now = new Date();
    this.mainApi.endpointMainProcess({}, 'get/upcoming_event').subscribe((response: any) => {
      // console.log(results)
      if (response.result.response_code == 200) {
        this.upcomingEvents = response.result.result.map((result: any) => ({
          id: result.id,
          start: new Date(result.start_date), // 12:00 PM
          end: new Date(result.end_date), // 1:00 PM
          title: result.event_title,
          description: result.event_description,
          registered_coach_id: result.registered_coach_id,
          registered_coach_name: result.registered_coach_name,
          color: { primary: result.secondary_color_hex_code, secondary: result.primary_color_hex_code },
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        }));
        // console.log(this.upcomingEvents)
        // Ganti array Events dengan referensi baru agar Angular mendeteksi perubahan

      } else {
        this.functionMain.presentToast(`Failed!`, 'danger');
      }
    })
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

  onBack() {
    this.router.navigate(['/upcoming-event-page-main'], {
      queryParams: {reload: true}
    })
  }
}
