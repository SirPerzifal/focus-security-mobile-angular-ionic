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
    // Ambil parameter dari route
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.vehicleNumber = params['vehicleNumber'] || '';
      // this.unit = params['unit'] || '';
      // this.scheduleType = params['schedule_type'] || 'move_in_out';
  
      // Setel nilai input secara manual
      setTimeout(() => {
        // this.setInputValue('block', this.block);
        // this.setInputValue('unit', this.unit);
      });
    });
  }

  // Metode baru untuk mengatur nilai input
  // setInputValue(id: string, value: string) {
  //   const input = this.textInputs.find(input => input.id === id);
  //   if (input) {
  //     input.value = value;
  //   }
  // }

  // Update jumlah pax
  // onPaxCountChange(event: any) {
  //   this.paxCount = parseInt(event.target.value, 10);
  //   // Reset pax data
  //   this.paxData = [];
  //   // Kumpulkan data pax setelah mengubah paxCount
  //   this.collectPaxData();
  // }

  // Ambil nilai dari input
  // getInputValue(id: string): string {
  //   const input = this.textInputs.find(input => input.id === id);
  //   return input ? input.value : '';
  // }

  // Ambil nilai radio button
  getIdentificationType(): string {
    const nricRadio = document.getElementById('nric_identification') as HTMLInputElement;
    const finRadio = document.getElementById('fin_identification') as HTMLInputElement;

    if (nricRadio.checked) return 'nric';
    if (finRadio.checked) return 'fin';
    return '';
  }

  // Kumpulkan data pax
  // collectPaxData() {
  //   this.paxData = [];
  //   for (let i = 0; i < this.paxCount; i++) {
  //     const name = this.getInputValue(`name_pax_${i}`);
  //     const nric = this.getInputValue(`nric_fin_pax_${i}`);
  //     console.log(`Pax ${i}: Name = ${name}, NRIC = ${nric}`); // Tambahkan log ini
  //     this.paxData.push({
  //       contractor_name: name,
  //       identification_number: nric
  //     });
  //   }
  // }

  // Fungsi submit untuk SAVE RECORD & OPEN BARRIER
  // saveRecordAndOpenBarrier() {
  //   this.submitForm(true);
  // }

  // Fungsi submit untuk save record only
  // saveRecordOnly() {
  //   this.submitForm(false);
  // }

  // Fungsi submit umum
  // submitForm(openBarrier: boolean = false) {
  //   // Tampilkan loading
  //   // const loading = await this.loadingController.create({
  //   //   message: 'Saving Record...'
  //   // });
  //   // await loading.present();

  //   // Kumpulkan data pax sebelum menggunakan subContractors
  //   this.collectPaxData();

  //   const subContractors = this.paxData.map(pax => ({
  //     contractor_name: pax.contractor_name, // Pastikan ini sesuai dengan nama property yang benar
  //     identification_number: pax.identification_number // Pastikan ini sesuai dengan nama property yang benar
  //   }));

  //   console.log("subcon", subContractors);
  //   console.log("paxdata", this.paxData);

  //   if (!subContractors.length) {      
  //     console.log("No subcontractors found");
  //     return;
  //   }
  
  //   this.moveFormService.addSchedule(
  //     this.getInputValue('contractor_name'),
  //     this.getInputValue('contractor_contact'),
  //     this.getInputValue('contractor_company_name'),
  //     this.getIdentificationType(), // Misalnya 'NRIC', 'Passport', dll
  //     this.getInputValue('contractor_nric/fin'),
  //     this.scheduleType, // 'move_in', 'move_out', dll
  //     this.getInputValue('contractor_vc'), // Nomor kendaraan
  //     this.getInputValue('block'),
  //     this.getInputValue('unit'),
  //     subContractors
  //   ).subscribe({
  //     next: (response) => {
  //       if (response.result.status_code === 200) {
  //         this.presentToast('Data has been successfully saved, and the barrier is now open!', 'success');
  //         this.router.navigate(['home-vms'])
          
  //         if (openBarrier) {
  //           // Logika membuka barrier
  //           console.log('Membuka barrier');
  //           this.presentToast('Data has been successfully saved to the system!', 'success');
  //           this.router.navigate(['home-vms'])
  //         }
  //       } else {
  //         this.presentToast(response.result.status_description, 'danger');
  //       }
  //     },
  //     error: (error) => {
  //       this.presentToast('Error adding schedule', 'danger');
  //       console.error(error);
  //     }
  //   });
  // }

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
