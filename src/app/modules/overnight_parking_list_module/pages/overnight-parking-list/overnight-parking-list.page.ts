import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { forkJoin, interval, Subject } from 'rxjs';

@Component({
  selector: 'app-overnight-parking-list',
  templateUrl: './overnight-parking-list.page.html',
  styleUrls: ['./overnight-parking-list.page.scss'],
})
export class OvernightParkingListPage implements OnInit {

  parkingVehicles: any[] = [
    {
      id:1,
      vehicleNumber:'SBA 1234 A'
    },
    {
      id:2,
      vehicleNumber:'SBP 1818 T'
    },
    {
      id:3,
      vehicleNumber:'XB 1234 A'
    },
    {
      id:4,
      vehicleNumber:'SDN 7484 U'
    },
    {
      id:5,
      vehicleNumber:'SJD 6534 Y'
    },  
  ];
  // renovationSchedules: Schedule[] = [];
  isLoading: boolean = false;
  startDate: Date = new Date('2024-01-01')
  endDate: Date = new Date()

  // Subject untuk mengelola subscription
  private refreshInterval: any;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Load data pertama kali
    // this.loadSchedules();

    // // Set interval untuk refresh setiap 5 detik
    // this.refreshInterval = setInterval(() => {
    //   this.loadSchedules();
    // }, 5000); // 5000 ms = 5 detik
  }

  // Penting: hapus interval saat komponen di destroy
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  // loadSchedules() {
  //   this.isLoading = true;
    
  //   // Gunakan forkJoin untuk mengambil kedua jenis jadwal secara bersamaan
  //   forkJoin({
  //     moveIn: this.moveInOutService.getMoveInOutSchedules(),
  //     renovation: this.renovatorsService.getRenovationSchedules()
  //   }).subscribe({
  //     next: (results) => {
  //       if (results.moveIn.result.status_code === 200) {
  //         this.moveInSchedules = results.moveIn.result.result;
  //         console.log(results)
  //       } else {
  //         this.presentToast('An error occurred while loading Move In / Out schedule!', 'warning');
  //       }

  //       if (results.renovation.result.status_code === 200) {
  //         this.renovationSchedules = results.renovation.result.result;
  //       } else {
  //         this.presentToast('An error occurred while loading Renovations schedule!', 'warning');
  //       }

  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       this.presentToast('An error occurred while loading Renovations schedule!', 'danger');
  //       console.error(error);
  //       this.isLoading = false;
  //     }
  //   });
  // }

  form(id: Number, vehicleNumber: string) {
    // Navigasi ke halaman form dengan parameter
    this.router.navigate(['overnight-parking-form'], { 
      queryParams: {  
        vehicleNumber: vehicleNumber,
      } 
    });
  }


  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    

    toast.present().then(() => {
      
      
    });;;
  }

}
