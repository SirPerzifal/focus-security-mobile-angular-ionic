import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface UpcomingEvent {
  facilityName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  statusBooked: string;
}

@Component({
  selector: 'app-resident-upcoming-event',
  templateUrl: './resident-upcoming-event.page.html',
  styleUrls: ['./resident-upcoming-event.page.scss'],
})
export class ResidentUpcomingEventPage implements OnInit {
  upcomingEvents: UpcomingEvent[] = [
    {
      facilityName: 'Community Hall',
      eventDate: '12/12/2024',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      bookedBy: 'John Doe',
      statusBooked: 'Approved',
    },
    {
      facilityName: 'Swimming Pool',
      eventDate: '15/12/2024',
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      bookedBy: 'Jane Smith',
      statusBooked: 'Pending Approval',
    },
    {
      facilityName: 'Gymnasium',
      eventDate: '20/12/2024',
      startTime: '5:00 PM',
      endTime: '7:00 PM',
      bookedBy: 'Alice Johnson',
      statusBooked: 'Requested',
    },
  ];

  constructor(private router:Router) {}

  ngOnInit() {}

  toggleDirecttoActiveEvent() {
    // Logic to toggle to active events
    this.router.navigate(['resident-upcoming-event']);
  }

  toggleDirecttoHis() {
    // Logic to toggle to history
    this.router.navigate(['upcoming-event-calendar-view']);
  }

  cancelupcomingEvent() {
    // Logic to cancel the upcoming event
    console.log('Canceling upcoming event');
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
}