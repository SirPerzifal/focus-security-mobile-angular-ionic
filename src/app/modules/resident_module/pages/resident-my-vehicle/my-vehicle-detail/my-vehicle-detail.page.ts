import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyVehicleDetailService } from 'src/app/service/resident/my-vehicle/my-vehicle-detail/my-vehicle-detail.service';
import { AlertController } from '@ionic/angular';

interface Vehicle {
  unit_id: string;
  id: 0;
  type_application: string;
  status: string;
  vehicleNo: string;
  make: string;
  colour: string;
  type: string;
  fees: string;
}

@Component({
  selector: 'app-my-vehicle-detail',
  templateUrl: './my-vehicle-detail.page.html',
  styleUrls: ['./my-vehicle-detail.page.scss'],
})
export class MyVehicleDetailPage implements OnInit {
  vehicle: Vehicle | null = null;

  constructor(private router: Router, private myVehicleDetailService: MyVehicleDetailService, private alertController: AlertController,) { }

  ngOnInit() {
    // Ambil data yang dikirim dari halaman sebelumnya
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.vehicle = navigation.extras.state['vehicleData'] as Vehicle;
    }

    // Jika tidak ada data, kembalikan ke halaman sebelumnya
    if (!this.vehicle) {
      this.router.navigate(['/resident-my-vehicle']);
    }
  }

  backToVehicle() {
    this.vehicle = null;
    this.router.navigate(['/resident-my-vehicle']);
  }

  public async deleteVehicle(
    header: string = 'Cancel', 
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel', 
    vehicleId?: number  // Jadikan optional
  ) {
    console.log(vehicleId)
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: header,
      message: 'Are you sure you want to delete this vehicle?', // Tambahkan pesan konfirmasi
      buttons: [
        {
          text: confirmText,
          cssClass: 'confirm-button',
          handler: () => {
            console.log('Confirmed');
            // Logika konfirmasi
            if (vehicleId) {
              this.myVehicleDetailService.deleteVehicle(vehicleId).subscribe(
                response => {
                  if (response.result.response_code === 200) {
                    console.log("Vehicle deleted successfully", response);
                    this.backToVehicle();
                  } else {
                    console.error('Error deleting vehicle:', response);
                    // Tampilkan pesan kesalahan kepada pengguna
                  }
                },
                error => {
                  console.error('HTTP Error:', error);
                  // Tampilkan pesan kesalahan kepada pengguna
                }
              );
            } else {
              console.error('Vehicle ID is not provided');
              // Tampilkan pesan kesalahan kepada pengguna
            }
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Canceled');
          }
        },
      ]
    });
  
    await alert.present();
  }

  // Method untuk mendapatkan label status
  getStatusLabel(): { text: string, color: string } {
    switch (this.vehicle?.status.toLowerCase()) {
      case 'approved':
        return { text: 'Approved', color: 'text-green-500' };
      case 'pending_approval':
        return { text: 'Pending Approval', color: 'text-blue-500' };
      case 'pending_payment':
        return { text: 'Pending Payment', color: 'text-blue-500' };
      default:
        return { text: 'Unknown', color: 'text-gray-500' };
    }
  }
}