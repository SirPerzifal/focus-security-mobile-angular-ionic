import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-invite-from-history',
  templateUrl: './invite-from-history.page.html',
  styleUrls: ['./invite-from-history.page.scss'],
})
export class InviteFromHistoryPage implements OnInit {
  historyData: any[] = [
    {
      name: 'Sunil Jayakumar',
      phone: '085830122464',
      plate: 'SNK5424D'
    },
    {
      name: 'Ashwinder',
      phone: '085841233575',
      plate: 'SNK6535D'
    },
    {
      name: 'Daniel',
      phone: '085821233575',
      plate: 'SNK6035D'
    }
  ];

  selectedInvitees: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // Cek apakah ada existing invitees yang dikirim dari invite-form
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const existingInvitees = navigation.extras.state['existingInvitees'];
      
      // Tandai invitee yang sudah ada di form sebelumnya
      if (existingInvitees) {
        this.selectedInvitees = existingInvitees.filter((existing: any) => 
          this.historyData.some(history => 
            history.name === existing.name && 
            history.phone === existing.phone && 
            history.plate === existing.plate
          )
        );
      }
    }
  }

  toggleSelect(invitee: any) {
    const index = this.selectedInvitees.findIndex(
      selected => 
        selected.name === invitee.name && 
        selected.phone === invitee.phone && 
        selected.plate === invitee.plate
    );

    if (index > -1) {
      this.selectedInvitees.splice(index, 1);
    } else {
      this.selectedInvitees.push(invitee);
    }
  }

  confirmSelection() {
    // Gunakan NavigationExtras untuk mengirim data
    const navigationExtras: NavigationExtras = {
      state: {
        selectedInvitees: this.selectedInvitees
      }
    };
    
    this.router.navigate(['/invite-form'], navigationExtras);
  }
}