import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite-from-history',
  templateUrl: './invite-from-history.page.html',
  styleUrls: ['./invite-from-history.page.scss'],
})
export class InviteFromHistoryPage implements OnInit {
  // Array untuk menyimpan data history
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
    }
    // Tambahkan data lain jika diperlukan
  ];

  // Array untuk menyimpan data yang dipilih
  selectedInvitees: any[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // Metode untuk memilih atau membatalkan pilihan invitee
  toggleSelect(invitee: any) {
    const index = this.selectedInvitees.indexOf(invitee);
    if (index > -1) {
      // Jika sudah dipilih, hapus dari array
      this.selectedInvitees.splice(index, 1);
    } else {
      // Jika belum dipilih, tambahkan ke array
      this.selectedInvitees.push(invitee);
    }
  }

  // Metode untuk mengonfirmasi pilihan dan mengarahkan ke halaman invite-form
  confirmSelection() {
    this.router.navigate(['/invite-form'], { state: { selectedInvitees: this.selectedInvitees } });
  }
}