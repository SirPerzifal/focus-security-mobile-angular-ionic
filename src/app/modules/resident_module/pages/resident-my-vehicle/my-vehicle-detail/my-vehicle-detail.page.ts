import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Vehicle {
  unit_id: string;
  id: string;
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

  constructor(private router: Router) { }

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