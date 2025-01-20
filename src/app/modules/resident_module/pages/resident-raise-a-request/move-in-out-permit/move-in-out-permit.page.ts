import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-move-in-out-permit',
  templateUrl: './move-in-out-permit.page.html',
  styleUrls: ['./move-in-out-permit.page.scss'],
})
export class MoveInOutPermitPage implements OnInit {

  moveInOutForm: FormGroup;
  agreementChecked: boolean = false; // Status checkbox
  isModalOpen: boolean = false; // Status modal
  dateNow = new Date().toISOString().slice(0, 10);

  constructor(private fb: FormBuilder, private moveInOutService: RaiseARequestService, private toastController: ToastController, private route: Router) {
    this.moveInOutForm = this.fb.group({
      requestorId: [1],
      name_of_resident: ['KingsMan Condominium'],
      phone_number: ['085830122464'],
      move_date: ['', Validators.required],
      move_time: ['', Validators.required],
      partner_name: ['Veknesh'],
      move_type: ['', Validators.required],
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
    if (this.moveInOutForm.valid) {
      console.log(this.moveInOutForm.value);

      // Gabungkan move_date dan move_time
      const moveDate = this.moveInOutForm.value.move_date;
      const moveTime = this.moveInOutForm.value.move_time;

      // Format menjadi string ISO
      const formattedDateTime = new Date(`${moveDate}T${moveTime}`);

      // Panggil service untuk mengirim data
      this.moveInOutService.postSchedule(
        formattedDateTime.toISOString(),
        this.moveInOutForm.value.requestorId,
        this.moveInOutForm.value.move_type,
        this.moveInOutForm.value.block,
        this.moveInOutForm.value.unit
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
