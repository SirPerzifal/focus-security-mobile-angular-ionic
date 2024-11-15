import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface Invitee {
  name: string;
  phone: string;
  plate: string;
}

@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.page.html',
  styleUrls: ['./invite-form.page.scss'],
})
export class InviteFormPage implements OnInit {
  inviteeFormList: Invitee[] = [];
  addInviteeText: string = 'Add Invitee';
  isFormInitialized: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Gunakan setTimeout untuk memastikan rendering
    this.route.queryParams.subscribe(params => {
      this.initializeInviteeForm(params);
    });
    console.log(this.isFormInitialized)
    console.log(this.inviteeFormList)
  }

  initializeInviteeForm(params?: any) {
    // Cek state dari navigasi saat ini
    const navigation = this.router.getCurrentNavigation();
    const navigationState = navigation?.extras.state;

    // Cek state dari route
    let selectedInvitees: any[] = [];

    // Prioritaskan state dari navigasi
    if (navigationState && navigationState['selectedInvitees']) {
      selectedInvitees = navigationState['selectedInvitees'];
    } 
    // Jika tidak ada, cek params
    else if (params && params['selectedInvitees']) {
      try {
        selectedInvitees = JSON.parse(params['selectedInvitees']);
      } catch (error) {
        console.error('Error parsing selectedInvitees', error);
      }
    }

    // Proses data invitee
    if (selectedInvitees && selectedInvitees.length > 0) {
      this.inviteeFormList = selectedInvitees.map((invitee: any) => ({
        name: invitee.name || '',
        phone: invitee.phone || '',
        plate: invitee.plate || ''
      }));
      this.addInviteeText = 'Add More Invitees';
    }

    // Jika tidak ada data, tambahkan form kosong
    if (this.inviteeFormList.length === 0) {
      this.addInvitee();
    }

    // Tandai form sudah diinisialisasi
    this.isFormInitialized = true;
  }

  addInvitee() {
    const newInvitee: Invitee = { 
      name: '', 
      phone: '', 
      plate: '' 
    };
    
    this.inviteeFormList.push(newInvitee);
    this.addInviteeText = 'Add More Invitees';
  }

  navigateToInviteFormHistory() {
    // Kirim data yang sudah diisi ke halaman invite-form-history
    this.router.navigate(['/invite-from-history'], { 
      state: { existingInvitees: this.inviteeFormList } 
    });
  }

  onSubmit() {
    const isValid = this.inviteeFormList.every(invitee => 
      invitee.name.trim() !== '' && 
      invitee.phone.trim() !== '' && 
      invitee.plate.trim() !== ''
    );

    if (isValid) {
      console.log('Submitting Invitees:', this.inviteeFormList);
    } else {
      alert('Harap lengkapi semua field invitee');
    }
  }

  // Kontrol rendering form
  shouldShowForm(): boolean {
    return this.isFormInitialized && this.inviteeFormList.length > 0;
  }
}