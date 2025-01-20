import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-renovation-permit',
  templateUrl: './renovation-permit.page.html',
  styleUrls: ['./renovation-permit.page.scss'],
})
export class RenovationPermitPage implements OnInit {

  renovationForm: FormGroup;
  agreementChecked: boolean = false; // Status checkbox
  isModalOpen: boolean = false; // Status modal
  dateNow = new Date().toISOString().slice(0, 10);

  constructor(private fb: FormBuilder, private renovationService: RaiseARequestService, private toastController: ToastController, private route: Router) {
    this.renovationForm = this.fb.group({
      requestorId: [1],
      name_of_resident: ['KingsMan Condominium'],
      phone_number: ['085830122464'],
      renovation_date: ['', Validators.required],
      renovation_time: ['', Validators.required],
      partner_name: ['Veknesh'],
      renovation_type: ['', Validators.required],
      block: [1],
      unit: [1],
    });
  }

  showTimeInfo() {
    this.isModalOpen = true; // Membuka modal
  }

  ngOnInit() {
    console.log('tes')
  }

  onSubmit() {
    if (this.renovationForm.valid) {
      console.log(this.renovationForm.value);

      // Gabungkan renovation_date dan renovation_time
      const renovationDate = this.renovationForm.value.renovation_date;
      const renovationTime = this.renovationForm.value.renovation_time;

      // Format menjadi string ISO
      const formattedDateTime = new Date(`${renovationDate}T${renovationTime}`);

      // Panggil service untuk mengirim data
      this.renovationService.postSchedule(
        formattedDateTime.toISOString(),
        this.renovationForm.value.requestorId,
        this.renovationForm.value.renovation_type,
        this.renovationForm.value.block,
        this.renovationForm.value.unit
      ).subscribe({
        next: (response) => {
          console.log('Response:', response);
          this.presentToast('Request submitted successfully!', 'success');
          this.route.navigate(['resident-raise-a-request'])
        },
        error: (error) => {
          console.error('Error:', error);
          this.presentToast('Failed to submit request.', 'danger');
        }
      });
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}
