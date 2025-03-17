import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';

@Component({
  selector: 'app-appeal-form',
  templateUrl: './appeal-form.page.html',
  styleUrls: ['./appeal-form.page.scss'],
})
export class AppealFormPage implements OnInit {

  appealDataForm: any = {
    id: 0,
    name: '',
    contact_number: '',
    offender_name: '',
    vehicle_number: '',
    block_id: '',
    block_name: '',
    unit_id: '',
    unit_name: '',
    issue_time: '',
    appeal_status: ''
  };
  reasonForAppeal: string = '';

  constructor(private raiseARequestService: RaiseARequestService, private toastController: ToastController, private router: Router) {  
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { appealData: any};
    if (state) {
      this.appealDataForm = {
        id: state.appealData.id,
        name: state.appealData.name,
        contact_number: state.appealData.contact_number,
        offender_name: state.appealData.offender_name,
        vehicle_number: state.appealData.vehicle_number,
        block_id: state.appealData.block_id,
        block_name: state.appealData.block_name,
        unit_id: state.appealData.unit_id,
        unit_name: state.appealData.unit_name,
        issue_time: state.appealData.issue_time,
        appeal_status: state.appealData.appeal_status
      }
      if (this.appealDataForm) {
        // console.log(this.appealDataForm)
      }
    }
  }

  ngOnInit() {
    // console.log('tes')
  }

  onSubmit() {
    // console.log('Submitting appeal:', this.appealDataForm.id, this.reasonForAppeal);
    this.raiseARequestService.postOffenseAppeal(
      this.appealDataForm.id,
      this.reasonForAppeal
    ).subscribe((Response: any) => {
      // console.log(Response);
      if (Response.result.response_code === 200) {
        this.presentToast('Appeal data has been successfully saved!', 'success');
        this.backToAppealParkingFines();
      } else {
        this.presentToast('Failed to save appeal data!', 'danger');
      }
    })
    // Tambahkan logika untuk mengirim data ke server atau melakukan tindakan lain
  }

  backToAppealParkingFines() {
    this.appealDataForm = null;
    this.reasonForAppeal = '';
    this.router.navigate(['/appeal-parking-fines']);
  }  
  
  private routerSubscription!: Subscription;
  OnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

}
