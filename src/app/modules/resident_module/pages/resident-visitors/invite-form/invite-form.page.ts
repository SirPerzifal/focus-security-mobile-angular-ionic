import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

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
export class InviteFormPage implements OnInit, AfterViewInit {
  @ViewChild('formContainer') formContainer: ElementRef | null = null;

  inviteeFormList: Invitee[] = [];
  addInviteeText: string = 'Add Invitee';

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadInvitees();
  }

  ngAfterViewInit() {
    // Jika ada masalah rendering, coba refresh view
    this.refreshView();
  }

  loadInvitees() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const selectedInvitees = navigation.extras.state['selectedInvitees'] as Invitee[];
      
      if (selectedInvitees && selectedInvitees.length > 0) {
        // Gunakan spread operator untuk membuat salinan baru
        this.inviteeFormList = [...selectedInvitees];
        this.addInviteeText = 'Add More Invitees';
      }
    }

    // Jika tidak ada invitee, tambahkan satu form kosong
    if (this.inviteeFormList.length === 0) {
      this.addInvitee();
    }
  }

  addInvitee() {
    // Tambahkan objek kosong dengan struktur Invitee
    this.inviteeFormList.push({ 
      name: '', 
      phone: '', 
      plate: '' 
    });
    
    // Pastikan teks berubah
    this.addInviteeText = 'Add More Invitees';

    // Refresh view
    this.refreshView();
  }

  refreshView() {
    // Metode untuk memaksa Angular melakukan change detection
    setTimeout(() => {
      if (this.formContainer) {
        // Tambahkan pengecekan null sebelum mengakses nativeElement
        this.formContainer.nativeElement.innerHTML = 
          this.formContainer.nativeElement.innerHTML;
      }
    });
  }

  // Tambahkan metode untuk menangani form submission
  onSubmit() {
    // Lakukan validasi atau proses data form di sini
    console.log('Invitee List:', this.inviteeFormList);
    
    // Contoh validasi sederhana
    const isValid = this.inviteeFormList.every(invitee => 
      invitee.name.trim() !== '' && 
      invitee.phone.trim() !== '' && 
      invitee.plate.trim() !== ''
    );

    if (isValid) {
      // Lakukan proses selanjutnya, misalnya kirim data
      alert('Form valid! Mengirim data...');
    } else {
      alert('Harap lengkapi semua field');
    }
  }
}