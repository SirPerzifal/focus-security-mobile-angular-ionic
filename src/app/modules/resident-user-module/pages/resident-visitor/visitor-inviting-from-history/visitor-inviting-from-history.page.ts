import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-visitor-inviting-from-history',
  templateUrl: './visitor-inviting-from-history.page.html',
  styleUrls: ['./visitor-inviting-from-history.page.scss'],
})
export class VisitorInvitingFromHistoryPage implements OnInit {
  historyData: any[] = [];

  selectedInvitees: any[] = [];
  existingInvitees: any[] = [];

  faCheck = faCheck

  constructor(private router: Router, private mainApi: MainApiResidentService, private functionMain: FunctionMainService) { }

  ngOnInit() {
    this.loadDistinctInviteHistory();
    // Cek apakah ada existing invitees yang dikirim dari invite-form
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const existingInvitees = navigation.extras.state['existingInvitees'];
      
      // Tandai invitee yang sudah ada di form sebelumnya
      if (existingInvitees) {
        this.selectedInvitees = existingInvitees.filter((existing: any) => 
          this.historyData.some(history => 
            history.visitor_name === existing.visitor_name && 
            history.contact_number === existing.contact_number && 
            history.vehicle_number === existing.vehicle_number
          )
        );
        this.existingInvitees = existingInvitees; // Tandai invitee yang sudah ada di form sebelumnya
        console.log('tes-top', existingInvitees)
      }
      console.log('tes', existingInvitees)
      
    }
  }

  loadDistinctInviteHistory() {
    this.mainApi.endpointMainProcess({}, 'get/distinct_visitor_history').subscribe({
      next: (response: any) => {
        if (response.result.response_status === 200) {
          this.historyData = response.result.response_result;
          // console.log(response.result.response_result)
        } else {
          this.functionMain.presentToast('Failed to load vehicle data', 'danger');
          // console.log(response)
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading vehicle data', 'danger');
        console.error('Error:', error);
      }
    });
  }
  
  isInviteeExisted(invitee: any): boolean {
    return this.existingInvitees.some(existingInvitee => 
      existingInvitee.visitor_name === invitee.visitor_name &&
      existingInvitee.contact_number === invitee.contact_number &&
      existingInvitee.vehicle_number === invitee.vehicle_number
    );
  }
  
  toggleSelect(invitee: any) {
    // Cek apakah invitee sudah ada di selectedInvitees
    const index = this.selectedInvitees.findIndex(
      selected => 
        selected.visitor_name === invitee.visitor_name && 
        selected.contact_number === invitee.contact_number && 
        selected.vehicle_number === invitee.vehicle_number
    );
  
    // Cek apakah invitee ada di existingInvitees
    const ifExist = this.existingInvitees.findIndex(
      existing => 
        existing.visitor_name === invitee.visitor_name && 
        existing.contact_number === invitee.contact_number && 
        existing.vehicle_number === invitee.vehicle_number
    );
  
    if (index > -1) {
      // Jika invitee sudah dipilih, hapus dari selectedInvitees
      this.selectedInvitees.splice(index, 1);
      // console.log('tes1', this.existingInvitees);
    } else if (ifExist > -1) {
      // Jika invitee belum dipilih, tambahkan ke selectedInvitees
      this.selectedInvitees.slice(invitee);
      // Jika invitee ada di existingInvitees, hapus dari existingInvitees
      this.existingInvitees.splice(ifExist, 1);
      // console.log('tes4',this.existingInvitees);
    } else {
      // Jika invitee belum dipilih, tambahkan ke selectedInvitees
      this.selectedInvitees.push(invitee);
      
      // Jika invitee ada di existingInvitees, hapus dari existingInvitees
      if (ifExist > -1) {
        this.existingInvitees.splice(ifExist, 1);
      }
      
      // Jika invitee ada di existingInvitees, hapus dari existingInvitees
      if (this.isInviteeExisted(invitee)) {
        this.existingInvitees.splice(ifExist, 1);
        // console.log('tes2',this.existingInvitees);
      }
      // console.log('tes3',this.existingInvitees);
    }
  }

  confirmSelection() {
    // Gabungkan selectedInvitees dan existingInvitees
    const navigationExtras: NavigationExtras = {
      state: {
        selectedInvitees: this.selectedInvitees.concat(this.existingInvitees) // Gabungkan data
      }
    };
    
    // console.log(navigationExtras);
    // Navigasi ke invite-form
    this.router.navigate(['/visitor-invitig-form'], navigationExtras);
  }
}
