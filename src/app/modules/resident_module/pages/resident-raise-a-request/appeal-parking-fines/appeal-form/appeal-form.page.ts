import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appeal-form',
  templateUrl: './appeal-form.page.html',
  styleUrls: ['./appeal-form.page.scss'],
})
export class AppealFormPage implements OnInit {

  appealDataForm: any;
  reasonForAppeal: string = '';

  constructor(private router: Router) {  
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { appealData: any};
    if (state) {
      this.appealDataForm = state.appealData;
    }
  }

  ngOnInit() {
    console.log('tes')
  }

  onSubmit() {
    console.log('Submitting appeal:', this.appealDataForm.ReportNo, this.appealDataForm.VehicleNo, this.appealDataForm, this.appealDataForm.OffenceDate, this.reasonForAppeal);
    // Tambahkan logika untuk mengirim data ke server atau melakukan tindakan lain
  }

  backToAppealParkingFines() {
    this.appealDataForm = null;
    this.reasonForAppeal = '';
    this.router.navigate(['/appeal-parking-fines']);
  }

}
