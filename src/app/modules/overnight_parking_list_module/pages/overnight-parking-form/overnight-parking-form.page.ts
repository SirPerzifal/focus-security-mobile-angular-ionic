import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overnight-parking-form',
  templateUrl: './overnight-parking-form.page.html',
  styleUrls: ['./overnight-parking-form.page.scss'],
})
export class OvernightParkingFormPage implements OnInit {

  // @ViewChildren('textInput') textInputs!: QueryList<TextInputComponent>;

  maxPax = 10;
  paxCount = 1;
  block = '';
  unit = '';
  scheduleType = '';
  identificationType = '';
  vehicleNumber='';

  // Array untuk menyimpan data pax
  paxData: any[] = [];
  selectedDate: string = new Date().toISOString();

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.vehicleNumber = params['vehicleNumber'] || '';
      setTimeout(() => {
      });
    });
  }

  // Ambil nilai radio button
  getIdentificationType(): string {
    const nricRadio = document.getElementById('nric_identification') as HTMLInputElement;
    const finRadio = document.getElementById('fin_identification') as HTMLInputElement;

    if (nricRadio.checked) return 'nric';
    if (finRadio.checked) return 'fin';
    return '';
  }

  // Fungsi untuk menampilkan toast
  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    

    toast.present().then(() => {
      
      
    });;;
  }


  refreshVehicle() {
    let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
    let front = ['SBA', 'SBS', 'SAA']
    let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
    this.vehicleNumber = randomVhc
    console.log("Vehicle Refresh", randomVhc)
  }

}
